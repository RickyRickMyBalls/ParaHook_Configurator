import type { ProfileLoop, SketchPlaneTransform } from './sketchTypes'

export type GeometryRequestPlane = 'XY' | 'XZ' | 'YZ'

export type GeometryRequestPoint2 = {
  x: number
  y: number
}

export type GeometryRequestProfileRef = {
  sketchFeatureId: string
  profileId: string
  profileIndex: number
}

export type GeometryRequestExtrudeProfileContributor =
  | {
      kind: 'single'
      sketchFeatureId: string
      profileId: string
      profileIndex: number
    }
  | {
      kind: 'allFromSketch'
      sketchFeatureId: string
    }

export type GeometryRequestExtrudeProfileSelection =
  | {
      mode: 'single'
      sketchFeatureId: string
      profileId: string
      profileIndex: number
    }
  | {
      mode: 'allFromSketch'
      sketchFeatureId: string
    }
  | {
      mode: 'contributors'
      contributors: GeometryRequestExtrudeProfileContributor[]
    }

export type GeometryRequestSketchProfile = {
  profileId: string
  profileIndex: number
  area: number
  loop: ProfileLoop
  verticesProxy: GeometryRequestPoint2[]
}

export type GeometryRequestSketchOp = {
  op: 'sketch'
  featureId: string
  plane?: GeometryRequestPlane
  planeTransform?: SketchPlaneTransform
  profilesResolved: GeometryRequestSketchProfile[]
}

export type GeometryRequestExtrudeDirection = 'OneSide' | 'TwoSides' | 'Symmetric'

export type GeometryRequestExtrudeType = 'Body' | 'Walls'

export type GeometryRequestExtrudeOp = {
  op: 'extrude'
  featureId: string
  profileSelection?: GeometryRequestExtrudeProfileSelection | null
  profileRef: GeometryRequestProfileRef | null
  extrudeType: GeometryRequestExtrudeType
  extrudeDirection?: GeometryRequestExtrudeDirection
  depthResolved: number
  startDepthResolved?: number
  endDepthResolved?: number
  taperResolved: number
  offsetResolved: number
  plane?: GeometryRequestPlane
  planeTransform?: SketchPlaneTransform
  bodyId?: string
}

export type GeometryRequestOp = GeometryRequestSketchOp | GeometryRequestExtrudeOp

export type GeometryRequestPayload = {
  schemaVersion: 1
  parts: Record<string, GeometryRequestOp[]>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isPoint2 = (value: unknown): value is GeometryRequestPoint2 =>
  isRecord(value) &&
  typeof value.x === 'number' &&
  Number.isFinite(value.x) &&
  typeof value.y === 'number' &&
  Number.isFinite(value.y)

const isSegment2LineLike = (
  value: unknown,
): value is ProfileLoop['segments'][number] & { kind: 'line2' } =>
  isRecord(value) && value.kind === 'line2' && isPoint2(value.a) && isPoint2(value.b)

const isSegment2BezierLike = (
  value: unknown,
): value is ProfileLoop['segments'][number] & { kind: 'bezier2' } =>
  isRecord(value) &&
  value.kind === 'bezier2' &&
  isPoint2(value.p0) &&
  isPoint2(value.p1) &&
  isPoint2(value.p2) &&
  isPoint2(value.p3)

const isSegment2Arc3ptLike = (
  value: unknown,
): value is ProfileLoop['segments'][number] & { kind: 'arc3pt2' } =>
  isRecord(value) &&
  value.kind === 'arc3pt2' &&
  isPoint2(value.start) &&
  isPoint2(value.mid) &&
  isPoint2(value.end)

const isProfileLoopSegmentLike = (value: unknown): value is ProfileLoop['segments'][number] =>
  isSegment2LineLike(value) || isSegment2BezierLike(value) || isSegment2Arc3ptLike(value)

const isSketchPlaneTransformVec3 = (value: unknown): value is SketchPlaneTransform['translation'] =>
  isRecord(value) &&
  typeof value.x === 'number' &&
  typeof value.y === 'number' &&
  typeof value.z === 'number'

const isSketchPlaneTransform = (value: unknown): value is SketchPlaneTransform =>
  isRecord(value) &&
  typeof value.offsetMm === 'number' &&
  isSketchPlaneTransformVec3(value.translation) &&
  isSketchPlaneTransformVec3(value.rotationDeg) &&
  typeof value.inPlaneRotationDeg === 'number'

export const isGeometryRequestProfileLoop = (value: unknown): value is ProfileLoop =>
  isRecord(value) &&
  Array.isArray(value.segments) &&
  value.segments.every(isProfileLoopSegmentLike) &&
  (value.winding === 'CCW' || value.winding === 'CW')

const isGeometryRequestProfileRef = (value: unknown): value is GeometryRequestProfileRef =>
  isRecord(value) &&
  typeof value.sketchFeatureId === 'string' &&
  typeof value.profileId === 'string' &&
  typeof value.profileIndex === 'number'

const isGeometryRequestExtrudeProfileContributor = (
  value: unknown,
): value is GeometryRequestExtrudeProfileContributor =>
  isRecord(value) &&
  typeof value.sketchFeatureId === 'string' &&
  ((value.kind === 'single' &&
    typeof value.profileId === 'string' &&
    typeof value.profileIndex === 'number') ||
    value.kind === 'allFromSketch')

const isGeometryRequestExtrudeProfileSelection = (
  value: unknown,
): value is GeometryRequestExtrudeProfileSelection =>
  isRecord(value) &&
  ((value.mode === 'single' &&
    typeof value.sketchFeatureId === 'string' &&
    typeof value.profileId === 'string' &&
    typeof value.profileIndex === 'number') ||
    (value.mode === 'allFromSketch' && typeof value.sketchFeatureId === 'string') ||
    (value.mode === 'contributors' &&
      Array.isArray(value.contributors) &&
      value.contributors.length > 0 &&
      value.contributors.every(isGeometryRequestExtrudeProfileContributor)))

const isGeometryRequestSketchProfile = (
  value: unknown,
): value is GeometryRequestSketchProfile =>
  isRecord(value) &&
  typeof value.profileId === 'string' &&
  typeof value.profileIndex === 'number' &&
  typeof value.area === 'number' &&
  isGeometryRequestProfileLoop(value.loop) &&
  Array.isArray(value.verticesProxy) &&
  value.verticesProxy.every(isPoint2)

const isGeometryRequestSketchOp = (value: unknown): value is GeometryRequestSketchOp =>
  isRecord(value) &&
  value.op === 'sketch' &&
  typeof value.featureId === 'string' &&
  (value.plane === undefined || value.plane === 'XY' || value.plane === 'XZ' || value.plane === 'YZ') &&
  (value.planeTransform === undefined || isSketchPlaneTransform(value.planeTransform)) &&
  Array.isArray(value.profilesResolved) &&
  value.profilesResolved.every(isGeometryRequestSketchProfile)

const isGeometryRequestExtrudeOp = (value: unknown): value is GeometryRequestExtrudeOp =>
  isRecord(value) &&
  value.op === 'extrude' &&
  typeof value.featureId === 'string' &&
  (value.profileSelection === undefined ||
    value.profileSelection === null ||
    isGeometryRequestExtrudeProfileSelection(value.profileSelection)) &&
  (value.profileRef === null || isGeometryRequestProfileRef(value.profileRef)) &&
  (value.extrudeType === 'Body' || value.extrudeType === 'Walls') &&
  (value.extrudeDirection === undefined ||
    value.extrudeDirection === 'OneSide' ||
    value.extrudeDirection === 'TwoSides' ||
    value.extrudeDirection === 'Symmetric') &&
  typeof value.depthResolved === 'number' &&
  (value.startDepthResolved === undefined || typeof value.startDepthResolved === 'number') &&
  (value.endDepthResolved === undefined || typeof value.endDepthResolved === 'number') &&
  typeof value.taperResolved === 'number' &&
  typeof value.offsetResolved === 'number' &&
  (value.plane === undefined || value.plane === 'XY' || value.plane === 'XZ' || value.plane === 'YZ') &&
  (value.planeTransform === undefined || isSketchPlaneTransform(value.planeTransform)) &&
  (value.bodyId === undefined || typeof value.bodyId === 'string')

const isGeometryRequestOp = (value: unknown): value is GeometryRequestOp =>
  isGeometryRequestSketchOp(value) || isGeometryRequestExtrudeOp(value)

export const isGeometryRequestPayload = (value: unknown): value is GeometryRequestPayload =>
  isRecord(value) &&
  value.schemaVersion === 1 &&
  isRecord(value.parts) &&
  Object.values(value.parts).every(
    (operations) => Array.isArray(operations) && operations.every(isGeometryRequestOp),
  )
