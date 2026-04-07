import type {
  GeometryBody,
  GeometryResultBundle,
  GeometryResultRequestIdentity,
} from '../../shared/geometryResult'
import { createAuthoritativeGeometryResultBundle } from '../../shared/geometryResult'
import type { CompiledBuildData } from '../../shared/buildTypes'
import { compareSpaghettiSourcePartKeys } from '../../shared/buildStatsKeys'
import { resolveSketchPlaneFrame } from '../../shared/sketchPlaneFrame'
import type {
  GeometryRequestExtrudeOp,
  GeometryRequestPlane,
  GeometryRequestSketchOp,
  GeometryRequestSketchProfile,
} from '../../app/spaghetti/contracts/geometryRequest'
import {
  executeFeatureStack,
  isFeatureStackIRPayload,
  type FeatureStackIRPayload,
} from '../cad/featureStackRuntime'
import {
  registerAuthoritativeShapeSet,
  releaseAuthoritativeShapeSet,
  type AuthoritativeShapeSetResource,
} from '../authoritativeGeometryStore'
import { getOc } from '../oc/ocInit'

export type AuthoritativeGeometryBuildInput = {
  compiledBuildData: CompiledBuildData
  request: GeometryResultRequestIdentity
}

export type AuthoritativeGeometryBuildResult = {
  authoritativeGeometryResult: GeometryResultBundle | null
}

type OcConstructor = new (...args: unknown[]) => unknown

type OcCallable = (...args: unknown[]) => unknown

type OcInstance = Record<string, unknown>

type OcOwnedResource = {
  delete?: () => void
}

type SketchProfileRuntime = {
  plane: GeometryRequestPlane
  planeTransform: GeometryRequestSketchOp['planeTransform']
  profile: GeometryRequestSketchProfile
}

type BoxExtrusionDefinition = {
  bodyKey: string
  body: GeometryBody
  origin: { x: number; y: number; z: number }
  xAxis: { x: number; y: number; z: number }
  zAxis: { x: number; y: number; z: number }
  width: number
  length: number
  depth: number
}

const COORDINATE_EPSILON = 1e-6

const getFeatureStackPayload = (
  compiledBuildData: CompiledBuildData,
): FeatureStackIRPayload | null => {
  const candidate = compiledBuildData.resolvedShared?.sp_featureStackIR
  return isFeatureStackIRPayload(candidate) ? candidate : null
}

const quantizeCoordinate = (value: number): number =>
  Math.round(value / COORDINATE_EPSILON)

const getUniqueCoordinates = (values: readonly number[]): number[] => {
  const coordinates = [...values].sort((left, right) => left - right)
  const unique: number[] = []
  for (const coordinate of coordinates) {
    if (
      unique.length === 0 ||
      Math.abs(unique[unique.length - 1] - coordinate) > COORDINATE_EPSILON
    ) {
      unique.push(coordinate)
    }
  }
  return unique
}

const getRectangleBounds = (
  profile: GeometryRequestSketchProfile,
): { minX: number; maxX: number; minY: number; maxY: number } | null => {
  const vertices = profile.verticesProxy
  if (vertices.length !== 4) {
    return null
  }
  if (
    vertices.some(
      (vertex) => !Number.isFinite(vertex.x) || !Number.isFinite(vertex.y),
    )
  ) {
    return null
  }
  const uniqueX = getUniqueCoordinates(vertices.map((vertex) => vertex.x))
  const uniqueY = getUniqueCoordinates(vertices.map((vertex) => vertex.y))
  if (uniqueX.length !== 2 || uniqueY.length !== 2) {
    return null
  }
  const [minX, maxX] = uniqueX
  const [minY, maxY] = uniqueY
  if (maxX - minX <= COORDINATE_EPSILON || maxY - minY <= COORDINATE_EPSILON) {
    return null
  }
  const vertexKeys = new Set(
    vertices.map((vertex) => `${quantizeCoordinate(vertex.x)}:${quantizeCoordinate(vertex.y)}`),
  )
  const expectedCorners = [
    `${quantizeCoordinate(minX)}:${quantizeCoordinate(minY)}`,
    `${quantizeCoordinate(maxX)}:${quantizeCoordinate(minY)}`,
    `${quantizeCoordinate(maxX)}:${quantizeCoordinate(maxY)}`,
    `${quantizeCoordinate(minX)}:${quantizeCoordinate(maxY)}`,
  ]
  return expectedCorners.every((cornerKey) => vertexKeys.has(cornerKey))
    ? { minX, maxX, minY, maxY }
    : null
}

const resolveExtrusionDepths = (
  feature: GeometryRequestExtrudeOp,
): { startDepth: number; depth: number } | null => {
  const extrudeDirection = feature.extrudeDirection ?? 'OneSide'
  const startDepth =
    extrudeDirection === 'TwoSides'
      ? feature.startDepthResolved ?? feature.depthResolved
      : extrudeDirection === 'Symmetric'
        ? feature.depthResolved / 2
        : 0
  const endDepth =
    extrudeDirection === 'TwoSides'
      ? feature.endDepthResolved ?? feature.depthResolved
      : extrudeDirection === 'Symmetric'
        ? feature.depthResolved / 2
        : feature.depthResolved
  const hasValidDirectionDepths =
    extrudeDirection === 'TwoSides'
      ? Number.isFinite(startDepth) &&
        Number.isFinite(endDepth) &&
        startDepth > 0 &&
        endDepth > 0
      : Number.isFinite(feature.depthResolved) && feature.depthResolved > 0
  if (!hasValidDirectionDepths) {
    return null
  }
  return {
    startDepth,
    depth: startDepth + endDepth,
  }
}

const getOcCandidateNames = (target: object, baseName: string): string[] => {
  const members = new Set<string>()
  for (let current: object | null = target; current !== null; current = Object.getPrototypeOf(current)) {
    for (const name of Object.getOwnPropertyNames(current)) {
      members.add(name)
    }
  }
  const suffixedNames = [...members]
    .filter((name) => name === baseName || name.startsWith(`${baseName}_`))
    .sort((left, right) => {
      if (left === baseName) {
        return -1
      }
      if (right === baseName) {
        return 1
      }
      const leftIndex = Number(left.slice(baseName.length + 1))
      const rightIndex = Number(right.slice(baseName.length + 1))
      return leftIndex - rightIndex
    })
  return suffixedNames.length > 0 ? suffixedNames : [baseName]
}

const constructOcValue = (oc: OcInstance, constructorName: string, args: unknown[]): unknown => {
  let lastError: unknown = null
  for (const candidateName of getOcCandidateNames(oc, constructorName)) {
    const candidate = oc[candidateName]
    if (typeof candidate !== 'function') {
      continue
    }
    try {
      return Reflect.construct(candidate as OcConstructor, args)
    } catch (error: unknown) {
      lastError = error
    }
  }
  throw lastError ?? new Error(`OpenCascade constructor unavailable: ${constructorName}`)
}

const invokeOcMethod = (
  target: object,
  methodNames: readonly string[],
  args: unknown[],
): unknown => {
  let lastError: unknown = null
  for (const methodName of methodNames) {
    for (const candidateName of getOcCandidateNames(target, methodName)) {
      const candidate = (target as Record<string, unknown>)[candidateName]
      if (typeof candidate !== 'function') {
        continue
      }
      try {
        return (candidate as OcCallable).apply(target, args)
      } catch (error: unknown) {
        lastError = error
      }
    }
  }
  throw lastError ?? new Error(`OpenCascade method unavailable: ${methodNames.join(' | ')}`)
}

const releaseOcResources = (resources: readonly OcOwnedResource[]): void => {
  const seen = new Set<OcOwnedResource>()
  for (const resource of resources) {
    if (seen.has(resource)) {
      continue
    }
    seen.add(resource)
    if (typeof resource.delete === 'function') {
      resource.delete()
    }
  }
}

const buildOcBoxShape = (
  oc: OcInstance,
  definition: BoxExtrusionDefinition,
): OcOwnedResource => {
  const retainedResources: OcOwnedResource[] = []
  const transientResources: OcOwnedResource[] = []
  try {
    const origin = constructOcValue(oc, 'gp_Pnt', [
      definition.origin.x,
      definition.origin.y,
      definition.origin.z,
    ]) as OcOwnedResource
    transientResources.push(origin)
    const zAxis = constructOcValue(oc, 'gp_Dir', [
      definition.zAxis.x,
      definition.zAxis.y,
      definition.zAxis.z,
    ]) as OcOwnedResource
    transientResources.push(zAxis)
    const xAxis = constructOcValue(oc, 'gp_Dir', [
      definition.xAxis.x,
      definition.xAxis.y,
      definition.xAxis.z,
    ]) as OcOwnedResource
    transientResources.push(xAxis)
    const axis = constructOcValue(oc, 'gp_Ax2', [origin, zAxis, xAxis]) as OcOwnedResource
    transientResources.push(axis)
    const builder = constructOcValue(oc, 'BRepPrimAPI_MakeBox', [
      axis,
      definition.width,
      definition.length,
      definition.depth,
    ]) as OcOwnedResource
    transientResources.push(builder)
    const shape = invokeOcMethod(builder as object, ['Shape', '_operator_TopoDS_Shape'], []) as
      | OcOwnedResource
      | null
    if (shape === null || typeof shape !== 'object') {
      throw new Error(`Authoritative body "${definition.bodyKey}" did not produce a shape.`)
    }
    retainedResources.push(shape)
    return shape
  } finally {
    releaseOcResources(transientResources.filter((resource) => !retainedResources.includes(resource)))
  }
}

const buildSketchProfileIndex = (
  payload: FeatureStackIRPayload,
): Map<string, SketchProfileRuntime> => {
  const index = new Map<string, SketchProfileRuntime>()
  const partKeys = Object.keys(payload.parts).sort(compareSpaghettiSourcePartKeys)
  for (const partKey of partKeys) {
    for (const operation of payload.parts[partKey] ?? []) {
      if (operation.op !== 'sketch') {
        continue
      }
      const sketchPlane = operation.plane ?? 'XY'
      for (const profile of operation.profilesResolved) {
        index.set(`${operation.featureId}:${profile.profileId}`, {
          plane: sketchPlane,
          planeTransform: operation.planeTransform,
          profile,
        })
      }
    }
  }
  return index
}

const buildSupportedBoxExtrusions = (
  payload: FeatureStackIRPayload,
  previewBodies: Record<string, GeometryBody>,
): BoxExtrusionDefinition[] | null => {
  const profileIndex = buildSketchProfileIndex(payload)
  const definitions: BoxExtrusionDefinition[] = []
  const partKeys = Object.keys(payload.parts).sort(compareSpaghettiSourcePartKeys)

  for (const partKey of partKeys) {
    for (const operation of payload.parts[partKey] ?? []) {
      if (operation.op !== 'extrude') {
        continue
      }
      if (
        operation.profileRef === null ||
        operation.extrudeType !== 'Body' ||
        operation.taperResolved !== 0 ||
        operation.offsetResolved !== 0
      ) {
        return null
      }
      const bodyId = operation.bodyId ?? operation.featureId
      const bodyKey = `${partKey}:${bodyId}`
      const previewBody = previewBodies[bodyKey]
      if (previewBody === undefined) {
        return null
      }
      const sketchProfile = profileIndex.get(
        `${operation.profileRef.sketchFeatureId}:${operation.profileRef.profileId}`,
      )
      if (sketchProfile === undefined) {
        return null
      }
      const bounds = getRectangleBounds(sketchProfile.profile)
      const depths = resolveExtrusionDepths(operation)
      if (bounds === null || depths === null) {
        return null
      }
      const frame = resolveSketchPlaneFrame(sketchProfile.plane, sketchProfile.planeTransform)
      definitions.push({
        bodyKey,
        body: previewBody,
        origin: {
          x:
            frame.origin.x +
            frame.xAxis.x * bounds.minX +
            frame.yAxis.x * bounds.minY -
            frame.zAxis.x * depths.startDepth,
          y:
            frame.origin.y +
            frame.xAxis.y * bounds.minX +
            frame.yAxis.y * bounds.minY -
            frame.zAxis.y * depths.startDepth,
          z:
            frame.origin.z +
            frame.xAxis.z * bounds.minX +
            frame.yAxis.z * bounds.minY -
            frame.zAxis.z * depths.startDepth,
        },
        xAxis: frame.xAxis,
        zAxis: frame.zAxis,
        width: bounds.maxX - bounds.minX,
        length: bounds.maxY - bounds.minY,
        depth: depths.depth,
      })
    }
  }

  return definitions.length > 0 ? definitions : null
}

const buildAuthoritativeShapeSet = async (
  payload: FeatureStackIRPayload,
  previewBodies: Record<string, GeometryBody>,
): Promise<AuthoritativeShapeSetResource | null> => {
  const boxExtrusions = buildSupportedBoxExtrusions(payload, previewBodies)
  if (boxExtrusions === null) {
    return null
  }
  const oc = (await getOc()) as OcInstance
  const ownedResources: OcOwnedResource[] = []
  try {
    for (const definition of boxExtrusions) {
      ownedResources.push(buildOcBoxShape(oc, definition))
    }
    return {
      ownedResources,
    }
  } catch (error: unknown) {
    releaseOcResources(ownedResources)
    throw error
  }
}

export const buildAuthoritativeGeometry = async (
  options: AuthoritativeGeometryBuildInput,
): Promise<AuthoritativeGeometryBuildResult> => {
  const payload = getFeatureStackPayload(options.compiledBuildData)
  if (payload === null) {
    return {
      authoritativeGeometryResult: null,
    }
  }

  const preview = executeFeatureStack(payload)
  if (preview.diagnostics.length > 0 || Object.keys(preview.bodies).length === 0) {
    return {
      authoritativeGeometryResult: null,
    }
  }

  let shapeSetResource: AuthoritativeShapeSetResource | null = null
  try {
    shapeSetResource = await buildAuthoritativeShapeSet(payload, preview.bodies)
  } catch {
    return {
      authoritativeGeometryResult: null,
    }
  }
  if (shapeSetResource === null) {
    return {
      authoritativeGeometryResult: null,
    }
  }

  const authoritativeHandle = registerAuthoritativeShapeSet(shapeSetResource)
  try {
    return {
      authoritativeGeometryResult: createAuthoritativeGeometryResultBundle({
        request: options.request,
        bodies: preview.bodies,
        meshPreview: preview.mergedMesh,
        diagnostics: preview.diagnostics,
        trace: preview.bodyTrace,
        authoritativeHandle,
      }),
    }
  } catch {
    releaseAuthoritativeShapeSet(authoritativeHandle.handleId)
    return {
      authoritativeGeometryResult: null,
    }
  }
}
