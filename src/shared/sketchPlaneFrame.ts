import {
  createDefaultSketchPlaneTransform,
  type SketchPlane,
  type SketchPlaneTransform,
  type Vec3Literal,
} from '../app/spaghetti/features/featureTypes'

export type SketchPoint2 = {
  x: number
  y: number
}

export type SketchPoint3 = Vec3Literal

export type SketchPlaneFrame = {
  origin: Vec3Literal
  xAxis: Vec3Literal
  yAxis: Vec3Literal
  zAxis: Vec3Literal
}

const baseAxesByPlane: Record<SketchPlane, Omit<SketchPlaneFrame, 'origin'>> = {
  XY: {
    xAxis: { x: 1, y: 0, z: 0 },
    yAxis: { x: 0, y: 1, z: 0 },
    zAxis: { x: 0, y: 0, z: 1 },
  },
  XZ: {
    xAxis: { x: 1, y: 0, z: 0 },
    yAxis: { x: 0, y: 0, z: 1 },
    zAxis: { x: 0, y: 1, z: 0 },
  },
  YZ: {
    xAxis: { x: 0, y: 1, z: 0 },
    yAxis: { x: 0, y: 0, z: 1 },
    zAxis: { x: 1, y: 0, z: 0 },
  },
}

const addVec3 = (left: Vec3Literal, right: Vec3Literal): Vec3Literal => ({
  x: left.x + right.x,
  y: left.y + right.y,
  z: left.z + right.z,
})

const subVec3 = (left: Vec3Literal, right: Vec3Literal): Vec3Literal => ({
  x: left.x - right.x,
  y: left.y - right.y,
  z: left.z - right.z,
})

const scaleVec3 = (vector: Vec3Literal, scalar: number): Vec3Literal => ({
  x: vector.x * scalar,
  y: vector.y * scalar,
  z: vector.z * scalar,
})

const dotVec3 = (left: Vec3Literal, right: Vec3Literal): number =>
  left.x * right.x + left.y * right.y + left.z * right.z

const normalizeVec3 = (vector: Vec3Literal): Vec3Literal => {
  const magnitude = Math.hypot(vector.x, vector.y, vector.z)
  if (magnitude <= 1e-12) {
    return { x: 0, y: 0, z: 0 }
  }
  return scaleVec3(vector, 1 / magnitude)
}

const rotateVectorByEulerXYZ = (
  vector: Vec3Literal,
  rotationDeg: Vec3Literal,
): Vec3Literal => {
  const rx = (rotationDeg.x * Math.PI) / 180
  const ry = (rotationDeg.y * Math.PI) / 180
  const rz = (rotationDeg.z * Math.PI) / 180
  const a = Math.cos(rx)
  const b = Math.sin(rx)
  const c = Math.cos(ry)
  const d = Math.sin(ry)
  const e = Math.cos(rz)
  const f = Math.sin(rz)
  const af = a * f
  const ae = a * e
  const bf = b * f
  const be = b * e

  return {
    x: c * e * vector.x + -c * f * vector.y + d * vector.z,
    y: (af + be * d) * vector.x + (ae - bf * d) * vector.y + -b * c * vector.z,
    z: (bf - ae * d) * vector.x + (be + af * d) * vector.y + a * c * vector.z,
  }
}

export const resolveSketchPlaneFrame = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): SketchPlaneFrame => {
  const resolvedTransform = transform ?? createDefaultSketchPlaneTransform()
  const baseAxes = baseAxesByPlane[plane]
  const inPlaneRad = (resolvedTransform.inPlaneRotationDeg * Math.PI) / 180
  const cos = Math.cos(inPlaneRad)
  const sin = Math.sin(inPlaneRad)

  const localXAxis = addVec3(scaleVec3(baseAxes.xAxis, cos), scaleVec3(baseAxes.yAxis, sin))
  const localYAxis = addVec3(scaleVec3(baseAxes.xAxis, -sin), scaleVec3(baseAxes.yAxis, cos))
  const worldXAxis = normalizeVec3(rotateVectorByEulerXYZ(localXAxis, resolvedTransform.rotationDeg))
  const worldYAxis = normalizeVec3(rotateVectorByEulerXYZ(localYAxis, resolvedTransform.rotationDeg))
  const worldZAxis = normalizeVec3(rotateVectorByEulerXYZ(baseAxes.zAxis, resolvedTransform.rotationDeg))
  const origin = addVec3(
    resolvedTransform.translation,
    scaleVec3(worldZAxis, resolvedTransform.offsetMm),
  )

  return {
    origin,
    xAxis: worldXAxis,
    yAxis: worldYAxis,
    zAxis: worldZAxis,
  }
}

export const projectSketchPointToWorld = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
  point: SketchPoint2,
  elevation = 0,
): SketchPoint3 => {
  const frame = resolveSketchPlaneFrame(plane, transform)
  return addVec3(
    addVec3(
      addVec3(frame.origin, scaleVec3(frame.xAxis, point.x)),
      scaleVec3(frame.yAxis, point.y),
    ),
    scaleVec3(frame.zAxis, elevation),
  )
}

export const projectWorldPointToSketchLocal = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
  worldPoint: Vec3Literal,
): SketchPoint3 => {
  const frame = resolveSketchPlaneFrame(plane, transform)
  const delta = subVec3(worldPoint, frame.origin)
  return {
    x: dotVec3(delta, frame.xAxis),
    y: dotVec3(delta, frame.yAxis),
    z: dotVec3(delta, frame.zAxis),
  }
}
