import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { compileFeatureStack, type FeatureStackIR } from '../features/compileFeatureStack'
import { getEffectiveFeatureStack } from '../features/featureDependencies'
import { readFeatureStack } from '../features/featureSchema'
import type {
  GeometryRequestExtrudeProfileContributor,
  GeometryRequestExtrudeProfileSelection,
  GeometryRequestOp,
  GeometryRequestPayload,
} from '../contracts/geometryRequest'
import { isGeometryRequestProfileLoop } from '../contracts/geometryRequest'
import {
  createDefaultSketchPlaneTransform,
  type ProfileLoop,
  type SketchPlaneTransform,
} from '../features/featureTypes'
import {
  getExtrudeProfileSourcePath,
  isWholeExtrusionProfileTargetEndpoint,
} from '../features/extrudeProfileConnections'
import { applyFeatureVirtualInputOverrides } from '../features/featureVirtualPorts'
import {
  getNodeDef,
  mapWholeNumberToGeometryExtrudeDirection,
  readGeometryExtrudeBodyGenerationModeFromParams,
  readGeometryExtrudeDirectionFromParams,
  readGeometryExtrudeTaperAngleDegFromParams,
  readGeometryExtrudeTypeFromParams,
} from '../registry/nodeRegistry'
import type { SpaghettiDiagnostic } from './validateGraph'
import { evaluateSpaghettiGraph } from './evaluateGraph'
import { buildExtrudeBodyId } from '../features/extrudeBodyIdentity'

export type CompileSpaghettiGraphResult = {
  ok: boolean
  diagnostics: {
    errors: SpaghettiDiagnostic[]
    warnings: SpaghettiDiagnostic[]
  }
  evaluation?: {
    topoOrder: string[]
  }
  buildInputs?: {
    orderedPartKeys: string[]
    resolvedParts: Record<string, Record<string, unknown>>
    resolvedShared?: Record<string, unknown>
  }
}

type BasePartId = 'baseplate' | 'cube' | 'cubeProof' | 'toeHook' | 'heelKick' | 'extrude'
type OwnedPartKey = string

type PartNodeSpec = {
  nodeType: 'Part/Baseplate' | 'Part/Cube' | 'Part/CubeProof' | 'Part/ToeHook' | 'Part/HeelKick'
  basePartId: BasePartId
}

const PART_NODE_SPECS: readonly PartNodeSpec[] = [
  { nodeType: 'Part/Baseplate', basePartId: 'baseplate' },
  { nodeType: 'Part/Cube', basePartId: 'cube' },
  { nodeType: 'Part/CubeProof', basePartId: 'cubeProof' },
  { nodeType: 'Part/ToeHook', basePartId: 'toeHook' },
  { nodeType: 'Part/HeelKick', basePartId: 'heelKick' },
]

const ALWAYS_NUMBERED_PART_IDS = new Set<BasePartId>(['toeHook', 'heelKick', 'extrude'])

export type FeatureStackIrParts = Record<OwnedPartKey, FeatureStackIR>

export type FeatureStackIrPartsComputation = {
  parts: FeatureStackIrParts
  orderedPartKeys: string[]
  nodeIdToPartKey: Record<string, OwnedPartKey>
  partNodesByPartKey: Record<OwnedPartKey, SpaghettiGraph['nodes'][number]>
  hasNonEmptyFeatureStack: boolean
  warnings: SpaghettiDiagnostic[]
}

const compareDiagnostics = (a: SpaghettiDiagnostic, b: SpaghettiDiagnostic): number =>
  a.code.localeCompare(b.code) ||
  (a.nodeId ?? '').localeCompare(b.nodeId ?? '') ||
  (a.edgeId ?? '').localeCompare(b.edgeId ?? '') ||
  a.message.localeCompare(b.message)

const sortDiagnostics = (
  diagnostics: readonly SpaghettiDiagnostic[],
): SpaghettiDiagnostic[] => [...diagnostics].sort(compareDiagnostics)

const toGeometryRequestParts = (parts: FeatureStackIrParts): GeometryRequestPayload['parts'] => {
  const out: GeometryRequestPayload['parts'] = {}
  for (const [partKey, operations] of Object.entries(parts)) {
    const requestOps: GeometryRequestOp[] = []
    for (const operation of operations) {
      if (operation.op === 'closeProfile') {
        continue
      }
      requestOps.push(operation)
    }
    out[partKey] = requestOps
  }
  return out
}

const buildOwnedPartKey = (
  basePartId: BasePartId,
  index: number,
  total: number,
): OwnedPartKey =>
  ALWAYS_NUMBERED_PART_IDS.has(basePartId) || total > 1
    ? `${basePartId}#${index + 1}`
    : basePartId

type ToeHookAnchorPortMapping = {
  uiPortId: 'anchorSpline'
  payloadKey: 'anchorSpline2'
}

type HeelKickAnchorPortMapping = {
  uiPortId: 'anchorSpline'
  payloadKey: 'anchorSpline2'
}

const getToeHookAnchorPortMapping = (): ToeHookAnchorPortMapping => ({
  // Hard compatibility invariant: build/protocol payload key must remain "anchorSpline2"
  // even though the canonical UI ToeHook input port id is "anchorSpline".
  uiPortId: 'anchorSpline',
  payloadKey: 'anchorSpline2',
})

const getHeelKickAnchorPortMapping = (): HeelKickAnchorPortMapping => ({
  // Hard compatibility invariant: build/protocol payload key must remain "anchorSpline2"
  // even though the canonical UI HeelKick input port id is "anchorSpline".
  uiPortId: 'anchorSpline',
  payloadKey: 'anchorSpline2',
})

const isSketchPlane = (value: unknown): value is 'XY' | 'XZ' | 'YZ' =>
  value === 'XY' || value === 'XZ' || value === 'YZ'

const isVec3Literal = (
  value: unknown,
): value is SketchPlaneTransform['translation'] =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { x?: unknown }).x === 'number' &&
  Number.isFinite((value as { x: number }).x) &&
  typeof (value as { y?: unknown }).y === 'number' &&
  Number.isFinite((value as { y: number }).y) &&
  typeof (value as { z?: unknown }).z === 'number' &&
  Number.isFinite((value as { z: number }).z)

const isSketchPlaneTransform = (value: unknown): value is SketchPlaneTransform =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { offsetMm?: unknown }).offsetMm === 'number' &&
  Number.isFinite((value as { offsetMm: number }).offsetMm) &&
  isVec3Literal((value as { translation?: unknown }).translation) &&
  isVec3Literal((value as { rotationDeg?: unknown }).rotationDeg) &&
  typeof (value as { inPlaneRotationDeg?: unknown }).inPlaneRotationDeg === 'number' &&
  Number.isFinite((value as { inPlaneRotationDeg: number }).inPlaneRotationDeg)

const isProfileInputLike = (
  value: unknown,
): value is {
  profileId: string
  profileIndex?: number
  area: number
  loop?: ProfileLoop
  verticesProxy: Array<{ x: number; y: number }>
} =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as { profileId?: unknown }).profileId === 'string' &&
  (((value as { profileIndex?: unknown }).profileIndex === undefined) ||
    typeof (value as { profileIndex?: unknown }).profileIndex === 'number') &&
  typeof (value as { area?: unknown }).area === 'number' &&
  (((value as { loop?: unknown }).loop === undefined) ||
    isGeometryRequestProfileLoop((value as { loop?: unknown }).loop)) &&
  Array.isArray((value as { verticesProxy?: unknown }).verticesProxy)

const readGeometrySketchPlaneFromNode = (
  node: SpaghettiGraph['nodes'][number] | undefined,
): 'XY' | 'XZ' | 'YZ' => {
  const rawPlane =
    typeof node?.params === 'object' &&
    node.params !== null &&
    typeof (node.params as { sketch?: unknown }).sketch === 'object' &&
    (node.params as { sketch?: unknown }).sketch !== null
      ? ((node.params as { sketch: { plane?: unknown } }).sketch.plane)
      : undefined
  return isSketchPlane(rawPlane) ? rawPlane : 'XY'
}

const readGeometrySketchPlaneTransformFromNode = (
  node: SpaghettiGraph['nodes'][number] | undefined,
): SketchPlaneTransform => {
  const rawTransform =
    typeof node?.params === 'object' &&
    node.params !== null &&
    typeof (node.params as { sketch?: unknown }).sketch === 'object' &&
    (node.params as { sketch?: unknown }).sketch !== null
      ? ((node.params as { sketch: { planeTransform?: unknown } }).sketch.planeTransform)
      : undefined
  return isSketchPlaneTransform(rawTransform)
    ? rawTransform
    : createDefaultSketchPlaneTransform()
}

const listWholeIncomingEdges = (
  graph: SpaghettiGraph,
  nodeId: string,
  portId: string,
): SpaghettiGraph['edges'][number][] =>
  graph.edges.filter(
    (edge) =>
      edge.to.nodeId === nodeId &&
      (portId === 'ExtrusionProfile'
        ? isWholeExtrusionProfileTargetEndpoint(edge.to)
        : edge.to.portId === portId &&
          (edge.to.path === undefined || edge.to.path.length === 0)),
  )

const getValueAtPath = (value: unknown, path: string[] | undefined): unknown => {
  if (path === undefined || path.length === 0) {
    return value
  }
  let current: unknown = value
  for (const segment of path) {
    if (segment === '*') {
      if (!Array.isArray(current) || current.length === 0) {
        return undefined
      }
      current = current[0]
      continue
    }
    if (typeof current !== 'object' || current === null || Array.isArray(current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

type GeometryExtrudeContributorResolution = {
  edgeId: string
  sketchNode: SpaghettiGraph['nodes'][number]
  plane: 'XY' | 'XZ' | 'YZ'
  planeTransform: SketchPlaneTransform
  contributor: GeometryRequestExtrudeProfileContributor
  profilesResolved: Array<{
    profileId: string
    profileIndex: number
    area: number
    loop: ProfileLoop
    verticesProxy: Array<{ x: number; y: number }>
  }>
}

const toGeometryRequestSketchProfile = (
  profile: {
    profileId: string
    profileIndex?: number
    area: number
    loop?: ProfileLoop
    verticesProxy: Array<{ x: number; y: number }>
  },
) => ({
  profileId: profile.profileId,
  profileIndex: profile.profileIndex ?? 0,
  area: profile.area,
  loop:
    profile.loop ?? {
      segments: [],
      winding: 'CCW' as const,
    },
  verticesProxy: profile.verticesProxy,
})

const resolveGeometryExtrudeContributors = (
  graph: SpaghettiGraph,
  node: SpaghettiGraph['nodes'][number],
  resolvedProfileInput: unknown,
  resolvedOutputsByNodeId: Record<string, Record<string, unknown>> | undefined,
): GeometryExtrudeContributorResolution[] => {
  const incomingEdges = listWholeIncomingEdges(graph, node.nodeId, 'ExtrusionProfile')
  const resolvedInputEntries =
    incomingEdges.length > 1 && Array.isArray(resolvedProfileInput) ? resolvedProfileInput : null
  const resolutions: GeometryExtrudeContributorResolution[] = []

  for (const [index, edge] of incomingEdges.entries()) {
    const sketchNode = graph.nodes.find(
      (candidate) => candidate.nodeId === edge.from.nodeId && candidate.type === 'Geometry/Sketch',
    )
    if (sketchNode === undefined) {
      continue
    }

    const sourceValue =
      getValueAtPath(
        resolvedOutputsByNodeId?.[edge.from.nodeId]?.[edge.from.portId],
        getExtrudeProfileSourcePath(edge),
      ) ??
      (incomingEdges.length === 1 ? resolvedProfileInput : resolvedInputEntries?.[index])
    const normalizedSourceValue =
      edge.from.portId === 'SketchProfile' &&
      Array.isArray(sourceValue) &&
      sourceValue.length === 1 &&
      isProfileInputLike(sourceValue[0])
        ? sourceValue[0]
        : sourceValue
    const plane = readGeometrySketchPlaneFromNode(sketchNode)
    const planeTransform = readGeometrySketchPlaneTransformFromNode(sketchNode)

    if (
      edge.from.portId === 'SketchProfiles' &&
      Array.isArray(normalizedSourceValue) &&
      normalizedSourceValue.every(isProfileInputLike)
    ) {
      resolutions.push({
        edgeId: edge.edgeId,
        sketchNode,
        plane,
        planeTransform,
        contributor: {
          kind: 'allFromSketch',
          sketchFeatureId: sketchNode.nodeId,
        },
        profilesResolved: normalizedSourceValue.map((profile) =>
          toGeometryRequestSketchProfile(profile),
        ),
      })
      continue
    }

    if (isProfileInputLike(normalizedSourceValue)) {
      resolutions.push({
        edgeId: edge.edgeId,
        sketchNode,
        plane,
        planeTransform,
        contributor: {
          kind: 'single',
          sketchFeatureId: sketchNode.nodeId,
          profileId: normalizedSourceValue.profileId,
          profileIndex: normalizedSourceValue.profileIndex ?? 0,
        },
        profilesResolved: [toGeometryRequestSketchProfile(normalizedSourceValue)],
      })
    }
  }

  return resolutions
}

const buildGeometryExtrudeOps = (
  graph: SpaghettiGraph,
  node: SpaghettiGraph['nodes'][number],
  resolvedInputsByNodeId: Record<string, Record<string, unknown>> | undefined,
  resolvedOutputsByNodeId: Record<string, Record<string, unknown>> | undefined,
): FeatureStackIR => {
  const resolvedInputs = resolvedInputsByNodeId?.[node.nodeId] ?? {}
  const profileInput = resolvedInputs.ExtrusionProfile
  const depthInput = resolvedInputs.Depth
  const directionInput = resolvedInputs.Direction
  const contributorResolutions = resolveGeometryExtrudeContributors(
    graph,
    node,
    profileInput,
    resolvedOutputsByNodeId,
  )
  const firstSketchResolution = contributorResolutions[0]
  const uniqueSketchIds = new Set(
    contributorResolutions.map((resolution) => resolution.sketchNode.nodeId),
  )
  const plane = uniqueSketchIds.size === 1 ? firstSketchResolution?.plane : undefined
  const planeTransform =
    uniqueSketchIds.size === 1 ? firstSketchResolution?.planeTransform : undefined
  const extrudeDirection =
    typeof directionInput === 'number' && Number.isFinite(directionInput)
      ? mapWholeNumberToGeometryExtrudeDirection(directionInput)
      : readGeometryExtrudeDirectionFromParams(node.params)
  const depthParam =
    typeof node.params.depthMm === 'number' && Number.isFinite(node.params.depthMm)
      ? node.params.depthMm
      : 20
  const depthResolved =
    typeof depthInput === 'number' && Number.isFinite(depthInput) ? depthInput : depthParam
  const startDepthInput = resolvedInputs.StartDepth
  const startDepthParam =
    typeof node.params.startDepthMm === 'number' && Number.isFinite(node.params.startDepthMm)
      ? node.params.startDepthMm
      : depthParam
  const startDepthResolved =
    typeof startDepthInput === 'number' && Number.isFinite(startDepthInput)
      ? startDepthInput
      : startDepthParam
  const endDepthInput = resolvedInputs.EndDepth
  const endDepthParam =
    typeof node.params.endDepthMm === 'number' && Number.isFinite(node.params.endDepthMm)
      ? node.params.endDepthMm
      : depthParam
  const endDepthResolved =
    typeof endDepthInput === 'number' && Number.isFinite(endDepthInput)
      ? endDepthInput
      : endDepthParam
  const taperInput = resolvedInputs.TaperAngle
  const taperResolved =
    typeof taperInput === 'number' && Number.isFinite(taperInput)
      ? taperInput
      : readGeometryExtrudeTaperAngleDegFromParams(node.params)
  const profileRef =
    contributorResolutions.length === 1 && contributorResolutions[0]?.contributor.kind === 'single'
      ? {
          sketchFeatureId: contributorResolutions[0].contributor.sketchFeatureId,
          profileId: contributorResolutions[0].contributor.profileId,
          profileIndex: contributorResolutions[0].contributor.profileIndex,
        }
      : null
  const profileSelection: GeometryRequestExtrudeProfileSelection | null =
    contributorResolutions.length > 1
      ? {
          mode: 'contributors',
          contributors: contributorResolutions.map((resolution) => resolution.contributor),
        }
      : contributorResolutions.length === 1 &&
          contributorResolutions[0]?.contributor.kind === 'allFromSketch'
        ? {
            mode: 'allFromSketch',
            sketchFeatureId: contributorResolutions[0].contributor.sketchFeatureId,
          }
        : profileRef === null
          ? null
          : {
              mode: 'single',
              sketchFeatureId: profileRef.sketchFeatureId,
              profileId: profileRef.profileId,
              profileIndex: profileRef.profileIndex,
            }

  const sketchProfilesBySketch = new Map<
    string,
    {
      sketchNode: SpaghettiGraph['nodes'][number]
      plane: 'XY' | 'XZ' | 'YZ'
      planeTransform: SketchPlaneTransform
      profilesResolved: Array<{
        profileId: string
        profileIndex: number
        area: number
        loop: ProfileLoop
        verticesProxy: Array<{ x: number; y: number }>
      }>
      seenProfileKeys: Set<string>
    }
  >()

  for (const resolution of contributorResolutions) {
    const existing =
      sketchProfilesBySketch.get(resolution.sketchNode.nodeId) ??
      {
        sketchNode: resolution.sketchNode,
        plane: resolution.plane,
        planeTransform: resolution.planeTransform,
        profilesResolved: [],
        seenProfileKeys: new Set<string>(),
      }
    for (const profile of resolution.profilesResolved) {
      const profileKey = `${profile.profileId}::${profile.profileIndex}`
      if (existing.seenProfileKeys.has(profileKey)) {
        continue
      }
      existing.seenProfileKeys.add(profileKey)
      existing.profilesResolved.push(profile)
    }
    sketchProfilesBySketch.set(resolution.sketchNode.nodeId, existing)
  }

  const ops: FeatureStackIR = []
  for (const sketchEntry of sketchProfilesBySketch.values()) {
    if (sketchEntry.profilesResolved.length === 0) {
      continue
    }
    ops.push({
      op: 'sketch',
      featureId: sketchEntry.sketchNode.nodeId,
      plane: sketchEntry.plane,
      planeTransform: sketchEntry.planeTransform,
        profilesResolved: sketchEntry.profilesResolved,
      })
    }
  const baseExtrudeOp = {
    op: 'extrude' as const,
    featureId: node.nodeId,
    extrudeType: readGeometryExtrudeTypeFromParams(node.params),
    extrudeDirection,
    depthResolved:
      extrudeDirection === 'TwoSides'
        ? startDepthResolved + endDepthResolved
        : depthResolved,
    ...(extrudeDirection === 'TwoSides'
      ? {
          startDepthResolved,
          endDepthResolved,
        }
      : {}),
    taperResolved,
    offsetResolved: 0,
  }
  const bodyGenerationMode = readGeometryExtrudeBodyGenerationModeFromParams(node.params)
  const splitProfileRefs = contributorResolutions.flatMap((resolution) =>
    resolution.profilesResolved.map((profile) => ({
      sketchFeatureId: resolution.contributor.sketchFeatureId,
      profileId: profile.profileId,
      profileIndex: profile.profileIndex,
      plane: resolution.plane,
      planeTransform: resolution.planeTransform,
    })),
  )

  if (bodyGenerationMode === 'NewObjects' && splitProfileRefs.length > 0) {
    splitProfileRefs.forEach((profile, memberIndex) => {
      ops.push({
        ...baseExtrudeOp,
        profileSelection: {
          mode: 'single',
          sketchFeatureId: profile.sketchFeatureId,
          profileId: profile.profileId,
          profileIndex: profile.profileIndex,
        },
        profileRef: {
          sketchFeatureId: profile.sketchFeatureId,
          profileId: profile.profileId,
          profileIndex: profile.profileIndex,
        },
        plane: profile.plane,
        planeTransform: profile.planeTransform,
        bodyId: buildExtrudeBodyId(node.nodeId, memberIndex),
      })
    })
    return ops
  }

  ops.push({
    ...baseExtrudeOp,
    profileSelection,
    profileRef,
    ...(plane === undefined ? {} : { plane }),
    ...(planeTransform === undefined ? {} : { planeTransform }),
    bodyId: buildExtrudeBodyId(node.nodeId),
  })
  return ops
}

const resolveInputValue = (
  graph: SpaghettiGraph,
  outputsByNodeId: Record<string, Record<string, unknown>>,
  nodeId: string,
  inputPortId: string,
): unknown => {
  const matchingEdges = [...graph.edges]
    .sort((a, b) => a.edgeId.localeCompare(b.edgeId))
    .filter(
      (edge) =>
        edge.to.nodeId === nodeId &&
        edge.to.portId === inputPortId &&
        (edge.to.path === undefined || edge.to.path.length === 0),
    )
  if (matchingEdges.length !== 1) {
    return undefined
  }
  const sourceEdge = matchingEdges[0]
  const sourceValue = outputsByNodeId[sourceEdge.from.nodeId]?.[sourceEdge.from.portId]
  if (sourceEdge.from.path === undefined || sourceEdge.from.path.length === 0) {
    return sourceValue
  }

  let current: unknown = sourceValue
  for (const segment of sourceEdge.from.path) {
    if (segment === '*') {
      if (!Array.isArray(current) || current.length === 0) {
        return undefined
      }
      current = current[0]
      continue
    }
    if (typeof current !== 'object' || current === null || Array.isArray(current)) {
      return undefined
    }
    current = (current as Record<string, unknown>)[segment]
  }
  return current
}

const resolveToeHookAnchorInputValue = (
  graph: SpaghettiGraph,
  outputsByNodeId: Record<string, Record<string, unknown>>,
  nodeId: string,
): unknown => {
  const mapping = getToeHookAnchorPortMapping()
  const canonicalValue = resolveInputValue(graph, outputsByNodeId, nodeId, mapping.uiPortId)
  if (canonicalValue !== undefined) {
    return canonicalValue
  }
  // Backward compatibility for graphs that still store the legacy input port id.
  return resolveInputValue(graph, outputsByNodeId, nodeId, mapping.payloadKey)
}

const resolveHeelKickAnchorInputValue = (
  graph: SpaghettiGraph,
  outputsByNodeId: Record<string, Record<string, unknown>>,
  nodeId: string,
): unknown => {
  const mapping = getHeelKickAnchorPortMapping()
  const canonicalValue = resolveInputValue(graph, outputsByNodeId, nodeId, mapping.uiPortId)
  if (canonicalValue !== undefined) {
    return canonicalValue
  }
  // Backward compatibility for graphs that still store the legacy input port id.
  return resolveInputValue(graph, outputsByNodeId, nodeId, mapping.payloadKey)
}

const canonicalizeLegacyInputPortIds = (graph: SpaghettiGraph): SpaghettiGraph => {
  const nodeById = new Map(graph.nodes.map((node) => [node.nodeId, node]))
  let changed = false
  const canonicalEdges = graph.edges.map((edge) => {
    const targetNode = nodeById.get(edge.to.nodeId)
    if (targetNode === undefined) {
      return edge
    }
    const aliases = getNodeDef(targetNode.type)?.legacyInputPortAliases
    if (aliases === undefined) {
      return edge
    }
    const canonicalPortId = aliases[edge.to.portId]
    if (canonicalPortId === undefined || canonicalPortId === edge.to.portId) {
      return edge
    }
    changed = true
    return {
      ...edge,
      to: {
        ...edge.to,
        portId: canonicalPortId,
      },
    }
  })
  if (!changed) {
    return graph
  }
  return {
    ...graph,
    edges: canonicalEdges,
  }
}

export const computeFeatureStackIrParts = (
  graph: SpaghettiGraph,
  options?: {
    resolvedInputsByNodeId?: Record<string, Record<string, unknown>>
    resolvedOutputsByNodeId?: Record<string, Record<string, unknown>>
  },
): FeatureStackIrPartsComputation => {
  const sortedNodes = [...graph.nodes].sort(
    (a, b) => a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type),
  )
  const warnings: SpaghettiDiagnostic[] = []
  const orderedPartKeys: string[] = []
  const nodeIdToPartKey: Record<string, OwnedPartKey> = {}
  const partNodesByPartKey: Record<OwnedPartKey, SpaghettiGraph['nodes'][number]> = {}
  const parts: FeatureStackIrParts = {}
  let hasNonEmptyFeatureStack = false

  for (const spec of PART_NODE_SPECS) {
    const matches = sortedNodes.filter((node) => node.type === spec.nodeType)
    for (const [index, node] of matches.entries()) {
      const partKey = buildOwnedPartKey(spec.basePartId, index, matches.length)
      orderedPartKeys.push(partKey)
      partNodesByPartKey[partKey] = node
      nodeIdToPartKey[node.nodeId] = partKey

      const featureStack = readFeatureStack(node.params.featureStack)
      const withOverrides = applyFeatureVirtualInputOverrides(
        featureStack,
        options?.resolvedInputsByNodeId?.[node.nodeId],
      )
      const compiled = compileFeatureStack(withOverrides)
      parts[partKey] = compiled
      if (getEffectiveFeatureStack(withOverrides).length > 0 && compiled.length > 0) {
        hasNonEmptyFeatureStack = true
      }
    }
  }

  const geometryExtrudes = sortedNodes.filter((node) => node.type === 'Geometry/Extrude')
  for (const [index, node] of geometryExtrudes.entries()) {
    const partKey = buildOwnedPartKey('extrude', index, geometryExtrudes.length)
    orderedPartKeys.push(partKey)
    partNodesByPartKey[partKey] = node
    nodeIdToPartKey[node.nodeId] = partKey
    parts[partKey] = buildGeometryExtrudeOps(
      graph,
      node,
      options?.resolvedInputsByNodeId,
      options?.resolvedOutputsByNodeId,
    )
    hasNonEmptyFeatureStack = true
  }

  return {
    parts,
    orderedPartKeys,
    nodeIdToPartKey,
    partNodesByPartKey,
    hasNonEmptyFeatureStack,
    warnings,
  }
}

export const compileSpaghettiGraph = (
  graph: SpaghettiGraph,
): CompileSpaghettiGraphResult => {
  const canonicalGraph = canonicalizeLegacyInputPortIds(graph)
  const evaluationResult = evaluateSpaghettiGraph(canonicalGraph)
  const evaluation = {
    topoOrder: evaluationResult.topoOrder,
  }
  if (!evaluationResult.ok) {
    return {
      ok: false,
      diagnostics: {
        errors: evaluationResult.diagnostics.errors,
        warnings: evaluationResult.diagnostics.warnings,
      },
      evaluation,
    }
  }

  const featureStackComputation = computeFeatureStackIrParts(canonicalGraph, {
    resolvedInputsByNodeId: evaluationResult.inputsByNodeId,
    resolvedOutputsByNodeId: evaluationResult.outputsByNodeId,
  })
  const resolvedParts: Record<string, Record<string, unknown>> = {}
  for (const partKey of featureStackComputation.orderedPartKeys) {
    const partNode = featureStackComputation.partNodesByPartKey[partKey]
    if (partNode === undefined) {
      continue
    }
    if (partKey === 'baseplate' || partKey.startsWith('baseplate#')) {
      const baseplateOutputs = evaluationResult.outputsByNodeId[partNode.nodeId] ?? {}
      resolvedParts[partKey] = {
        anchorSpline2: baseplateOutputs.anchorSpline2,
        offsetSpline2: baseplateOutputs.offsetSpline2,
      }
      continue
    }
    if (partKey === 'toeHook#1' || partKey.startsWith('toeHook#')) {
      const anchorPortMapping = getToeHookAnchorPortMapping()
      resolvedParts[partKey] = {
        [anchorPortMapping.payloadKey]: resolveToeHookAnchorInputValue(
          canonicalGraph,
          evaluationResult.outputsByNodeId,
          partNode.nodeId,
        ),
      }
      continue
    }
    if (partKey === 'heelKick#1' || partKey.startsWith('heelKick#')) {
      const anchorPortMapping = getHeelKickAnchorPortMapping()
      resolvedParts[partKey] = {
        [anchorPortMapping.payloadKey]: resolveHeelKickAnchorInputValue(
          canonicalGraph,
          evaluationResult.outputsByNodeId,
          partNode.nodeId,
        ),
      }
    }
  }

  const featureStackIrParts: GeometryRequestPayload['parts'] = toGeometryRequestParts(
    featureStackComputation.parts,
  )
  const hasNonEmptyFeatureStack = featureStackComputation.hasNonEmptyFeatureStack
  const featureStackIR: GeometryRequestPayload | undefined = hasNonEmptyFeatureStack
    ? {
        schemaVersion: 1,
        parts: featureStackIrParts,
      }
    : undefined

  const warnings = sortDiagnostics([
    ...evaluationResult.diagnostics.warnings,
    ...featureStackComputation.warnings,
  ])

  return {
    ok: true,
    diagnostics: {
      errors: evaluationResult.diagnostics.errors,
      warnings,
    },
    evaluation,
    buildInputs: {
      orderedPartKeys: [...featureStackComputation.orderedPartKeys],
      resolvedParts,
      resolvedShared:
        featureStackIR === undefined
          ? undefined
          : {
              sp_featureStackIR: featureStackIR,
            },
    },
  }
}
