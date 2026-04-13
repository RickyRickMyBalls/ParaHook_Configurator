import { z } from 'zod'
import { sketchFeatureSchema } from '../../../features/featureSchema'
import { deriveProfilesWithDiagnostics } from '../../../features/profileDerivation'
import type { ProfileOutput, SketchFeature } from '../../../features/featureTypes'
import type {
  EdgeEndpoint,
  PortSpec,
  SpaghettiGraph,
  SpaghettiNode,
} from '../../../schema/spaghettiTypes'

export const geometrySketchParamsSchema = z
  .object({
    sketch: sketchFeatureSchema,
  })
  .strict()

const geometryExtrudeStoredTypeSchema = z.enum(['Basic', 'Twist', 'Body', 'Walls'])
const geometryExtrudeStoredDirectionSchema = z.enum(['OneSide', 'TwoSides', 'Symmetric'])
const geometryExtrudeStoredBodyGenerationModeSchema = z.enum(['Combine', 'NewObjects'])

export const geometryExtrudeParamsSchema = z
  .object({
    extrudeType: geometryExtrudeStoredTypeSchema.optional(),
    extrudeDirection: geometryExtrudeStoredDirectionSchema.optional(),
    bodyGenerationMode: geometryExtrudeStoredBodyGenerationModeSchema.optional(),
    depthMm: z.number().finite().optional(),
    startDepthMm: z.number().finite().optional(),
    endDepthMm: z.number().finite().optional(),
    taperAngleDeg: z.number().finite().optional(),
  })
  .strict()

export const defaultGeometryExtrudeDepthMm = 20

export const GEOMETRY_EXTRUDE_TYPE_OPTIONS = ['Body', 'Walls'] as const
export type GeometryExtrudeType = (typeof GEOMETRY_EXTRUDE_TYPE_OPTIONS)[number]

const clampExtrudeTypeIndex = (value: number): number =>
  Math.min(GEOMETRY_EXTRUDE_TYPE_OPTIONS.length - 1, Math.max(0, Math.round(value)))

export const mapWholeNumberToGeometryExtrudeType = (
  value: number,
): GeometryExtrudeType => GEOMETRY_EXTRUDE_TYPE_OPTIONS[clampExtrudeTypeIndex(value)] ?? 'Body'

export const getGeometryExtrudeTypeIndex = (value: GeometryExtrudeType): number =>
  GEOMETRY_EXTRUDE_TYPE_OPTIONS.indexOf(value)

export const normalizeGeometryExtrudeType = (value: unknown): GeometryExtrudeType => {
  if (value === 'Basic') {
    return 'Body'
  }
  if (value === 'Twist') {
    return 'Walls'
  }
  return value === 'Walls' ? 'Walls' : 'Body'
}

export const GEOMETRY_EXTRUDE_DIRECTION_OPTIONS = [
  'OneSide',
  'TwoSides',
  'Symmetric',
] as const
export type GeometryExtrudeDirection = (typeof GEOMETRY_EXTRUDE_DIRECTION_OPTIONS)[number]

const clampExtrudeDirectionIndex = (value: number): number =>
  Math.min(
    GEOMETRY_EXTRUDE_DIRECTION_OPTIONS.length - 1,
    Math.max(0, Math.round(value)),
  )

export const mapWholeNumberToGeometryExtrudeDirection = (
  value: number,
): GeometryExtrudeDirection =>
  GEOMETRY_EXTRUDE_DIRECTION_OPTIONS[clampExtrudeDirectionIndex(value)] ?? 'OneSide'

export const normalizeGeometryExtrudeDirection = (
  value: unknown,
): GeometryExtrudeDirection => {
  if (value === 'TwoSides') {
    return 'TwoSides'
  }
  if (value === 'Symmetric') {
    return 'Symmetric'
  }
  return 'OneSide'
}

export const GEOMETRY_EXTRUDE_BODY_GENERATION_MODE_OPTIONS = [
  'Combine',
  'NewObjects',
] as const
export type GeometryExtrudeBodyGenerationMode =
  (typeof GEOMETRY_EXTRUDE_BODY_GENERATION_MODE_OPTIONS)[number]

export const normalizeGeometryExtrudeBodyGenerationMode = (
  value: unknown,
): GeometryExtrudeBodyGenerationMode => {
  return value === 'Combine' ? 'Combine' : 'NewObjects'
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value)

export type ProfileOutputLike = {
  profileId: string
  profileIndex: number
  area: number
}

export const isProfileOutputLike = (value: unknown): value is ProfileOutputLike =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { profileId?: unknown }).profileId === 'string' &&
  (value as { profileId: string }).profileId.length > 0 &&
  isFiniteNumber((value as { profileIndex?: unknown }).profileIndex) &&
  isFiniteNumber((value as { area?: unknown }).area)

export const isSketchProfilesValue = (
  value: unknown,
): value is ProfileOutputLike[] => Array.isArray(value) && value.every((entry) => isProfileOutputLike(entry))

export const isExtrusionProfileInputLike = (value: unknown): boolean =>
  isSketchProfilesValue(value) && value.length > 0

export const countExtrusionProfileTargets = (value: unknown): number =>
  isSketchProfilesValue(value) ? value.length : 0

export const createManagedSketchFeature = (): SketchFeature => ({
  type: 'sketch' as const,
  featureId: 'sketch-1',
  plane: 'XY' as const,
  planeTransform: {
    offsetMm: 0,
    translation: { x: 0, y: 0, z: 0 },
    rotationDeg: { x: 0, y: 0, z: 0 },
    inPlaneRotationDeg: 0,
  },
  components: [],
  outputs: {
    profiles: [],
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
  },
})

export const readManagedSketchFeatureFromParams = (
  params: Record<string, unknown>,
): SketchFeature => {
  const parsed = geometrySketchParamsSchema.safeParse(params)
  return parsed.success ? parsed.data.sketch : createManagedSketchFeature()
}

export const readGeometryExtrudeTypeFromParams = (
  params: Record<string, unknown>,
): GeometryExtrudeType => {
  return normalizeGeometryExtrudeType(params.extrudeType)
}

export const readGeometryExtrudeDirectionFromParams = (
  params: Record<string, unknown>,
): GeometryExtrudeDirection => {
  return normalizeGeometryExtrudeDirection(params.extrudeDirection)
}

export const readGeometryExtrudeBodyGenerationModeFromParams = (
  params: Record<string, unknown>,
): GeometryExtrudeBodyGenerationMode => {
  return normalizeGeometryExtrudeBodyGenerationMode(params.bodyGenerationMode)
}

export const readGeometryExtrudeTaperAngleDegFromParams = (
  params: Record<string, unknown>,
): number => {
  return typeof params.taperAngleDeg === 'number' && Number.isFinite(params.taperAngleDeg)
    ? params.taperAngleDeg
    : 0
}

export const readGeometryExtrudeDepthMmFromParams = (
  params: Record<string, unknown>,
): number => {
  return typeof params.depthMm === 'number' && Number.isFinite(params.depthMm)
    ? params.depthMm
    : defaultGeometryExtrudeDepthMm
}

export const readGeometryExtrudeStartDepthMmFromParams = (
  params: Record<string, unknown>,
): number => {
  return typeof params.startDepthMm === 'number' && Number.isFinite(params.startDepthMm)
    ? params.startDepthMm
    : readGeometryExtrudeDepthMmFromParams(params)
}

export const readGeometryExtrudeEndDepthMmFromParams = (
  params: Record<string, unknown>,
): number => {
  return typeof params.endDepthMm === 'number' && Number.isFinite(params.endDepthMm)
    ? params.endDepthMm
    : readGeometryExtrudeDepthMmFromParams(params)
}

const SKETCH_PROFILE_MEMBER_PORT_PREFIX = 'SketchProfile:'
const EXTRUDE_PROFILE_ENTRY_PORT_PREFIX = 'ExtrusionProfile::entry::'
const EXTRUDE_BODY_MEMBER_PORT_PREFIX = 'SolidBody:'

export const buildSketchProfileMemberPortId = (profileId: string): string =>
  `${SKETCH_PROFILE_MEMBER_PORT_PREFIX}${profileId}`

export const parseSketchProfileMemberPortId = (
  portId: string,
): { profileId: string } | null => {
  if (!portId.startsWith(SKETCH_PROFILE_MEMBER_PORT_PREFIX)) {
    return null
  }
  const profileId = portId.slice(SKETCH_PROFILE_MEMBER_PORT_PREFIX.length)
  return profileId.length > 0 ? { profileId } : null
}

const readManagedSketchFeatureFromNode = (node: SpaghettiNode): SketchFeature | null => {
  if (node.type !== 'Geometry/Sketch') {
    return null
  }
  return readManagedSketchFeatureFromParams(node.params)
}

const deriveResolvedProfiles = (node: SpaghettiNode): ProfileOutput[] => {
  const sketch = readManagedSketchFeatureFromNode(node)
  if (sketch === null) {
    return []
  }
  return deriveProfilesWithDiagnostics(sketch.components).profiles
}

export const listSketchProfileMemberOutputPorts = (node: SpaghettiNode): PortSpec[] =>
  deriveResolvedProfiles(node).map((profile) => ({
    portId: buildSketchProfileMemberPortId(profile.profileId),
    label: 'SketchProfile',
    type: { kind: 'sketchProfile' },
  }))

export const getSketchProfileMemberOutputValue = (
  node: SpaghettiNode,
  portId: string,
): ProfileOutput | undefined => {
  const parsed = parseSketchProfileMemberPortId(portId)
  if (parsed === null) {
    return undefined
  }
  return deriveResolvedProfiles(node).find((profile) => profile.profileId === parsed.profileId)
}

export const buildExtrudeProfileEntryPortId = (edgeId: string): string =>
  `${EXTRUDE_PROFILE_ENTRY_PORT_PREFIX}${edgeId}`

export const parseExtrudeProfileEntryPortId = (
  portId: string,
): { edgeId: string } | null => {
  if (!portId.startsWith(EXTRUDE_PROFILE_ENTRY_PORT_PREFIX)) {
    return null
  }
  const edgeId = portId.slice(EXTRUDE_PROFILE_ENTRY_PORT_PREFIX.length)
  return edgeId.length > 0 ? { edgeId } : null
}

export type ExtrudeProfileContributor = {
  kind: 'aggregate' | 'single'
  label: 'SketchProfiles' | 'SketchProfile'
  profileId?: string
}

const normalizePath = (path: string[] | undefined): string[] | undefined =>
  path === undefined || path.length === 0 ? undefined : path

const isExtrusionProfileTargetPortId = (portId: string): boolean =>
  portId === 'ExtrusionProfile' ||
  portId === 'SketchProfiles' ||
  parseExtrudeProfileEntryPortId(portId) !== null

const normalizeEndpointPath = (endpoint: EdgeEndpoint): EdgeEndpoint => {
  const path = normalizePath(endpoint.path)
  return path === undefined
    ? {
        nodeId: endpoint.nodeId,
        portId: endpoint.portId,
      }
    : {
        nodeId: endpoint.nodeId,
        portId: endpoint.portId,
        path,
      }
}

const normalizeExtrudeProfileTargetEndpoint = (endpoint: EdgeEndpoint): EdgeEndpoint => {
  if (!isExtrusionProfileTargetPortId(endpoint.portId)) {
    return normalizeEndpointPath(endpoint)
  }
  return {
    nodeId: endpoint.nodeId,
    portId: 'ExtrusionProfile',
  }
}

export const isWholeExtrusionProfileTargetEndpoint = (
  endpoint: Pick<EdgeEndpoint, 'portId' | 'path'>,
): boolean =>
  normalizeExtrudeProfileTargetEndpoint({
    nodeId: '__target__',
    portId: endpoint.portId,
    path: endpoint.path,
  }).portId === 'ExtrusionProfile'

export const classifyExtrudeProfileContributorPortId = (
  portId: string,
): ExtrudeProfileContributor | null => {
  if (portId === 'SketchProfiles') {
    return {
      kind: 'aggregate',
      label: 'SketchProfiles',
    }
  }
  if (portId === 'SketchProfile') {
    return {
      kind: 'single',
      label: 'SketchProfile',
    }
  }
  const parsedMember = parseSketchProfileMemberPortId(portId)
  if (parsedMember !== null) {
    return {
      kind: 'single',
      label: 'SketchProfile',
      profileId: parsedMember.profileId,
    }
  }
  return null
}

export const classifyExtrudeProfileContributorEdge = (edge: {
  from: Pick<EdgeEndpoint, 'portId'>
  to: Pick<EdgeEndpoint, 'portId' | 'path'>
}): ExtrudeProfileContributor | null => {
  if (!isWholeExtrusionProfileTargetEndpoint(edge.to)) {
    return null
  }
  return classifyExtrudeProfileContributorPortId(edge.from.portId)
}

export const normalizeExtrudeProfileConnectionEndpoints = (params: {
  from: EdgeEndpoint
  to: EdgeEndpoint
}): { from: EdgeEndpoint; to: EdgeEndpoint } => {
  const normalizedFrom = normalizeEndpointPath(params.from)
  const normalizedTo = normalizeExtrudeProfileTargetEndpoint(params.to)
  if (
    classifyExtrudeProfileContributorPortId(normalizedFrom.portId) !== null &&
    isWholeExtrusionProfileTargetEndpoint(normalizedTo)
  ) {
    return {
      from: {
        nodeId: normalizedFrom.nodeId,
        portId: normalizedFrom.portId,
      },
      to: normalizedTo,
    }
  }
  return {
    from: normalizedFrom,
    to: normalizedTo,
  }
}

export const getExtrudeProfileSourcePath = (edge: {
  from: Pick<EdgeEndpoint, 'portId' | 'path'>
  to: Pick<EdgeEndpoint, 'portId' | 'path'>
}): string[] | undefined =>
  classifyExtrudeProfileContributorPortId(edge.from.portId) !== null &&
  isWholeExtrusionProfileTargetEndpoint(edge.to)
    ? undefined
    : normalizePath(edge.from.path)

const normalizeExtrudeProfileContributorValue = (
  value: unknown,
): ProfileOutputLike[] | null => {
  if (isProfileOutputLike(value)) {
    return [value]
  }
  if (isSketchProfilesValue(value)) {
    return value
  }
  return null
}

export const flattenExtrudeProfileContributorValues = (
  values: readonly unknown[],
): ProfileOutputLike[] | null => {
  const flattened: ProfileOutputLike[] = []
  for (const value of values) {
    const normalizedValue = normalizeExtrudeProfileContributorValue(value)
    if (normalizedValue === null) {
      return null
    }
    flattened.push(...normalizedValue)
  }
  return flattened
}

export const countProfilesForExtrudeContributorEdge = (
  graph: SpaghettiGraph,
  edge: SpaghettiGraph['edges'][number],
): number => {
  const contributor = classifyExtrudeProfileContributorEdge(edge)
  if (contributor === null) {
    return 0
  }
  if (contributor.kind === 'single') {
    return 1
  }
  const sourceNode = graph.nodes.find((candidate) => candidate.nodeId === edge.from.nodeId)
  if (sourceNode === undefined) {
    return 0
  }
  return listSketchProfileMemberOutputPorts(sourceNode).length
}

const formatMemberIndex = (memberIndex: number): string =>
  `${memberIndex + 1}`.padStart(3, '0')

export const buildExtrudeBodyMemberPortId = (memberIndex: number): string =>
  `${EXTRUDE_BODY_MEMBER_PORT_PREFIX}${formatMemberIndex(memberIndex)}`

export const parseExtrudeBodyMemberPortId = (
  portId: string,
): { memberIndex: number } | null => {
  if (!portId.startsWith(EXTRUDE_BODY_MEMBER_PORT_PREFIX)) {
    return null
  }
  const suffix = portId.slice(EXTRUDE_BODY_MEMBER_PORT_PREFIX.length)
  if (!/^\d+$/.test(suffix)) {
    return null
  }
  const parsed = Number.parseInt(suffix, 10)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null
  }
  return { memberIndex: parsed - 1 }
}

const listWholeIncomingProfileEdges = (
  graph: SpaghettiGraph,
  nodeId: string,
): SpaghettiGraph['edges'][number][] =>
  graph.edges.filter(
    (edge) =>
      edge.to.nodeId === nodeId &&
      isWholeExtrusionProfileTargetEndpoint(edge.to),
  )

const countResolvedExtrudeBodyMembersFromGraph = (
  graph: SpaghettiGraph,
  node: SpaghettiNode,
): number => {
  if (node.type !== 'Geometry/Extrude') {
    return 0
  }
  if (readGeometryExtrudeBodyGenerationModeFromParams(node.params) !== 'NewObjects') {
    return 0
  }
  let count = 0
  for (const edge of listWholeIncomingProfileEdges(graph, node.nodeId)) {
    if (
      edge.from.portId === 'SketchProfile' ||
      parseSketchProfileMemberPortId(edge.from.portId) !== null
    ) {
      count += 1
      continue
    }
    count += countProfilesForExtrudeContributorEdge(graph, edge)
  }
  return count
}

export const listExtrudeBodyMemberOutputPorts = (
  graph: SpaghettiGraph | undefined,
  node: SpaghettiNode,
): PortSpec[] => {
  if (graph === undefined) {
    return []
  }
  const memberCount = countResolvedExtrudeBodyMembersFromGraph(graph, node)
  return Array.from({ length: memberCount }, (_, memberIndex) => ({
    portId: buildExtrudeBodyMemberPortId(memberIndex),
    label: 'SolidBody',
    type: { kind: 'solidBody' },
  }))
}

export const getExtrudeBodyMemberOutputValue = (
  collectionValue: unknown,
  portId: string,
): unknown => {
  const parsed = parseExtrudeBodyMemberPortId(portId)
  if (parsed === null) {
    return undefined
  }
  if (
    typeof collectionValue !== 'object' ||
    collectionValue === null ||
    !Array.isArray((collectionValue as { bodies?: unknown[] }).bodies)
  ) {
    return undefined
  }
  return (collectionValue as { bodies: unknown[] }).bodies[parsed.memberIndex]
}
