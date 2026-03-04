import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { compileFeatureStack, type FeatureStackIR } from '../features/compileFeatureStack'
import { readFeatureStack } from '../features/featureSchema'
import { getNodeDef } from '../registry/nodeRegistry'
import type { SpaghettiDiagnostic } from './validateGraph'
import { evaluateSpaghettiGraph } from './evaluateGraph'

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
    resolvedParts: Record<string, Record<string, unknown>>
    resolvedShared?: Record<string, unknown>
  }
}

type FeatureStackIRPayload = {
  schemaVersion: 1
  parts: FeatureStackIrParts
}

type PartKey = 'baseplate' | 'toeHook#1' | 'heelKick#1'

type PartNodeSpec = {
  nodeType: 'Part/Baseplate' | 'Part/ToeHook' | 'Part/HeelKick'
  partKey: PartKey
}

const PART_NODE_SPECS: readonly PartNodeSpec[] = [
  { nodeType: 'Part/Baseplate', partKey: 'baseplate' },
  { nodeType: 'Part/ToeHook', partKey: 'toeHook#1' },
  { nodeType: 'Part/HeelKick', partKey: 'heelKick#1' },
]

export type FeatureStackIrParts = Partial<Record<PartKey, FeatureStackIR>>

export type FeatureStackIrPartsComputation = {
  parts: FeatureStackIrParts
  nodeIdToPartKey: Record<string, PartKey>
  partNodes: Partial<Record<PartKey, SpaghettiGraph['nodes'][number]>>
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
): FeatureStackIrPartsComputation => {
  const sortedNodes = [...graph.nodes].sort(
    (a, b) => a.nodeId.localeCompare(b.nodeId) || a.type.localeCompare(b.type),
  )
  const warnings: SpaghettiDiagnostic[] = []
  const nodeIdToPartKey: Record<string, PartKey> = {}
  const partNodes: Partial<Record<PartKey, SpaghettiGraph['nodes'][number]>> = {}
  const parts: FeatureStackIrParts = {}
  let hasNonEmptyFeatureStack = false

  for (const spec of PART_NODE_SPECS) {
    const matches = sortedNodes.filter((node) => node.type === spec.nodeType)
    const selectedNode = matches[0]
    for (const duplicate of matches.slice(1)) {
      warnings.push({
        level: 'warn',
        code: 'DUPLICATE_PART_NODE',
        message: `Ignoring duplicate part node of type "${spec.nodeType}" with nodeId "${duplicate.nodeId}".`,
        nodeId: duplicate.nodeId,
      })
    }
    if (selectedNode === undefined) {
      continue
    }

    partNodes[spec.partKey] = selectedNode
    nodeIdToPartKey[selectedNode.nodeId] = spec.partKey

    const featureStack = readFeatureStack(selectedNode.params.featureStack)
    parts[spec.partKey] = compileFeatureStack(featureStack)
    if (featureStack.length > 0) {
      hasNonEmptyFeatureStack = true
    }
  }

  return {
    parts,
    nodeIdToPartKey,
    partNodes,
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

  const featureStackComputation = computeFeatureStackIrParts(canonicalGraph)
  const baseplateNode = featureStackComputation.partNodes.baseplate
  const toeHookNode = featureStackComputation.partNodes['toeHook#1']
  const heelKickNode = featureStackComputation.partNodes['heelKick#1']

  const resolvedParts: Record<string, Record<string, unknown>> = {}
  if (baseplateNode !== undefined) {
    const baseplateOutputs = evaluationResult.outputsByNodeId[baseplateNode.nodeId] ?? {}
    resolvedParts.baseplate = {
      anchorSpline2: baseplateOutputs.anchorSpline2,
      offsetSpline2: baseplateOutputs.offsetSpline2,
    }
  }
  if (toeHookNode !== undefined) {
    const anchorPortMapping = getToeHookAnchorPortMapping()
    resolvedParts['toeHook#1'] = {
      [anchorPortMapping.payloadKey]: resolveToeHookAnchorInputValue(
        canonicalGraph,
        evaluationResult.outputsByNodeId,
        toeHookNode.nodeId,
      ),
    }
  }
  if (heelKickNode !== undefined) {
    const anchorPortMapping = getHeelKickAnchorPortMapping()
    resolvedParts['heelKick#1'] = {
      [anchorPortMapping.payloadKey]: resolveHeelKickAnchorInputValue(
        canonicalGraph,
        evaluationResult.outputsByNodeId,
        heelKickNode.nodeId,
      ),
    }
  }

  const featureStackIrParts: FeatureStackIRPayload['parts'] = featureStackComputation.parts
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
        heelKickInstances: [1],
        toeHookInstances: [1],
      },
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
