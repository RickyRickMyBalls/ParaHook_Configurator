import type { GeometryRequestSketchProfile } from '../../shared/geometryRequest'
import type { Segment2 } from '../../shared/sketchTypes'

export type OcInstance = Record<string, unknown>

export type OcOwnedResource = {
  delete?: () => void
}

type OcPoint3 = {
  x: number
  y: number
  z: number
}

type OcPoint2 = {
  x: number
  y: number
}

type OcConstructValue = (
  oc: OcInstance,
  constructorName: string,
  args: unknown[],
) => unknown

type OcInvokeMethod = (
  target: object,
  methodNames: readonly string[],
  args: unknown[],
) => unknown

type OcReleaseResources = (resources: readonly OcOwnedResource[]) => void

export type OcSketchWireRuntime = {
  oc: OcInstance
  constructOcValue: OcConstructValue
  invokeOcMethod: OcInvokeMethod
  releaseOcResources: OcReleaseResources
  projectSketchPoint?: (point: { x: number; y: number }) => OcPoint3
}

export type OcSketchWireResult = {
  wire: OcOwnedResource
  ownedResources: OcOwnedResource[]
}

export type OcSketchFaceResult = {
  face: OcOwnedResource
  ownedResources: OcOwnedResource[]
}

const isOwnedResource = (value: unknown): value is OcOwnedResource =>
  typeof value === 'object' && value !== null

const POINT_EPSILON = 1e-6

const getSegmentStart = (segment: Segment2): OcPoint2 => {
  if (segment.kind === 'line2') {
    return segment.a
  }
  if (segment.kind === 'bezier2') {
    return segment.p0
  }
  return segment.start
}

const getSegmentEnd = (segment: Segment2): OcPoint2 => {
  if (segment.kind === 'line2') {
    return segment.b
  }
  if (segment.kind === 'bezier2') {
    return segment.p3
  }
  return segment.end
}

const pointsMatchWithinTolerance = (left: OcPoint2, right: OcPoint2): boolean =>
  Math.abs(left.x - right.x) <= POINT_EPSILON && Math.abs(left.y - right.y) <= POINT_EPSILON

const isClosedContiguousSegmentChain = (segments: readonly Segment2[]): boolean => {
  if (segments.length === 0) {
    return false
  }
  for (let index = 1; index < segments.length; index += 1) {
    if (
      !pointsMatchWithinTolerance(
        getSegmentEnd(segments[index - 1]),
        getSegmentStart(segments[index]),
      )
    ) {
      return false
    }
  }
  return pointsMatchWithinTolerance(
    getSegmentStart(segments[0]),
    getSegmentEnd(segments[segments.length - 1]),
  )
}

const projectSketchPoint = (
  runtime: OcSketchWireRuntime,
  point: { x: number; y: number },
): OcPoint3 => runtime.projectSketchPoint?.(point) ?? { x: point.x, y: point.y, z: 0 }

const constructOcValueFromArgVariants = (
  runtime: OcSketchWireRuntime,
  constructorName: string,
  argVariants: readonly unknown[][],
): OcOwnedResource | null => {
  for (const args of argVariants) {
    try {
      const value = runtime.constructOcValue(runtime.oc, constructorName, args)
      if (isOwnedResource(value)) {
        return value
      }
    } catch {
      // Keep trying supported overloads until one succeeds.
    }
  }
  return null
}

const buildSegmentEdge = (
  runtime: OcSketchWireRuntime,
  segment: Segment2,
): OcOwnedResource | null => {
  const transientResources: OcOwnedResource[] = []
  const retainedResources: OcOwnedResource[] = []
  try {
    if (segment.kind === 'line2') {
      const startPoint = projectSketchPoint(runtime, segment.a)
      const endPoint = projectSketchPoint(runtime, segment.b)
      const start = runtime.constructOcValue(runtime.oc, 'gp_Pnt', [
        startPoint.x,
        startPoint.y,
        startPoint.z,
      ]) as OcOwnedResource | null
      const end = runtime.constructOcValue(runtime.oc, 'gp_Pnt', [
        endPoint.x,
        endPoint.y,
        endPoint.z,
      ]) as OcOwnedResource | null
      if (!isOwnedResource(start) || !isOwnedResource(end)) {
        return null
      }
      transientResources.push(start, end)
      const edgeBuilder = runtime.constructOcValue(runtime.oc, 'BRepBuilderAPI_MakeEdge', [
        start,
        end,
      ]) as OcOwnedResource | null
      if (!isOwnedResource(edgeBuilder)) {
        return null
      }
      transientResources.push(edgeBuilder)
      const edge = runtime.invokeOcMethod(
        edgeBuilder as object,
        ['Edge', 'Shape', '_operator_TopoDS_Edge', '_operator_TopoDS_Shape'],
        [],
      ) as OcOwnedResource | null
      if (!isOwnedResource(edge)) {
        return null
      }
      retainedResources.push(edge)
      return edge
    }

    if (segment.kind === 'bezier2') {
      const points = [
        projectSketchPoint(runtime, segment.p0),
        projectSketchPoint(runtime, segment.p1),
        projectSketchPoint(runtime, segment.p2),
        projectSketchPoint(runtime, segment.p3),
      ].map(
        (point) =>
          runtime.constructOcValue(runtime.oc, 'gp_Pnt', [point.x, point.y, point.z]) as
            | OcOwnedResource
            | null,
      )
      if (!points.every(isOwnedResource)) {
        return null
      }
      transientResources.push(...points)
      const pointArray = runtime.constructOcValue(runtime.oc, 'TColgp_Array1OfPnt', [1, 4]) as
        | OcOwnedResource
        | null
      if (!isOwnedResource(pointArray)) {
        return null
      }
      transientResources.push(pointArray)
      points.forEach((point, index) => {
        runtime.invokeOcMethod(pointArray as object, ['SetValue'], [index + 1, point])
      })
      const curve = runtime.constructOcValue(runtime.oc, 'Geom_BezierCurve', [pointArray]) as
        | OcOwnedResource
        | null
      if (!isOwnedResource(curve)) {
        return null
      }
      transientResources.push(curve)
      const edgeBuilder = runtime.constructOcValue(runtime.oc, 'BRepBuilderAPI_MakeEdge', [
        curve,
      ]) as OcOwnedResource | null
      if (!isOwnedResource(edgeBuilder)) {
        return null
      }
      transientResources.push(edgeBuilder)
      const edge = runtime.invokeOcMethod(
        edgeBuilder as object,
        ['Edge', 'Shape', '_operator_TopoDS_Edge', '_operator_TopoDS_Shape'],
        [],
      ) as OcOwnedResource | null
      if (!isOwnedResource(edge)) {
        return null
      }
      retainedResources.push(edge)
      return edge
    }

    const startPoint = projectSketchPoint(runtime, segment.start)
    const midPoint = projectSketchPoint(runtime, segment.mid)
    const endPoint = projectSketchPoint(runtime, segment.end)
    const start = runtime.constructOcValue(runtime.oc, 'gp_Pnt', [
      startPoint.x,
      startPoint.y,
      startPoint.z,
    ]) as OcOwnedResource | null
    const mid = runtime.constructOcValue(runtime.oc, 'gp_Pnt', [
      midPoint.x,
      midPoint.y,
      midPoint.z,
    ]) as OcOwnedResource | null
    const end = runtime.constructOcValue(runtime.oc, 'gp_Pnt', [
      endPoint.x,
      endPoint.y,
      endPoint.z,
    ]) as OcOwnedResource | null
    if (!isOwnedResource(start) || !isOwnedResource(mid) || !isOwnedResource(end)) {
      return null
    }
    transientResources.push(start, mid, end)
    const arcBuilder = runtime.constructOcValue(runtime.oc, 'GC_MakeArcOfCircle', [
      start,
      mid,
      end,
    ]) as OcOwnedResource | null
    if (!isOwnedResource(arcBuilder)) {
      return null
    }
    transientResources.push(arcBuilder)
    const curve = runtime.invokeOcMethod(arcBuilder as object, ['Value'], []) as OcOwnedResource | null
    if (!isOwnedResource(curve)) {
      return null
    }
    transientResources.push(curve)
    const edgeBuilder = runtime.constructOcValue(runtime.oc, 'BRepBuilderAPI_MakeEdge', [
      curve,
    ]) as OcOwnedResource | null
    if (!isOwnedResource(edgeBuilder)) {
      return null
    }
    transientResources.push(edgeBuilder)
    const edge = runtime.invokeOcMethod(
      edgeBuilder as object,
      ['Edge', 'Shape', '_operator_TopoDS_Edge', '_operator_TopoDS_Shape'],
      [],
    ) as OcOwnedResource | null
    if (!isOwnedResource(edge)) {
      return null
    }
    retainedResources.push(edge)
    return edge
  } catch {
    return null
  } finally {
    runtime.releaseOcResources(
      transientResources.filter((resource) => !retainedResources.includes(resource)),
    )
  }
}

export const buildOcSketchProfileWire = (
  runtime: OcSketchWireRuntime,
  profile: GeometryRequestSketchProfile,
): OcSketchWireResult | null => {
  if (!isClosedContiguousSegmentChain(profile.loop.segments)) {
    return null
  }

  const ownedResources: OcOwnedResource[] = []
  const transientResources: OcOwnedResource[] = []
  let didSucceed = false
  try {
    const edges: OcOwnedResource[] = []
    for (const segment of profile.loop.segments) {
      const edge = buildSegmentEdge(runtime, segment)
      if (edge === null) {
        return null
      }
      edges.push(edge)
      ownedResources.push(edge)
    }

    const wireBuilder = runtime.constructOcValue(runtime.oc, 'BRepBuilderAPI_MakeWire', []) as
      | OcOwnedResource
      | null
    if (!isOwnedResource(wireBuilder)) {
      return null
    }
    transientResources.push(wireBuilder)
    for (const edge of edges) {
      runtime.invokeOcMethod(wireBuilder as object, ['Add'], [edge])
    }

    const wire = runtime.invokeOcMethod(
      wireBuilder as object,
      ['Wire', 'Shape', '_operator_TopoDS_Wire', '_operator_TopoDS_Shape'],
      [],
    ) as OcOwnedResource | null
    if (!isOwnedResource(wire)) {
      return null
    }
    ownedResources.push(wire)
    didSucceed = true
    return {
      wire,
      ownedResources,
    }
  } catch {
    return null
  } finally {
    runtime.releaseOcResources(
      transientResources.filter((resource) => !ownedResources.includes(resource)),
    )
    if (!didSucceed) {
      runtime.releaseOcResources(ownedResources)
    }
  }
}

export const buildOcSketchProfileFace = (
  runtime: OcSketchWireRuntime,
  profile: GeometryRequestSketchProfile,
): OcSketchFaceResult | null => {
  const wire = buildOcSketchProfileWire(runtime, profile)
  if (wire === null) {
    return null
  }

  const ownedResources = [...wire.ownedResources]
  const transientResources: OcOwnedResource[] = []
  let didSucceed = false
  try {
    const faceBuilder = constructOcValueFromArgVariants(runtime, 'BRepBuilderAPI_MakeFace', [
      [wire.wire],
      [wire.wire, true],
    ])
    if (faceBuilder === null) {
      return null
    }
    transientResources.push(faceBuilder)
    const face = runtime.invokeOcMethod(
      faceBuilder as object,
      ['Face', 'Shape', '_operator_TopoDS_Face', '_operator_TopoDS_Shape'],
      [],
    ) as OcOwnedResource | null
    if (!isOwnedResource(face)) {
      return null
    }
    ownedResources.push(face)
    didSucceed = true
    return {
      face,
      ownedResources,
    }
  } catch {
    return null
  } finally {
    runtime.releaseOcResources(
      transientResources.filter((resource) => !ownedResources.includes(resource)),
    )
    if (!didSucceed) {
      runtime.releaseOcResources(ownedResources)
    }
  }
}
