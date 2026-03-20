import type { SketchComponent, SketchPlane, SketchPlaneTransform } from '../app/spaghetti/features/featureTypes'
import { resolveVec2Expression } from '../app/spaghetti/features/expressions'
import type { GeometrySketchOverlayVm } from '../app/viewerBridge'
import {
  projectSketchPointToWorld as projectSketchPointToWorldWithTransform,
  type SketchPoint2,
  type SketchPoint3,
} from './sketch/sketchPlaneMath'

type Point2 = SketchPoint2
export type Point3 = SketchPoint3

export type GeometrySketchRenderLayer =
  | 'component'
  | 'profile'
  | 'selectedProfile'
  | 'draftChain'
  | 'draftGhost'

export type GeometrySketchRenderPolyline = {
  layer: GeometrySketchRenderLayer
  points: Point3[]
}

const BEZIER_STEPS = 24
const ARC_STEPS = 24
const CIRCLE_STEPS = 48
const COMPONENT_ELEVATION = 0.02
const PROFILE_ELEVATION = 0.04
const SELECTED_PROFILE_ELEVATION = 0.06
const DRAFT_CHAIN_ELEVATION = COMPONENT_ELEVATION
const DRAFT_GHOST_ELEVATION = COMPONENT_ELEVATION

const sampleBezier = (
  p0: Point2,
  p1: Point2,
  p2: Point2,
  p3: Point2,
  steps: number,
): Point2[] => {
  const out: Point2[] = []
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps
    const u = 1 - t
    const b0 = u * u * u
    const b1 = 3 * u * u * t
    const b2 = 3 * u * t * t
    const b3 = t * t * t
    out.push({
      x: b0 * p0.x + b1 * p1.x + b2 * p2.x + b3 * p3.x,
      y: b0 * p0.y + b1 * p1.y + b2 * p2.y + b3 * p3.y,
    })
  }
  return out
}

const sampleArc3pt = (
  start: Point2,
  mid: Point2,
  end: Point2,
  steps: number,
): Point2[] => {
  const ax = start.x
  const ay = start.y
  const bx = mid.x
  const by = mid.y
  const cx = end.x
  const cy = end.y
  const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by))

  if (Math.abs(d) < 1e-9) {
    const out: Point2[] = []
    for (let index = 0; index <= steps; index += 1) {
      const t = index / steps
      out.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      })
    }
    return out
  }

  const a2 = ax * ax + ay * ay
  const b2 = bx * bx + by * by
  const c2 = cx * cx + cy * cy
  const ux = (a2 * (by - cy) + b2 * (cy - ay) + c2 * (ay - by)) / d
  const uy = (a2 * (cx - bx) + b2 * (ax - cx) + c2 * (bx - ax)) / d
  const radius = Math.hypot(start.x - ux, start.y - uy)
  const angle = (point: Point2): number => Math.atan2(point.y - uy, point.x - ux)
  let startAngle = angle(start)
  let midAngle = angle(mid)
  let endAngle = angle(end)

  while (midAngle - startAngle > Math.PI) midAngle -= Math.PI * 2
  while (midAngle - startAngle < -Math.PI) midAngle += Math.PI * 2
  while (endAngle - startAngle > Math.PI) endAngle -= Math.PI * 2
  while (endAngle - startAngle < -Math.PI) endAngle += Math.PI * 2

  const isBetween = (value: number, low: number, high: number): boolean =>
    low <= high
      ? value >= low - 1e-8 && value <= high + 1e-8
      : value <= low + 1e-8 && value >= high - 1e-8

  if (!isBetween(midAngle, startAngle, endAngle)) {
    endAngle += endAngle >= startAngle ? -Math.PI * 2 : Math.PI * 2
  }

  const out: Point2[] = []
  for (let index = 0; index <= steps; index += 1) {
    const t = index / steps
    const nextAngle = startAngle + (endAngle - startAngle) * t
    out.push({
      x: ux + Math.cos(nextAngle) * radius,
      y: uy + Math.sin(nextAngle) * radius,
    })
  }
  return out
}

const sampleCircle = (center: Point2, edge: Point2, steps: number): Point2[] => {
  const dx = edge.x - center.x
  const dy = edge.y - center.y
  const radius = Math.hypot(dx, dy)
  if (radius <= 1e-9) {
    return [center]
  }

  const out: Point2[] = []
  for (let index = 0; index <= steps; index += 1) {
    const angle = (Math.PI * 2 * index) / steps
    out.push({
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius,
    })
  }
  return out
}

const componentToPolyline2 = (component: SketchComponent): Point2[] => {
  if (component.type === 'line') {
    return [resolveVec2Expression(component.a), resolveVec2Expression(component.b)]
  }
  if (component.type === 'spline') {
    return sampleBezier(
      resolveVec2Expression(component.p0),
      resolveVec2Expression(component.p1),
      resolveVec2Expression(component.p2),
      resolveVec2Expression(component.p3),
      BEZIER_STEPS,
    )
  }
  if (component.type === 'arc3pt') {
    return sampleArc3pt(
      resolveVec2Expression(component.start),
      resolveVec2Expression(component.mid),
      resolveVec2Expression(component.end),
      ARC_STEPS,
    )
  }
  if (component.type === 'rectangle') {
    const a = resolveVec2Expression(component.a)
    const b = resolveVec2Expression(component.b)
    const minX = Math.min(a.x, b.x)
    const maxX = Math.max(a.x, b.x)
    const minY = Math.min(a.y, b.y)
    const maxY = Math.max(a.y, b.y)
    return [
      { x: minX, y: minY },
      { x: maxX, y: minY },
      { x: maxX, y: maxY },
      { x: minX, y: maxY },
      { x: minX, y: minY },
    ]
  }
  return sampleCircle(
    resolveVec2Expression(component.center),
    resolveVec2Expression(component.edge),
    CIRCLE_STEPS,
  )
}

export const projectSketchPointToWorld = (
  plane: SketchPlane,
  planeTransform: SketchPlaneTransform | undefined,
  point: Point2,
  elevation = 0,
): Point3 => {
  return projectSketchPointToWorldWithTransform(plane, planeTransform, point, elevation)
}

const polyline2To3 = (
  plane: SketchPlane,
  planeTransform: SketchPlaneTransform | undefined,
  points: readonly Point2[],
  elevation: number,
): Point3[] =>
  points.map((point) => projectSketchPointToWorld(plane, planeTransform, point, elevation))

const ensureClosedLoop = (points: readonly Point2[]): Point2[] => {
  if (points.length < 2) {
    return [...points]
  }
  const first = points[0]
  const last = points[points.length - 1]
  if (first.x === last.x && first.y === last.y) {
    return [...points]
  }
  return [...points, first]
}

export const buildGeometrySketchRenderPolylines = (
  overlay: GeometrySketchOverlayVm | null,
): GeometrySketchRenderPolyline[] => {
  if (overlay === null) {
    return []
  }

  const componentPolylines = overlay.components
    .map((component) => ({
      layer: 'component' as const,
      points: polyline2To3(
        overlay.plane,
        overlay.planeTransform,
        componentToPolyline2(component),
        COMPONENT_ELEVATION,
      ),
    }))
    .filter((polyline) => polyline.points.length >= 2)

  if (overlay.mode === 'draw') {
    const drawDraftPolylines: GeometrySketchRenderPolyline[] = []
    const draft = overlay.drawDraft
    if (draft !== null) {
      if (draft.points.length >= 2) {
        drawDraftPolylines.push({
          layer: 'draftChain',
          points: polyline2To3(
            overlay.plane,
            overlay.planeTransform,
            draft.points,
            DRAFT_CHAIN_ELEVATION,
          ),
        })
      }

      const ghostStart =
        overlay.activeTool === 'line'
          ? draft.points[0] ?? null
          : overlay.activeTool === 'pline'
            ? draft.points[draft.points.length - 1] ?? null
            : null
      const ghostEnd = draft.hoverPoint
      if (
        ghostStart !== null &&
        ghostEnd !== null &&
        (ghostStart.x !== ghostEnd.x || ghostStart.y !== ghostEnd.y)
      ) {
        drawDraftPolylines.push({
          layer: 'draftGhost',
          points: polyline2To3(
            overlay.plane,
            overlay.planeTransform,
            [ghostStart, ghostEnd],
            DRAFT_GHOST_ELEVATION,
          ),
        })
      }
    }

    return [...componentPolylines, ...drawDraftPolylines]
  }

  if (overlay.mode !== 'review') {
    return componentPolylines
  }

  const reviewPolylines = overlay.profiles
    .map((profile) => ({
      layer:
        profile.profileId === overlay.selectedProfileId
          ? ('selectedProfile' as const)
          : ('profile' as const),
        points: polyline2To3(
          overlay.plane,
          overlay.planeTransform,
          ensureClosedLoop(profile.vertices),
          profile.profileId === overlay.selectedProfileId
            ? SELECTED_PROFILE_ELEVATION
          : PROFILE_ELEVATION,
      ),
    }))
    .filter((polyline) => polyline.points.length >= 2)

  return [...componentPolylines, ...reviewPolylines]
}
