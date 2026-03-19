import { Euler, Matrix4, Object3D, Vector3 } from 'three'
import {
  createDefaultSketchPlaneTransform,
  type SketchPlane,
  type SketchPlaneTransform,
} from '../../app/spaghetti/features/featureTypes'

export type SketchPoint2 = {
  x: number
  y: number
}

export type SketchPoint3 = {
  x: number
  y: number
  z: number
}

type SketchPlaneAxes = {
  origin: Vector3
  xAxis: Vector3
  yAxis: Vector3
  zAxis: Vector3
}

const baseAxesByPlane: Record<
  SketchPlane,
  { xAxis: Vector3; yAxis: Vector3; zAxis: Vector3 }
> = {
  XY: {
    xAxis: new Vector3(1, 0, 0),
    yAxis: new Vector3(0, 1, 0),
    zAxis: new Vector3(0, 0, 1),
  },
  XZ: {
    xAxis: new Vector3(1, 0, 0),
    yAxis: new Vector3(0, 0, 1),
    zAxis: new Vector3(0, 1, 0),
  },
  YZ: {
    xAxis: new Vector3(0, 1, 0),
    yAxis: new Vector3(0, 0, 1),
    zAxis: new Vector3(1, 0, 0),
  },
}

const tempMatrix = new Matrix4()

const resolveSketchPlaneAxes = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): SketchPlaneAxes => {
  const resolvedTransform = transform ?? createDefaultSketchPlaneTransform()
  const baseAxes = baseAxesByPlane[plane]
  const inPlaneRad = (resolvedTransform.inPlaneRotationDeg * Math.PI) / 180
  const cos = Math.cos(inPlaneRad)
  const sin = Math.sin(inPlaneRad)
  const euler = new Euler(
    (resolvedTransform.rotationDeg.x * Math.PI) / 180,
    (resolvedTransform.rotationDeg.y * Math.PI) / 180,
    (resolvedTransform.rotationDeg.z * Math.PI) / 180,
    'XYZ',
  )

  const localXAxis = baseAxes.xAxis.clone().multiplyScalar(cos).add(
    baseAxes.yAxis.clone().multiplyScalar(sin),
  )
  const localYAxis = baseAxes.xAxis.clone().multiplyScalar(-sin).add(
    baseAxes.yAxis.clone().multiplyScalar(cos),
  )
  const worldXAxis = localXAxis.applyEuler(euler).normalize()
  const worldYAxis = localYAxis.applyEuler(euler).normalize()
  const worldZAxis = baseAxes.zAxis.clone().applyEuler(euler).normalize()
  const origin = new Vector3(
    resolvedTransform.translation.x,
    resolvedTransform.translation.y,
    resolvedTransform.translation.z,
  ).add(worldZAxis.clone().multiplyScalar(resolvedTransform.offsetMm))

  return {
    origin,
    xAxis: worldXAxis,
    yAxis: worldYAxis,
    zAxis: worldZAxis,
  }
}

export const applySketchPlaneFrameToObject = (
  target: Object3D,
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): void => {
  const axes = resolveSketchPlaneAxes(plane, transform)
  tempMatrix.makeBasis(axes.xAxis, axes.yAxis, axes.zAxis)
  tempMatrix.setPosition(axes.origin)
  target.matrixAutoUpdate = false
  target.matrix.copy(tempMatrix)
  target.matrixWorld.copy(tempMatrix)
}

export const projectSketchPointToWorld = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
  point: SketchPoint2,
  elevation = 0,
): SketchPoint3 => {
  const axes = resolveSketchPlaneAxes(plane, transform)
  const worldPoint = axes.origin
    .clone()
    .addScaledVector(axes.xAxis, point.x)
    .addScaledVector(axes.yAxis, point.y)
    .addScaledVector(axes.zAxis, elevation)
  return {
    x: worldPoint.x,
    y: worldPoint.y,
    z: worldPoint.z,
  }
}

export const projectWorldPointToSketchLocal = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
  worldPoint: Vector3,
): SketchPoint3 => {
  const axes = resolveSketchPlaneAxes(plane, transform)
  const delta = worldPoint.clone().sub(axes.origin)
  return {
    x: delta.dot(axes.xAxis),
    y: delta.dot(axes.yAxis),
    z: delta.dot(axes.zAxis),
  }
}

export const getSketchPlaneWorldOrigin = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): Vector3 => resolveSketchPlaneAxes(plane, transform).origin

export const getSketchPlaneWorldNormal = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): Vector3 => resolveSketchPlaneAxes(plane, transform).zAxis
