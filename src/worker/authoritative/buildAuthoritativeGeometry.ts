import type {
  GeometryBody,
  GeometryResultBundle,
  GeometryResultRequestIdentity,
} from '../../shared/geometryResult'
import { createAuthoritativeGeometryResultBundle } from '../../shared/geometryResult'
import type { CompiledBuildData } from '../../shared/buildTypes'
import { compareSpaghettiSourcePartKeys } from '../../shared/buildStatsKeys'
import type {
  GeometryRequestExtrudeOp,
  GeometryRequestPlane,
  GeometryRequestSketchOp,
  GeometryRequestSketchProfile,
} from '../../shared/geometryRequest'
import { resolveSketchPlaneFrame } from '../../shared/sketchPlaneFrame'
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
import {
  buildOcSketchProfileFace,
  type OcInstance,
  type OcOwnedResource,
} from './ocSketchWire'

export type AuthoritativeGeometryBuildInput = {
  compiledBuildData: CompiledBuildData
  request: GeometryResultRequestIdentity
}

export type AuthoritativeGeometryBuildResult = {
  authoritativeGeometryResult: GeometryResultBundle | null
}

type OcConstructor = new (...args: unknown[]) => unknown

type OcCallable = (...args: unknown[]) => unknown

type SketchProfileRuntime = {
  plane: GeometryRequestPlane
  planeTransform: GeometryRequestSketchOp['planeTransform']
  profile: GeometryRequestSketchProfile
}

type SketchProfileLookup = {
  sketches: Map<
    string,
    {
      plane: GeometryRequestPlane
      planeTransform: GeometryRequestSketchOp['planeTransform']
      profilesInOrder: SketchProfileRuntime[]
      profilesById: Map<string, SketchProfileRuntime>
    }
  >
  profilesByKey: Map<string, SketchProfileRuntime>
}

type SketchExtrusionCandidate = {
  bodyKey: string
  sketchProfile: SketchProfileRuntime
  startDepth: number
  depth: number
}

type PrismExtrusionDefinition = {
  bodyKey: string
  face: OcOwnedResource
  direction: { x: number; y: number; z: number }
}

const getFeatureStackPayload = (
  compiledBuildData: CompiledBuildData,
): FeatureStackIRPayload | null => {
  const candidate = compiledBuildData.resolvedShared?.sp_featureStackIR
  return isFeatureStackIRPayload(candidate) ? candidate : null
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

const constructOcValueFromArgVariants = (
  oc: OcInstance,
  constructorName: string,
  argVariants: readonly unknown[][],
): OcOwnedResource | null => {
  for (const args of argVariants) {
    try {
      const value = constructOcValue(oc, constructorName, args)
      if (typeof value === 'object' && value !== null) {
        return value as OcOwnedResource
      }
    } catch {
      // Keep trying supported overloads until one succeeds.
    }
  }
  return null
}

const buildOcPrismShape = (
  oc: OcInstance,
  definition: PrismExtrusionDefinition,
): OcOwnedResource => {
  const retainedResources: OcOwnedResource[] = []
  const transientResources: OcOwnedResource[] = []
  try {
    const vector = constructOcValue(oc, 'gp_Vec', [
      definition.direction.x,
      definition.direction.y,
      definition.direction.z,
    ]) as OcOwnedResource
    transientResources.push(vector)
    const builder = constructOcValueFromArgVariants(oc, 'BRepPrimAPI_MakePrism', [
      [definition.face, vector],
      [definition.face, vector, false],
      [definition.face, vector, false, true],
    ])
    if (builder === null) {
      throw new Error(`Authoritative body "${definition.bodyKey}" prism builder unavailable.`)
    }
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

const buildSketchProfileLookup = (payload: FeatureStackIRPayload): SketchProfileLookup => {
  const sketches = new Map<
    string,
    {
      plane: GeometryRequestPlane
      planeTransform: GeometryRequestSketchOp['planeTransform']
      profilesInOrder: SketchProfileRuntime[]
      profilesById: Map<string, SketchProfileRuntime>
    }
  >()
  const profilesByKey = new Map<string, SketchProfileRuntime>()
  const partKeys = Object.keys(payload.parts).sort(compareSpaghettiSourcePartKeys)
  for (const partKey of partKeys) {
    for (const operation of payload.parts[partKey] ?? []) {
      if (operation.op !== 'sketch') {
        continue
      }
      const sketchPlane = operation.plane ?? 'XY'
      const profilesInOrder: SketchProfileRuntime[] = []
      const profilesById = new Map<string, SketchProfileRuntime>()
      for (const profile of operation.profilesResolved) {
        const runtimeProfile = {
          plane: sketchPlane,
          planeTransform: operation.planeTransform,
          profile,
        }
        profilesInOrder.push(runtimeProfile)
        profilesById.set(profile.profileId, runtimeProfile)
        profilesByKey.set(`${operation.featureId}:${profile.profileId}`, runtimeProfile)
      }
      sketches.set(operation.featureId, {
        plane: sketchPlane,
        planeTransform: operation.planeTransform,
        profilesInOrder,
        profilesById,
      })
    }
  }
  return {
    sketches,
    profilesByKey,
  }
}

const resolveExtrudeSketchProfiles = (
  operation: GeometryRequestExtrudeOp,
  lookup: SketchProfileLookup,
): SketchProfileRuntime[] | null => {
  const resolveAllFromSketchProfiles = (sketchFeatureId: string): SketchProfileRuntime[] | null => {
    const sketch = lookup.sketches.get(sketchFeatureId)
    if (sketch === undefined || sketch.profilesInOrder.length === 0) {
      return null
    }
    return sketch.profilesInOrder
  }

  const resolveSingleProfile = (
    sketchFeatureId: string,
    profileId: string,
  ): SketchProfileRuntime[] | null => {
    const keyedProfile = lookup.profilesByKey.get(`${sketchFeatureId}:${profileId}`)
    if (keyedProfile !== undefined) {
      return [keyedProfile]
    }
    const sketch = lookup.sketches.get(sketchFeatureId)
    const profile = sketch?.profilesById.get(profileId)
    return profile === undefined ? null : [profile]
  }

  if (operation.profileSelection?.mode === 'allFromSketch') {
    return resolveAllFromSketchProfiles(operation.profileSelection.sketchFeatureId)
  }

  if (operation.profileSelection?.mode === 'single') {
    return resolveSingleProfile(
      operation.profileSelection.sketchFeatureId,
      operation.profileSelection.profileId,
    )
  }

  if (operation.profileSelection?.mode === 'contributors') {
    const profiles: SketchProfileRuntime[] = []
    for (const contributor of operation.profileSelection.contributors) {
      const resolved =
        contributor.kind === 'allFromSketch'
          ? resolveAllFromSketchProfiles(contributor.sketchFeatureId)
          : resolveSingleProfile(contributor.sketchFeatureId, contributor.profileId)
      if (resolved === null || resolved.length === 0) {
        return null
      }
      profiles.push(...resolved)
    }
    return profiles.length > 0 ? profiles : null
  }

  if (operation.profileRef === null) {
    return null
  }

  const profile = lookup.profilesByKey.get(
    `${operation.profileRef.sketchFeatureId}:${operation.profileRef.profileId}`,
  )
  return profile === undefined ? null : [profile]
}

const collectSupportedSketchExtrusionCandidates = (
  payload: FeatureStackIRPayload,
  previewBodies: Record<string, GeometryBody>,
): SketchExtrusionCandidate[] | null => {
  const profileLookup = buildSketchProfileLookup(payload)
  const candidates: SketchExtrusionCandidate[] = []
  const partKeys = Object.keys(payload.parts).sort(compareSpaghettiSourcePartKeys)

  for (const partKey of partKeys) {
    for (const operation of payload.parts[partKey] ?? []) {
      if (operation.op !== 'extrude') {
        continue
      }
      if (
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
      const sketchProfiles = resolveExtrudeSketchProfiles(operation, profileLookup)
      if (sketchProfiles === null || sketchProfiles.length === 0) {
        return null
      }
      const depths = resolveExtrusionDepths(operation)
      if (depths === null) {
        return null
      }
      for (const sketchProfile of sketchProfiles) {
        candidates.push({
          bodyKey,
          sketchProfile,
          startDepth: depths.startDepth,
          depth: depths.depth,
        })
      }
    }
  }

  return candidates.length > 0 ? candidates : null
}

const buildAuthoritativeShapeSet = async (
  payload: FeatureStackIRPayload,
  previewBodies: Record<string, GeometryBody>,
): Promise<AuthoritativeShapeSetResource | null> => {
  const sketchExtrusions = collectSupportedSketchExtrusionCandidates(payload, previewBodies)
  if (sketchExtrusions === null) {
    return null
  }
  const oc = (await getOc()) as OcInstance
  const ownedResources: OcOwnedResource[] = []
  try {
    for (const candidate of sketchExtrusions) {
      const frame = resolveSketchPlaneFrame(
        candidate.sketchProfile.plane,
        candidate.sketchProfile.planeTransform,
      )
      const face = buildOcSketchProfileFace(
        {
          oc,
          constructOcValue,
          invokeOcMethod,
          releaseOcResources,
          projectSketchPoint: (point) => ({
            x:
              frame.origin.x +
              frame.xAxis.x * point.x +
              frame.yAxis.x * point.y -
              frame.zAxis.x * candidate.startDepth,
            y:
              frame.origin.y +
              frame.xAxis.y * point.x +
              frame.yAxis.y * point.y -
              frame.zAxis.y * candidate.startDepth,
            z:
              frame.origin.z +
              frame.xAxis.z * point.x +
              frame.yAxis.z * point.y -
              frame.zAxis.z * candidate.startDepth,
          }),
        },
        candidate.sketchProfile.profile,
      )
      if (face === null) {
        releaseOcResources(ownedResources)
        return null
      }
      try {
        ownedResources.push(
          buildOcPrismShape(oc, {
            bodyKey: candidate.bodyKey,
            face: face.face,
            direction: {
              x: frame.zAxis.x * candidate.depth,
              y: frame.zAxis.y * candidate.depth,
              z: frame.zAxis.z * candidate.depth,
            },
          }),
        )
      } finally {
        releaseOcResources(face.ownedResources)
      }
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
