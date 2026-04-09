import type { PartArtifact } from '../../shared/buildTypes'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import { computeFeatureStackIrParts } from './compiler/compileGraph'
import { evaluateSpaghettiGraph } from './compiler/evaluateGraph'
import type { SpaghettiGraph, SpaghettiNode } from './schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from './system/outputPreviewNode'
import { selectDiagnosticsVm } from './selectors/selectDiagnosticsVm'

export type PreviewPreparationEntry = {
  slotId: string
  sourceNodeId: string
  sourcePartKeyStr: string
  sourcePortId: string
}

export type GraphPreviewPreparation = {
  outputPreviewNodeId: string | null
  outputSlotIds: string[]
  previewCandidateSlotIds: string[]
  previewCandidatePartKeys: string[]
  sourceNodeIdBySlotId: Record<string, string>
  sourcePartKeyBySlotId: Record<string, string>
  sourcePortIdBySlotId: Record<string, string>
  sourcePartKeyByNodeId: Record<string, string>
  slotStatusBySlotId: Record<string, 'ok' | 'unresolved' | 'empty'>
  buildStatsReadyPartKeys: string[]
  previewIntent: 'none' | 'outputPreview'
}

const isOutputPreviewNode = (node: SpaghettiNode): boolean =>
  node.type === OUTPUT_PREVIEW_NODE_TYPE

const readSlotIds = (node: SpaghettiNode): string[] => {
  const rawSlots = (node.params as { slots?: unknown }).slots
  if (!Array.isArray(rawSlots)) {
    return []
  }
  return rawSlots.flatMap((slot) => {
    if (
      typeof slot !== 'object' ||
      slot === null ||
      typeof (slot as { slotId?: unknown }).slotId !== 'string'
    ) {
      return []
    }
    const slotId = (slot as { slotId: string }).slotId
    return slotId.length > 0 ? [slotId] : []
  })
}

const findMatchingIncomingSlotEdge = (
  graph: SpaghettiGraph,
  outputPreviewNodeId: string,
  slotId: string,
): SpaghettiGraph['edges'][number] | undefined => {
  const targetPortId = `in:solid:${slotId}`
  return graph.edges.find(
    (edge) => edge.to.nodeId === outputPreviewNodeId && edge.to.portId === targetPortId,
  )
}

const isGraphNativePreviewSource = (
  graph: SpaghettiGraph,
  nodeId: string,
): boolean => graph.nodes.some((node) => node.nodeId === nodeId && node.type.startsWith('Geometry/'))

const readSourceOutputValue = (
  evaluation: ReturnType<typeof evaluateSpaghettiGraph>,
  edge: SpaghettiGraph['edges'][number],
): { known: boolean; value: unknown } => {
  const sourceOutputs = evaluation.outputsByNodeId[edge.from.nodeId]
  if (sourceOutputs === undefined || !(edge.from.portId in sourceOutputs)) {
    return {
      known: false,
      value: undefined,
    }
  }
  return {
    known: true,
    value: sourceOutputs[edge.from.portId],
  }
}

export const prepareGraphPreviewPreparation = (
  graph: SpaghettiGraph,
): GraphPreviewPreparation => {
  const outputPreviewNode = graph.nodes.find(isOutputPreviewNode)
  if (outputPreviewNode === undefined) {
    return {
      outputPreviewNodeId: null,
      outputSlotIds: [],
      previewCandidateSlotIds: [],
      previewCandidatePartKeys: [],
      sourceNodeIdBySlotId: {},
      sourcePartKeyBySlotId: {},
      sourcePortIdBySlotId: {},
      sourcePartKeyByNodeId: {},
      slotStatusBySlotId: {},
      buildStatsReadyPartKeys: [],
      previewIntent: 'none',
    }
  }

  const outputSlotIds = readSlotIds(outputPreviewNode)
  const evaluation = evaluateSpaghettiGraph(graph)
  const diagnosticsVm = selectDiagnosticsVm({
    graph,
    evaluation,
  })
  const partMapping = computeFeatureStackIrParts(graph).nodeIdToPartKey
  const previewEntries: PreviewPreparationEntry[] = []
  const sourceNodeIdBySlotId: Record<string, string> = {}
  const sourcePartKeyBySlotId: Record<string, string> = {}
  const sourcePortIdBySlotId: Record<string, string> = {}
  const sourcePartKeyByNodeId: Record<string, string> = {}
  const slotStatusBySlotId = { ...diagnosticsVm.slotStatus }

  for (const slotId of outputSlotIds) {
    const matchingEdge = findMatchingIncomingSlotEdge(graph, outputPreviewNode.nodeId, slotId)
    if (matchingEdge === undefined) {
      continue
    }

    const sourceOutput = readSourceOutputValue(evaluation, matchingEdge)
    if (
      isGraphNativePreviewSource(graph, matchingEdge.from.nodeId) &&
      sourceOutput.known &&
      (sourceOutput.value === null || sourceOutput.value === undefined)
    ) {
      slotStatusBySlotId[slotId] = 'unresolved'
    }

    const sourceNodeId = matchingEdge.from.nodeId
    const sourcePartKeyStr = partMapping[sourceNodeId]
    if (sourcePartKeyStr === undefined) {
      continue
    }

    sourceNodeIdBySlotId[slotId] = sourceNodeId
    sourcePartKeyBySlotId[slotId] = sourcePartKeyStr
    sourcePortIdBySlotId[slotId] = matchingEdge.from.portId
    sourcePartKeyByNodeId[sourceNodeId] = sourcePartKeyStr
    previewEntries.push({
      slotId,
      sourceNodeId,
      sourcePartKeyStr,
      sourcePortId: matchingEdge.from.portId,
    })
  }

  return {
    outputPreviewNodeId: outputPreviewNode.nodeId,
    outputSlotIds,
    previewCandidateSlotIds: previewEntries.map((entry) => entry.slotId),
    previewCandidatePartKeys: [...new Set(previewEntries.map((entry) => entry.sourcePartKeyStr))],
    sourceNodeIdBySlotId,
    sourcePartKeyBySlotId,
    sourcePortIdBySlotId,
    sourcePartKeyByNodeId,
    slotStatusBySlotId,
    buildStatsReadyPartKeys: [],
    previewIntent: 'outputPreview',
  }
}

export const buildPreviewPreparationEntries = (
  previewPreparation: GraphPreviewPreparation,
  buildOutputs: readonly PartArtifact[],
): Array<
  PreviewPreparationEntry & {
    renderable: PartArtifact | null
  }
> => {
  const artifactByPartKey = new Map<string, PartArtifact>()
  for (const artifact of buildOutputs) {
    const partKey = artifactToPartKeyStr(artifact)
    if (!artifactByPartKey.has(partKey)) {
      artifactByPartKey.set(partKey, artifact)
    }
  }

  return previewPreparation.previewCandidateSlotIds
    .filter((slotId) => previewPreparation.slotStatusBySlotId[slotId] !== 'unresolved')
    .flatMap((slotId) => {
      const sourceNodeId = previewPreparation.sourceNodeIdBySlotId[slotId]
      const sourcePartKeyStr = previewPreparation.sourcePartKeyBySlotId[slotId]
      const sourcePortId = previewPreparation.sourcePortIdBySlotId[slotId]
      if (
        sourceNodeId === undefined ||
        sourcePartKeyStr === undefined ||
        sourcePortId === undefined
      ) {
        return []
      }
      return [
        {
          slotId,
          sourceNodeId,
          sourcePartKeyStr,
          sourcePortId,
          renderable: artifactByPartKey.get(sourcePartKeyStr) ?? null,
        },
      ]
    })
}
