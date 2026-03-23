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
export type GeometrySketchSnapCandidate = {
  point: Point2
  target: 'origin' | 'endpoint'
}

export type GeometrySketchRenderLayer =
  | 'component'
  | 'hoveredComponent'
  | 'selectedComponent'
  | 'profile'
  | 'selectedProfile'
  | 'draftChain'
  | 'draftGhost'
  | 'selectionWindowWindow'
  | 'selectionWindowCrossing'

export type GeometrySketchRenderPolyline = {
  layer: GeometrySketchRenderLayer
  points: Point3[]
  componentRowId?: string
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

const rectangleCornersFromOppositePoints = (a: Point2, b: Point2): Point2[] => {
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

const pushUniquePoint = (points: Point2[], point: Point2): void => {
  const alreadyPresent = points.some(
    (candidate) =>
      Math.abs(candidate.x - point.x) < 1e-6 &&
      Math.abs(candidate.y - point.y) < 1e-6,
  )
  if (!alreadyPresent) {
    points.push(point)
  }
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
    return rectangleCornersFromOppositePoints(a, b)
  }
  return sampleCircle(
    resolveVec2Expression(component.center),
    resolveVec2Expression(component.edge),
    CIRCLE_STEPS,
  )
}

type GeometrySketchSelectableEntity = {
  selectionId: string
  componentIds: string[]
  polylines: Point2[][]
}

const buildSelectableEntities = (
  components: readonly SketchComponent[],
): GeometrySketchSelectableEntity[] => {
  const entitiesById = new Map<string, GeometrySketchSelectableEntity>()
  const entities: GeometrySketchSelectableEntity[] = []
  for (const component of components) {
    const selectionId =
      component.type === 'line' && typeof component.drawGroupId === 'string'
        ? component.drawGroupId
        : component.rowId
    let entity = entitiesById.get(selectionId)
    if (entity === undefined) {
      entity = {
        selectionId,
        componentIds: [],
        polylines: [],
      }
      entitiesById.set(selectionId, entity)
      entities.push(entity)
    }
    entity.componentIds.push(component.rowId)
    entity.polylines.push(componentToPolyline2(component))
  }
  return entities
}

const normalizeSelectionRect = (
  anchor: Point2,
  current: Point2,
): { minX: number; maxX: number; minY: number; maxY: number } => ({
  minX: Math.min(anchor.x, current.x),
  maxX: Math.max(anchor.x, current.x),
  minY: Math.min(anchor.y, current.y),
  maxY: Math.max(anchor.y, current.y),
})

const isPointInsideRect = (
  point: Point2,
  rect: { minX: number; maxX: number; minY: number; maxY: number },
): boolean =>
  point.x >= rect.minX - 1e-6 &&
  point.x <= rect.maxX + 1e-6 &&
  point.y >= rect.minY - 1e-6 &&
  point.y <= rect.maxY + 1e-6

const getSegmentOrientation = (a: Point2, b: Point2, c: Point2): number =>
  (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x)

const isPointOnSegment = (a: Point2, b: Point2, point: Point2): boolean =>
  point.x >= Math.min(a.x, b.x) - 1e-6 &&
  point.x <= Math.max(a.x, b.x) + 1e-6 &&
  point.y >= Math.min(a.y, b.y) - 1e-6 &&
  point.y <= Math.max(a.y, b.y) + 1e-6

const doSegmentsIntersect = (a0: Point2, a1: Point2, b0: Point2, b1: Point2): boolean => {
  const o1 = getSegmentOrientation(a0, a1, b0)
  const o2 = getSegmentOrientation(a0, a1, b1)
  const o3 = getSegmentOrientation(b0, b1, a0)
  const o4 = getSegmentOrientation(b0, b1, a1)
  if (
    ((o1 > 0 && o2 < 0) || (o1 < 0 && o2 > 0)) &&
    ((o3 > 0 && o4 < 0) || (o3 < 0 && o4 > 0))
  ) {
    return true
  }
  if (Math.abs(o1) < 1e-6 && isPointOnSegment(a0, a1, b0)) return true
  if (Math.abs(o2) < 1e-6 && isPointOnSegment(a0, a1, b1)) return true
  if (Math.abs(o3) < 1e-6 && isPointOnSegment(b0, b1, a0)) return true
  if (Math.abs(o4) < 1e-6 && isPointOnSegment(b0, b1, a1)) return true
  return false
}

const doesPolylineIntersectRect = (
  points: readonly Point2[],
  rect: { minX: number; maxX: number; minY: number; maxY: number },
): boolean => {
  if (points.some((point) => isPointInsideRect(point, rect))) {
    return true
  }
  const rectCorners: Point2[] = [
    { x: rect.minX, y: rect.minY },
    { x: rect.maxX, y: rect.minY },
    { x: rect.maxX, y: rect.maxY },
    { x: rect.minX, y: rect.maxY },
  ]
  const rectEdges: Array<[Point2, Point2]> = [
    [rectCorners[0], rectCorners[1]],
    [rectCorners[1], rectCorners[2]],
    [rectCorners[2], rectCorners[3]],
    [rectCorners[3], rectCorners[0]],
  ]
  for (let index = 1; index < points.length; index += 1) {
    const start = points[index - 1]
    const end = points[index]
    if (
      start === undefined ||
      end === undefined ||
      Math.max(start.x, end.x) < rect.minX ||
      Math.min(start.x, end.x) > rect.maxX ||
      Math.max(start.y, end.y) < rect.minY ||
      Math.min(start.y, end.y) > rect.maxY
    ) {
      continue
    }
    if (rectEdges.some(([edgeStart, edgeEnd]) => doSegmentsIntersect(start, end, edgeStart, edgeEnd))) {
      return true
    }
  }
  return false
}

const isPolylineFullyInsideRect = (
  points: readonly Point2[],
  rect: { minX: number; maxX: number; minY: number; maxY: number },
): boolean => points.every((point) => isPointInsideRect(point, rect))

export const expandGeometrySketchSelectionFromRowId = (
  components: readonly SketchComponent[],
  rowId: string | null,
): string[] => {
  if (rowId === null) {
    return []
  }
  const entities = buildSelectableEntities(components)
  const entity = entities.find((candidate) => candidate.componentIds.includes(rowId))
  return entity?.componentIds ?? []
}

export const collectGeometrySketchEndpointCandidates = (
  components: readonly SketchComponent[],
): GeometrySketchSnapCandidate[] => {
  const endpointPoints: Point2[] = []

  for (const component of components) {
    if (component.type === 'line') {
      pushUniquePoint(endpointPoints, resolveVec2Expression(component.a))
      pushUniquePoint(endpointPoints, resolveVec2Expression(component.b))
      continue
    }
    if (component.type === 'rectangle') {
      const corners = rectangleCornersFromOppositePoints(
        resolveVec2Expression(component.a),
        resolveVec2Expression(component.b),
      )
      for (const corner of corners.slice(0, 4)) {
        pushUniquePoint(endpointPoints, corner)
      }
    }
  }

  return endpointPoints.map((point) => ({
    point,
    target: 'endpoint',
  }))
}

export const collectGeometrySketchSelectionIds = (
  components: readonly SketchComponent[],
  anchor: Point2,
  current: Point2,
  mode: 'window' | 'crossing',
): string[] => {
  const rect = normalizeSelectionRect(anchor, current)
  return buildSelectableEntities(components)
    .filter((entity) =>
      mode === 'window'
        ? entity.polylines.every((points) => isPolylineFullyInsideRect(points, rect))
        : entity.polylines.some((points) => doesPolylineIntersectRect(points, rect)),
    )
    .flatMap((entity) => entity.componentIds)
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
      componentRowId: component.rowId,
      points: polyline2To3(
        overlay.plane,
        overlay.planeTransform,
        componentToPolyline2(component),
        COMPONENT_ELEVATION,
      ),
    }))
    .filter((polyline) => polyline.points.length >= 2)

  const hoveredIds = new Set(
    expandGeometrySketchSelectionFromRowId(
      overlay.components,
      overlay.hoveredComponentId ?? null,
    ),
  )
  const selectedIds = new Set(overlay.selectedComponentIds ?? [])
  const hoveredPolylines =
    overlay.mode === 'draw' && overlay.activeTool === null
      ? overlay.components
          .filter((component) => hoveredIds.has(component.rowId) && !selectedIds.has(component.rowId))
          .map((component) => ({
            layer: 'hoveredComponent' as const,
            componentRowId: component.rowId,
            points: polyline2To3(
              overlay.plane,
              overlay.planeTransform,
              componentToPolyline2(component),
              COMPONENT_ELEVATION + 0.015,
            ),
          }))
          .filter((polyline) => polyline.points.length >= 2)
      : []
  const selectedPolylines =
    overlay.mode === 'draw' && overlay.activeTool === null
      ? overlay.components
          .filter((component) => selectedIds.has(component.rowId))
          .map((component) => ({
            layer: 'selectedComponent' as const,
            componentRowId: component.rowId,
            points: polyline2To3(
              overlay.plane,
              overlay.planeTransform,
              componentToPolyline2(component),
              COMPONENT_ELEVATION + 0.02,
            ),
          }))
          .filter((polyline) => polyline.points.length >= 2)
      : []

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
          : overlay.activeTool === 'rectangle'
            ? draft.points[0] ?? null
          : overlay.activeTool === 'circle'
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
        const ghostPoints =
          overlay.activeTool === 'rectangle'
            ? rectangleCornersFromOppositePoints(ghostStart, ghostEnd)
            : overlay.activeTool === 'circle'
              ? sampleCircle(ghostStart, ghostEnd, CIRCLE_STEPS)
            : [ghostStart, ghostEnd]
        drawDraftPolylines.push({
          layer: 'draftGhost',
          points: polyline2To3(
            overlay.plane,
            overlay.planeTransform,
            ghostPoints,
            DRAFT_GHOST_ELEVATION,
          ),
        })
      }
    }

    if (overlay.selectionWindowDraft != null) {
      const { anchor, current, mode } = overlay.selectionWindowDraft
      const windowPoints = polyline2To3(
        overlay.plane,
        overlay.planeTransform,
        [
          { x: anchor.x, y: anchor.y },
          { x: current.x, y: anchor.y },
          { x: current.x, y: current.y },
          { x: anchor.x, y: current.y },
          { x: anchor.x, y: anchor.y },
        ],
        DRAFT_GHOST_ELEVATION + 0.01,
      )
      drawDraftPolylines.push({
        layer: mode === 'window' ? 'selectionWindowWindow' : 'selectionWindowCrossing',
        points: windowPoints,
      })
    }

    return [
      ...componentPolylines,
      ...hoveredPolylines,
      ...selectedPolylines,
      ...drawDraftPolylines,
    ]
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
