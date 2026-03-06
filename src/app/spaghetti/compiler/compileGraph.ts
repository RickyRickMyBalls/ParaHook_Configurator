import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { compileFeatureStack, type FeatureStackIR } from '../features/compileFeatureStack'
import { getEffectiveFeatureStack } from '../features/featureDependencies'
import { readFeatureStack } from '../features/featureSchema'
import { applyFeatureVirtualInputOverrides } from '../features/featureVirtualPorts'
import { getNodeDef } from '../registry/nodeRegistry'
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
    instances: {
      heelKickInstances: number[]
      toeHookInstances: number[]
    }
    orderedPartKeys: string[]
    resolvedParts: Record<string, Record<string, unknown>>
    resolvedShared?: Record<string, unknown>
  }
}

type FeatureStackIRPayload = {
  schemaVersion: 1
  parts: RuntimeFeatureStackParts
}

type BasePartId = 'baseplate' | 'cube' | 'cubeProof' | 'toeHook' | 'heelKick'
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
      depthResolved: number
      taperResolved: number
      offsetResolved: number
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
          profilesResolved: operation.profilesResolved.map((profile) => ({
            profileId: profile.profileId,
            area: profile.area,
            vertices: tessellateProfileLoop(profile.loop.segments),
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
        depthResolved: operation.depthResolved,
        taperResolved: operation.taperResolved,
        offsetResolved: operation.offsetResolved,
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
      instances: {
        heelKickInstances: featureStackComputation.orderedPartKeys
          .filter((partKey) => partKey.startsWith('heelKick#'))
          .map((partKey) => Number(partKey.slice('heelKick#'.length)))
          .filter((value) => Number.isInteger(value) && Number.isFinite(value)),
        toeHookInstances: featureStackComputation.orderedPartKeys
          .filter((partKey) => partKey.startsWith('toeHook#'))
          .map((partKey) => Number(partKey.slice('toeHook#'.length)))
          .filter((value) => Number.isInteger(value) && Number.isFinite(value)),
      },
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
