import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { compileFeatureStack, type FeatureStackIR } from '../features/compileFeatureStack'
import { getEffectiveFeatureStack } from '../features/featureDependencies'
import { readFeatureStack } from '../features/featureSchema'
import {
  createDefaultSketchPlaneTransform,
  type ProfileLoop,
  type SketchPlaneTransform,
} from '../features/featureTypes'
import { applyFeatureVirtualInputOverrides } from '../features/featureVirtualPorts'
import { getNodeDef, readGeometryExtrudeTypeFromParams } from '../registry/nodeRegistry'
import type { SpaghettiDiagnostic } from './validateGraph'
import { evaluateSpaghettiGraph } from './evaluateGraph'
import { tessellateProfileLoop } from './runtimeTessellation'

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

type FeatureStackIRPayload = {
  schemaVersion: 1
  parts: RuntimeFeatureStackParts
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

const ALWAYS_NUMBERED_PART_IDS = new Set<BasePartId>(['toeHook', 'heelKick'])

export type FeatureStackIrParts = Record<OwnedPartKey, FeatureStackIR>
type RuntimeFeatureStackParts = Record<OwnedPartKey, RuntimeFeatureOp[]>

type RuntimeFeatureOp =
  | {
      op: 'sketch'
      featureId: string
      plane?: 'XY' | 'XZ' | 'YZ'
      planeTransform?: SketchPlaneTransform
      profilesResolved: Array<{
        profileId: string
        area: number
        vertices: Array<{ x: number; y: number }>
      }>
    }
  | {
      op: 'extrude'
      featureId: string
      profileRef: { sketchFeatureId: string; profileId: string } | null
      extrudeType: 'Body' | 'Walls'
      depthResolved: number
      taperResolved: number
      offsetResolved: number
      plane?: 'XY' | 'XZ' | 'YZ'
      planeTransform?: SketchPlaneTransform
      bodyId?: string
    }

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

const toRuntimeFeatureStackParts = (parts: FeatureStackIrParts): RuntimeFeatureStackParts => {
  const out: RuntimeFeatureStackParts = {}
  for (const [partKey, operations] of Object.entries(parts)) {
    const runtimeOps: RuntimeFeatureOp[] = []
    for (const operation of operations) {
      if (operation.op === 'sketch') {
        runtimeOps.push({
          op: 'sketch',
          featureId: operation.featureId,
          ...('plane' in operation && operation.plane !== undefined
            ? { plane: operation.plane }
            : {}),
          ...('planeTransform' in operation && operation.planeTransform !== undefined
            ? { planeTransform: operation.planeTransform }
            : {}),
          profilesResolved: operation.profilesResolved.map((profile) => ({
            profileId: profile.profileId,
            area: profile.area,
            vertices:
              profile.loop.segments.length > 0
                ? tessellateProfileLoop(profile.loop.segments)
                : profile.verticesProxy,
          })),
        })
        continue
      }
      if (operation.op === 'closeProfile') {
        continue
      }
      runtimeOps.push({
        op: 'extrude',
        featureId: operation.featureId,
        profileRef:
          operation.profileRef === null
            ? null
            : {
                sketchFeatureId: operation.profileRef.sketchFeatureId,
                profileId: operation.profileRef.profileId,
              },
        extrudeType: operation.extrudeType,
        depthResolved: operation.depthResolved,
        taperResolved: operation.taperResolved,
        offsetResolved: operation.offsetResolved,
        ...('plane' in operation && operation.plane !== undefined
          ? { plane: operation.plane }
          : {}),
        ...('planeTransform' in operation && operation.planeTransform !== undefined
          ? { planeTransform: operation.planeTransform }
          : {}),
        bodyId: operation.bodyId,
      })
    }
    out[partKey] = runtimeOps
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

const isProfileLoopLike = (value: unknown): value is ProfileLoop =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray((value as { segments?: unknown }).segments) &&
  (((value as { winding?: unknown }).winding === 'CCW') ||
    (value as { winding?: unknown }).winding === 'CW')

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
    isProfileLoopLike((value as { loop?: unknown }).loop)) &&
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

const findWholeIncomingEdge = (
  graph: SpaghettiGraph,
  nodeId: string,
  portId: string,
): SpaghettiGraph['edges'][number] | undefined =>
  [...graph.edges]
    .sort((a, b) => a.edgeId.localeCompare(b.edgeId))
    .find(
      (edge) =>
        edge.to.nodeId === nodeId &&
        edge.to.portId === portId &&
        (edge.to.path === undefined || edge.to.path.length === 0),
    )

const buildGeometryExtrudeOps = (
  graph: SpaghettiGraph,
  node: SpaghettiGraph['nodes'][number],
  resolvedInputsByNodeId: Record<string, Record<string, unknown>> | undefined,
): FeatureStackIR => {
  const resolvedInputs = resolvedInputsByNodeId?.[node.nodeId] ?? {}
  const profileInput = resolvedInputs.ExtrusionProfile
  const depthInput = resolvedInputs.Depth
  const sourceProfileEdge = findWholeIncomingEdge(graph, node.nodeId, 'ExtrusionProfile')
  const sourceSketchNode = graph.nodes.find(
    (candidate) =>
      candidate.nodeId === sourceProfileEdge?.from.nodeId && candidate.type === 'Geometry/Sketch',
  )
  const plane = readGeometrySketchPlaneFromNode(sourceSketchNode)
  const planeTransform = readGeometrySketchPlaneTransformFromNode(sourceSketchNode)
  const depthParam =
    typeof node.params.depthMm === 'number' && Number.isFinite(node.params.depthMm)
      ? node.params.depthMm
      : 20
  const depthResolved =
    typeof depthInput === 'number' && Number.isFinite(depthInput) ? depthInput : depthParam
  const profileRef =
    sourceSketchNode !== undefined && isProfileInputLike(profileInput)
      ? {
          sketchFeatureId: sourceSketchNode.nodeId,
          profileId: profileInput.profileId,
          profileIndex: profileInput.profileIndex ?? 0,
        }
      : null

  const ops: FeatureStackIR = []
  if (sourceSketchNode !== undefined && isProfileInputLike(profileInput)) {
    ops.push({
      op: 'sketch',
      featureId: sourceSketchNode.nodeId,
      plane,
      planeTransform,
      profilesResolved: [
        {
          profileId: profileInput.profileId,
          profileIndex: profileInput.profileIndex ?? 0,
          area: profileInput.area,
          loop:
            profileInput.loop ?? {
              segments: [],
              winding: 'CCW',
            },
          verticesProxy: profileInput.verticesProxy,
        },
      ],
    })
  }
  ops.push({
    op: 'extrude',
    featureId: node.nodeId,
    profileRef,
    extrudeType: readGeometryExtrudeTypeFromParams(node.params),
    depthResolved,
    taperResolved: 0,
    offsetResolved: 0,
    plane,
    planeTransform,
    bodyId: `${node.nodeId}:body`,
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
    parts[partKey] = buildGeometryExtrudeOps(graph, node, options?.resolvedInputsByNodeId)
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

  const featureStackIrParts: FeatureStackIRPayload['parts'] = toRuntimeFeatureStackParts(
    featureStackComputation.parts,
  )
  const hasNonEmptyFeatureStack = featureStackComputation.hasNonEmptyFeatureStack
  const featureStackIR: FeatureStackIRPayload | undefined = hasNonEmptyFeatureStack
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
