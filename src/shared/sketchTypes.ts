export type SketchPlane = 'XY' | 'YZ' | 'XZ'

export type Vec3Literal = {
  x: number
  y: number
  z: number
}

export type SketchPlaneTransform = {
  offsetMm: number
  translation: Vec3Literal
  rotationDeg: Vec3Literal
  inPlaneRotationDeg: number
}

export const createDefaultSketchPlaneTransform = (): SketchPlaneTransform => ({
  offsetMm: 0,
  translation: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  inPlaneRotationDeg: 0,
})

export type Segment2Line = {
  kind: 'line2'
  a: { x: number; y: number }
  b: { x: number; y: number }
}

export type Segment2Bezier = {
  kind: 'bezier2'
  p0: { x: number; y: number }
  p1: { x: number; y: number }
  p2: { x: number; y: number }
  p3: { x: number; y: number }
}

export type Segment2Arc3pt = {
  kind: 'arc3pt2'
  start: { x: number; y: number }
  mid: { x: number; y: number }
  end: { x: number; y: number }
}

export type Segment2 = Segment2Line | Segment2Bezier | Segment2Arc3pt

export type ProfileLoop = {
  segments: Segment2[]
  winding: 'CCW' | 'CW'
}
