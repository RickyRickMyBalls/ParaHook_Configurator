import type { PartArtifact } from '../../shared/buildTypes'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import { computeFeatureStackIrParts } from './compiler/compileGraph'
import { evaluateSpaghettiGraph } from './compiler/evaluateGraph'
import type { SpaghettiGraph, SpaghettiNode, SolidBodiesValue } from './schema/spaghettiTypes'
import {
  normalizeOutputPreviewParams,
  OUTPUT_PREVIEW_NODE_TYPE,
} from './system/outputPreviewNode'
import { selectDiagnosticsVm } from './selectors/selectDiagnosticsVm'

export type PreviewPreparationEntry = {
  slotId: string
  sourceNodeId: string
  sourcePartKeyStr: string
  sourcePortId: string
  memberIndex?: number
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
  publicationModeBySlotId?: Record<string, 'grouped' | 'split'>
  splitMemberCountBySlotId?: Record<string, number>
  slotStatusBySlotId: Record<string, 'ok' | 'unresolved' | 'empty'>
  buildStatsReadyPartKeys: string[]
  previewIntent: 'none' | 'outputPreview'
}

const isOutputPreviewNode = (node: SpaghettiNode): boolean =>
  node.type === OUTPUT_PREVIEW_NODE_TYPE

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

const isSolidBodiesValue = (value: unknown): value is SolidBodiesValue =>
  typeof value === 'object' &&
  value !== null &&
  Array.isArray((value as { bodies?: unknown }).bodies)

const readSplitMemberCount = (value: unknown): number => {
  if (!isSolidBodiesValue(value)) {
    return 1
  }
  return value.bodies.length > 0 ? value.bodies.length : 1
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
      publicationModeBySlotId: {},
      splitMemberCountBySlotId: {},
      slotStatusBySlotId: {},
      buildStatsReadyPartKeys: [],
      previewIntent: 'none',
    }
  }

  const normalizedOutputPreviewParams = normalizeOutputPreviewParams(
    (outputPreviewNode.params as Record<string, unknown>) ?? {},
  )
  const outputSlotIds = normalizedOutputPreviewParams.slots.map((slot) => slot.slotId)
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
  const publicationModeBySlotId: Record<string, 'grouped' | 'split'> = Object.fromEntries(
    normalizedOutputPreviewParams.slots.map((slot) => [
      slot.slotId,
      slot.publicationMode ?? 'grouped',
    ]),
  )
  const splitMemberCountBySlotId: Record<string, number> = {}
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
    splitMemberCountBySlotId[slotId] =
      publicationModeBySlotId[slotId] === 'split'
        ? readSplitMemberCount(sourceOutput.value)
        : 1
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
    publicationModeBySlotId,
    splitMemberCountBySlotId,
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
      const publicationMode = previewPreparation.publicationModeBySlotId?.[slotId] ?? 'grouped'
      const splitMemberCount =
        publicationMode === 'split'
          ? Math.max(1, previewPreparation.splitMemberCountBySlotId?.[slotId] ?? 1)
          : 1
      if (
        sourceNodeId === undefined ||
        sourcePartKeyStr === undefined ||
        sourcePortId === undefined
      ) {
        return []
      }
      return Array.from({ length: splitMemberCount }, (_, memberIndex) => ({
        slotId,
        sourceNodeId,
        sourcePartKeyStr,
        sourcePortId,
        ...(publicationMode === 'split' ? { memberIndex } : {}),
        renderable: artifactByPartKey.get(sourcePartKeyStr) ?? null,
      }))
    })
}
