import { Matrix4, Object3D, Vector3 } from 'three'
import type {
  SketchPlane,
  SketchPlaneTransform,
} from '../../app/spaghetti/features/featureTypes'
import {
  projectSketchPointToWorld as projectSketchPointToWorldShared,
  projectWorldPointToSketchLocal as projectWorldPointToSketchLocalShared,
  resolveSketchPlaneFrame,
  type SketchPoint2,
  type SketchPoint3,
} from '../../shared/sketchPlaneFrame'

export type { SketchPoint2, SketchPoint3 } from '../../shared/sketchPlaneFrame'

type SketchPlaneAxes = {
  origin: Vector3
  xAxis: Vector3
  yAxis: Vector3
  zAxis: Vector3
}

const tempMatrix = new Matrix4()

const resolveSketchPlaneAxes = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): SketchPlaneAxes => {
  const frame = resolveSketchPlaneFrame(plane, transform)
  const origin = new Vector3(frame.origin.x, frame.origin.y, frame.origin.z)
  const worldXAxis = new Vector3(frame.xAxis.x, frame.xAxis.y, frame.xAxis.z)
  const worldYAxis = new Vector3(frame.yAxis.x, frame.yAxis.y, frame.yAxis.z)
  const worldZAxis = new Vector3(frame.zAxis.x, frame.zAxis.y, frame.zAxis.z)

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
  return projectSketchPointToWorldShared(plane, transform, point, elevation)
}

export const projectWorldPointToSketchLocal = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
  worldPoint: Vector3,
): SketchPoint3 => {
  return projectWorldPointToSketchLocalShared(plane, transform, {
    x: worldPoint.x,
    y: worldPoint.y,
    z: worldPoint.z,
  })
}

export const getSketchPlaneWorldOrigin = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): Vector3 => resolveSketchPlaneAxes(plane, transform).origin

export const getSketchPlaneWorldYAxis = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): Vector3 => resolveSketchPlaneAxes(plane, transform).yAxis

export const getSketchPlaneWorldNormal = (
  plane: SketchPlane,
  transform: SketchPlaneTransform | undefined,
): Vector3 => resolveSketchPlaneAxes(plane, transform).zAxis
