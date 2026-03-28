import { BoxGeometry, Group, Mesh, MeshBasicMaterial, Quaternion, Vector3 } from 'three'

const ROTATE_SNAP_PREVIEW_COLOR = '#ffffff'
const ROTATE_SNAP_PREVIEW_RENDER_ORDER = 114
const DEFAULT_ROTATE_SNAP_PREVIEW_DELAY_MS = 120
const DEFAULT_ROTATE_SNAP_PREVIEW_LINE_SIZE = 1
const DEFAULT_ROTATE_SNAP_PREVIEW_LINE_THICKNESS = 1
const DEFAULT_ROTATE_SNAP_PREVIEW_RADIUS_DEG = 60
const MIN_ROTATE_SNAP_PREVIEW_RADIUS_DEG = 10
const MAX_ROTATE_SNAP_PREVIEW_RADIUS_DEG = 180
const ROTATE_SNAP_PREVIEW_MIN_OPACITY = 0.18
const ROTATE_SNAP_PREVIEW_MAX_OPACITY = 0.68
const ROTATE_SNAP_PREVIEW_TARGET_OPACITY = 1
const ROTATE_SNAP_PREVIEW_BASE_SCALE = 0.72
const ROTATE_SNAP_PREVIEW_PEAK_SCALE = 1
const ROTATE_SNAP_PREVIEW_HIGHLIGHT_MULTIPLIER = 1.2
const ROTATE_SNAP_PREVIEW_VISIBILITY_EPSILON = 0.01
const ROTATE_SNAP_PREVIEW_GEOMETRY = new BoxGeometry(1, 1, 1)
const UNIT_X = new Vector3(1, 0, 0)

export type ReferenceTransformRotateSnapPreviewAxis = 'x' | 'y' | 'z'

export type ReferenceTransformRotateSnapOverlay = {
  axis: ReferenceTransformRotateSnapPreviewAxis
  origin: { x: number; y: number; z: number }
  axisDirection: { x: number; y: number; z: number }
  referenceDirection: { x: number; y: number; z: number }
  landedAngleDeg: number
  snapStepDeg: number
  ringRadius: number
}

export type ReferenceTransformRotateSnapLineTarget = {
  key: string
  position: { x: number; y: number; z: number }
  direction: { x: number; y: number; z: number }
  normalizedDistance: number
  targetOpacity: number
  targetScale: number
  baseLength: number
  baseThickness: number
  isCurrentTarget: boolean
}

type AnimatedRotateSnapSegment = {
  key: string | null
  mesh: Mesh
  material: MeshBasicMaterial
  currentOpacity: number
  targetOpacity: number
  currentScale: number
  targetScale: number
  baseLength: number
  baseThickness: number
  isTargeted: boolean
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const normalizeDirection = (vector: Vector3, fallback: Vector3): Vector3 => {
  if (vector.lengthSq() < 1e-8) {
    return fallback.clone()
  }
  return vector.clone().normalize()
}

const formatVectorKey = (vector: Vector3): string =>
  `${vector.x.toFixed(4)},${vector.y.toFixed(4)},${vector.z.toFixed(4)}`

const getPreviewRadiusDeg = (radiusDeg: number): number =>
  clamp(
    Number.isFinite(radiusDeg) ? radiusDeg : DEFAULT_ROTATE_SNAP_PREVIEW_RADIUS_DEG,
    MIN_ROTATE_SNAP_PREVIEW_RADIUS_DEG,
    MAX_ROTATE_SNAP_PREVIEW_RADIUS_DEG,
  )

const createRotateSnapMaterial = (): MeshBasicMaterial =>
  new MeshBasicMaterial({
    color: ROTATE_SNAP_PREVIEW_COLOR,
    transparent: true,
    opacity: 1,
    toneMapped: false,
    depthTest: false,
    depthWrite: false,
  })

const buildNormalVisualWeight = (
  normalizedDistance: number,
): {
  targetOpacity: number
  targetScale: number
} => {
  const clampedDistance = clamp(normalizedDistance, 0, 1)
  const influence = (1 - clampedDistance) ** 1.65
  return {
    targetOpacity:
      ROTATE_SNAP_PREVIEW_MIN_OPACITY +
      (ROTATE_SNAP_PREVIEW_MAX_OPACITY - ROTATE_SNAP_PREVIEW_MIN_OPACITY) * influence,
    targetScale:
      ROTATE_SNAP_PREVIEW_BASE_SCALE +
      (ROTATE_SNAP_PREVIEW_PEAK_SCALE - ROTATE_SNAP_PREVIEW_BASE_SCALE) * influence,
  }
}

const buildVisualWeight = (
  normalizedDistance: number,
  isCurrentTarget: boolean,
): {
  targetOpacity: number
  targetScale: number
} => {
  const baseWeight = buildNormalVisualWeight(normalizedDistance)
  if (!isCurrentTarget) {
    return baseWeight
  }
  return {
    targetOpacity: ROTATE_SNAP_PREVIEW_TARGET_OPACITY,
    targetScale: baseWeight.targetScale * ROTATE_SNAP_PREVIEW_HIGHLIGHT_MULTIPLIER,
  }
}

const buildReferenceTransformRotateFieldIdentityKey = (
  overlay: ReferenceTransformRotateSnapOverlay,
): string => {
  const origin = new Vector3(overlay.origin.x, overlay.origin.y, overlay.origin.z)
  const axisDirection = normalizeDirection(
    new Vector3(
      overlay.axisDirection.x,
      overlay.axisDirection.y,
      overlay.axisDirection.z,
    ),
    new Vector3(0, 1, 0),
  )
  const referenceDirection = normalizeDirection(
    new Vector3(
      overlay.referenceDirection.x,
      overlay.referenceDirection.y,
      overlay.referenceDirection.z,
    ),
    new Vector3(1, 0, 0),
  )
  return [
    `axis:${overlay.axis}`,
    `origin:${formatVectorKey(origin)}`,
    `axisDir:${formatVectorKey(axisDirection)}`,
    `refDir:${formatVectorKey(referenceDirection)}`,
    `step:${overlay.snapStepDeg.toFixed(4)}`,
  ].join('|')
}

export const buildReferenceTransformRotateSnapLineTargets = (
  overlay: ReferenceTransformRotateSnapOverlay,
  config?: {
    previewRadiusDeg?: number
  },
): ReferenceTransformRotateSnapLineTarget[] => {
  const previewRadiusDeg = getPreviewRadiusDeg(
    config?.previewRadiusDeg ?? DEFAULT_ROTATE_SNAP_PREVIEW_RADIUS_DEG,
  )
  const step = overlay.snapStepDeg
  if (!Number.isFinite(step) || step <= 0 || !Number.isFinite(overlay.ringRadius) || overlay.ringRadius <= 0) {
    return []
  }

  const origin = new Vector3(overlay.origin.x, overlay.origin.y, overlay.origin.z)
  const axisDirection = normalizeDirection(
    new Vector3(
      overlay.axisDirection.x,
      overlay.axisDirection.y,
      overlay.axisDirection.z,
    ),
    new Vector3(0, 1, 0),
  )
  const referenceDirection = normalizeDirection(
    new Vector3(
      overlay.referenceDirection.x,
      overlay.referenceDirection.y,
      overlay.referenceDirection.z,
    ),
    new Vector3(1, 0, 0),
  )
  const landedIndex = Math.round(overlay.landedAngleDeg / step)
  const visibleOffsetCount = Math.max(0, Math.floor(previewRadiusDeg / step))
  const bufferedOffsetCount = visibleOffsetCount + 1
  const baseLength = Math.max(2, overlay.ringRadius)
  const baseThickness = Math.max(0.25, overlay.ringRadius * 0.02)
  const targets: ReferenceTransformRotateSnapLineTarget[] = []

  for (let offsetIndex = -bufferedOffsetCount; offsetIndex <= bufferedOffsetCount; offsetIndex += 1) {
    const absoluteIndex = landedIndex + offsetIndex
    const angularDistanceDeg = Math.abs(offsetIndex * step)
    const isBuffered = angularDistanceDeg > previewRadiusDeg
    const normalizedDistance = clamp(angularDistanceDeg / previewRadiusDeg, 0, 1)
    const angleQuaternion = new Quaternion().setFromAxisAngle(
      axisDirection,
      (absoluteIndex * step * Math.PI) / 180,
    )
    const direction = referenceDirection.clone().applyQuaternion(angleQuaternion).normalize()
    const position = origin.clone().addScaledVector(direction, overlay.ringRadius * 0.5)
    const { targetOpacity, targetScale } = isBuffered
      ? { targetOpacity: 0, targetScale: 0 }
      : buildVisualWeight(normalizedDistance, offsetIndex === 0)
    targets.push({
      key: `rotate:${overlay.axis}:${absoluteIndex}`,
      position: { x: position.x, y: position.y, z: position.z },
      direction: { x: direction.x, y: direction.y, z: direction.z },
      normalizedDistance,
      targetOpacity,
      targetScale,
      baseLength,
      baseThickness,
      isCurrentTarget: offsetIndex === 0,
    })
  }

  return targets
}

export class ReferenceTransformRotateSnapHelper {
  private readonly group = new Group()
  private readonly activeSegmentsByKey = new Map<string, AnimatedRotateSnapSegment>()
  private readonly freeSegments: AnimatedRotateSnapSegment[] = []
  private readonly allSegments: AnimatedRotateSnapSegment[] = []
  private enabled = true
  private lineSize = DEFAULT_ROTATE_SNAP_PREVIEW_LINE_SIZE
  private lineThickness = DEFAULT_ROTATE_SNAP_PREVIEW_LINE_THICKNESS
  private previewRadiusDeg = DEFAULT_ROTATE_SNAP_PREVIEW_RADIUS_DEG
  private delayMs = DEFAULT_ROTATE_SNAP_PREVIEW_DELAY_MS
  private lastFieldIdentityKey: string | null = null

  public constructor() {
    this.group.name = 'ReferenceTransformRotateSnapHelper'
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

  public setLineSize(value: number): void {
    this.lineSize = clamp(
      Number.isFinite(value) ? value : DEFAULT_ROTATE_SNAP_PREVIEW_LINE_SIZE,
      0.25,
      3,
    )
    this.syncSegmentDimensions()
  }

  public setLineThickness(value: number): void {
    this.lineThickness = clamp(
      Number.isFinite(value) ? value : DEFAULT_ROTATE_SNAP_PREVIEW_LINE_THICKNESS,
      0.25,
      3,
    )
    this.syncSegmentDimensions()
  }

  public setPreviewRadiusDeg(value: number): void {
    this.previewRadiusDeg = getPreviewRadiusDeg(value)
  }

  public setDelayMs(value: number): void {
    this.delayMs = clamp(
      Number.isFinite(value) ? value : DEFAULT_ROTATE_SNAP_PREVIEW_DELAY_MS,
      0,
      500,
    )
  }

  public setOverlay(overlay: ReferenceTransformRotateSnapOverlay | null): void {
    if (!this.enabled || overlay === null) {
      this.clearTargets()
      return
    }

    const fieldIdentityKey = buildReferenceTransformRotateFieldIdentityKey(overlay)
    if (fieldIdentityKey !== this.lastFieldIdentityKey) {
      this.resetFieldIdentity()
      this.lastFieldIdentityKey = fieldIdentityKey
    }

    const targets = buildReferenceTransformRotateSnapLineTargets(overlay, {
      previewRadiusDeg: this.previewRadiusDeg,
    })

    this.group.visible = targets.length > 0 || this.group.visible
    this.activeSegmentsByKey.forEach((segment) => {
      segment.isTargeted = false
    })

    targets.forEach((target) => {
      let segment = this.activeSegmentsByKey.get(target.key)
      const isNewSegment = segment === undefined
      if (segment === undefined) {
        segment = this.acquireSegment(target.key)
      }
      segment.isTargeted = true
      segment.mesh.position.set(target.position.x, target.position.y, target.position.z)
      segment.mesh.quaternion.setFromUnitVectors(
        UNIT_X,
        new Vector3(target.direction.x, target.direction.y, target.direction.z).normalize(),
      )
      segment.baseLength = target.baseLength
      segment.baseThickness = target.baseThickness
      segment.targetOpacity = target.targetOpacity
      segment.targetScale = target.targetScale
      if (isNewSegment && segment.currentOpacity <= ROTATE_SNAP_PREVIEW_VISIBILITY_EPSILON) {
        segment.currentOpacity = 0
        segment.currentScale = 0
        segment.material.opacity = 0
        segment.mesh.scale.setScalar(0)
      }
      segment.material.opacity = segment.currentOpacity
      segment.mesh.visible = true
      this.applySegmentScale(segment)
    })

    this.activeSegmentsByKey.forEach((segment) => {
      if (!segment.isTargeted) {
        segment.targetOpacity = 0
        segment.targetScale = 0
      }
    })
  }

  public tick(dt: number): void {
    const visualLerp =
      this.delayMs <= 0 ? 1 : 1 - Math.exp(-dt / Math.max(this.delayMs / 1000, 0.0001))
    let hasVisibleSegment = false
    const keysToRelease: string[] = []

    this.activeSegmentsByKey.forEach((segment, key) => {
      segment.currentOpacity += (segment.targetOpacity - segment.currentOpacity) * visualLerp
      segment.currentScale += (segment.targetScale - segment.currentScale) * visualLerp
      segment.material.opacity = segment.currentOpacity
      this.applySegmentScale(segment)

      const shouldStayVisible =
        segment.currentOpacity > ROTATE_SNAP_PREVIEW_VISIBILITY_EPSILON ||
        segment.targetOpacity > ROTATE_SNAP_PREVIEW_VISIBILITY_EPSILON
      segment.mesh.visible = shouldStayVisible
      if (!shouldStayVisible) {
        segment.currentOpacity = 0
        segment.currentScale = 0
        segment.material.opacity = 0
        segment.mesh.scale.setScalar(0)
        if (!segment.isTargeted) {
          keysToRelease.push(key)
        }
      } else {
        hasVisibleSegment = true
      }
    })

    keysToRelease.forEach((key) => {
      const segment = this.activeSegmentsByKey.get(key)
      if (segment === undefined) {
        return
      }
      this.activeSegmentsByKey.delete(key)
      segment.key = null
      segment.isTargeted = false
      this.freeSegments.push(segment)
    })

    this.group.visible = hasVisibleSegment
  }

  public getDebugSegments(): Array<{
    key: string
    position: { x: number; y: number; z: number }
    currentScale: number
    targetScale: number
    targetOpacity: number
    isTargeted: boolean
  }> {
    return Array.from(this.activeSegmentsByKey.values()).map((segment) => ({
      key: segment.key ?? '',
      position: {
        x: segment.mesh.position.x,
        y: segment.mesh.position.y,
        z: segment.mesh.position.z,
      },
      currentScale: segment.currentScale,
      targetScale: segment.targetScale,
      targetOpacity: segment.targetOpacity,
      isTargeted: segment.isTargeted,
    }))
  }

  public dispose(): void {
    this.allSegments.forEach((segment) => {
      segment.material.dispose()
    })
  }

  private acquireSegment(key: string): AnimatedRotateSnapSegment {
    const segment = this.freeSegments.pop() ?? this.createSegment()
    segment.key = key
    segment.currentOpacity = 0
    segment.targetOpacity = 0
    segment.currentScale = 0
    segment.targetScale = 0
    segment.baseLength = 0
    segment.baseThickness = 0
    segment.isTargeted = true
    segment.material.opacity = 0
    segment.mesh.visible = false
    segment.mesh.scale.setScalar(0)
    this.activeSegmentsByKey.set(key, segment)
    return segment
  }

  private createSegment(): AnimatedRotateSnapSegment {
    const material = createRotateSnapMaterial()
    const mesh = new Mesh(ROTATE_SNAP_PREVIEW_GEOMETRY, material)
    mesh.name = `ReferenceTransformRotateSnapPreviewSegment:${this.allSegments.length + 1}`
    mesh.renderOrder = ROTATE_SNAP_PREVIEW_RENDER_ORDER
    mesh.visible = false
    mesh.frustumCulled = false
    mesh.scale.setScalar(0)
    this.group.add(mesh)
    const segment: AnimatedRotateSnapSegment = {
      key: null,
      mesh,
      material,
      currentOpacity: 0,
      targetOpacity: 0,
      currentScale: 0,
      targetScale: 0,
      baseLength: 0,
      baseThickness: 0,
      isTargeted: false,
    }
    this.allSegments.push(segment)
    return segment
  }

  private applySegmentScale(segment: AnimatedRotateSnapSegment): void {
    segment.mesh.scale.set(
      segment.baseLength * this.lineSize * segment.currentScale,
      segment.baseThickness * this.lineThickness,
      segment.baseThickness * this.lineThickness,
    )
  }

  private syncSegmentDimensions(): void {
    this.allSegments.forEach((segment) => {
      this.applySegmentScale(segment)
    })
  }

  private clearTargets(): void {
    this.lastFieldIdentityKey = null
    this.activeSegmentsByKey.forEach((segment) => {
      segment.isTargeted = false
      segment.targetOpacity = 0
      segment.targetScale = 0
    })
  }

  private resetFieldIdentity(): void {
    this.activeSegmentsByKey.forEach((segment, key) => {
      this.activeSegmentsByKey.delete(key)
      segment.key = null
      segment.isTargeted = false
      segment.currentOpacity = 0
      segment.targetOpacity = 0
      segment.currentScale = 0
      segment.targetScale = 0
      segment.baseLength = 0
      segment.baseThickness = 0
      segment.material.opacity = 0
      segment.mesh.visible = false
      segment.mesh.scale.setScalar(0)
      this.freeSegments.push(segment)
    })
    this.group.visible = false
  }
}
