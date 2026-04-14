import type { BuildResultBundle, PartArtifact } from '../../shared/buildTypes'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import { computeFeatureStackIrParts } from './compiler/compileGraph'
import { evaluateSpaghettiGraph } from './compiler/evaluateGraph'
import { parseExtrudeBodyMemberPortId } from './features/extrudeBodyVirtualPorts'
import type { SpaghettiGraph, SpaghettiNode, SolidBodiesValue } from './schema/spaghettiTypes'
import { buildGraphOutputEntryIdsForSlot } from './outputSurface'
import {
  normalizeOutputPreviewParams,
  OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE,
  OUTPUT_PREVIEW_NODE_TYPE,
} from './families/OutputPreview/system/outputPreviewNode'
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
  sourceEntriesBySlotId?: Record<string, PreviewPreparationEntry[]>
  publicationModeBySlotId?: Record<string, 'grouped' | 'split'>
  splitMemberCountBySlotId?: Record<string, number>
  slotStatusBySlotId: Record<string, 'ok' | 'unresolved' | 'empty'>
  buildStatsReadyPartKeys: string[]
  previewIntent: 'none' | 'outputPreview'
}

const isOutputPreviewNode = (node: SpaghettiNode): boolean =>
  node.type === OUTPUT_PREVIEW_NODE_TYPE

const listMatchingIncomingSlotEdges = (
  graph: SpaghettiGraph,
  outputPreviewNodeId: string,
  slotId: string,
): SpaghettiGraph['edges'][number][] => {
  const targetPortId = `in:solid:${slotId}`
  return graph.edges
    .filter((edge) => edge.to.nodeId === outputPreviewNodeId && edge.to.portId === targetPortId)
    .sort((a, b) => a.edgeId.localeCompare(b.edgeId))
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

const readPreviewPreparationPublicationMode = (
  previewPreparation: GraphPreviewPreparation,
  slotId: string,
): 'grouped' | 'split' => {
  const normalizedPublicationMode = previewPreparation.publicationModeBySlotId?.[slotId]
  if (normalizedPublicationMode === 'grouped' || normalizedPublicationMode === 'split') {
    return normalizedPublicationMode
  }
  return (previewPreparation.splitMemberCountBySlotId?.[slotId] ?? 1) > 1 ? 'split' : 'grouped'
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
      sourceEntriesBySlotId: {},
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
  const sourceEntriesBySlotId: Record<string, PreviewPreparationEntry[]> = {}
  const publicationModeBySlotId: Record<string, 'grouped' | 'split'> = Object.fromEntries(
    normalizedOutputPreviewParams.slots.map((slot) => [
      slot.slotId,
      slot.publicationMode ?? OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE,
    ]),
  )
  const splitMemberCountBySlotId: Record<string, number> = {}
  const slotStatusBySlotId = { ...diagnosticsVm.slotStatus }

  for (const slotId of outputSlotIds) {
    const matchingEdges = listMatchingIncomingSlotEdges(graph, outputPreviewNode.nodeId, slotId)
    if (matchingEdges.length === 0) {
      continue
    }

    const slotEntries: PreviewPreparationEntry[] = []

    for (const matchingEdge of matchingEdges) {
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

      sourcePartKeyByNodeId[sourceNodeId] = sourcePartKeyStr
      if (sourceNodeIdBySlotId[slotId] === undefined) {
        sourceNodeIdBySlotId[slotId] = sourceNodeId
        sourcePartKeyBySlotId[slotId] = sourcePartKeyStr
        sourcePortIdBySlotId[slotId] = matchingEdge.from.portId
      }

      const publicationMode = publicationModeBySlotId[slotId]
      const entryCount =
        publicationMode === 'split' && isSolidBodiesValue(sourceOutput.value)
          ? readSplitMemberCount(sourceOutput.value)
          : 1

      for (let memberIndex = 0; memberIndex < entryCount; memberIndex += 1) {
        slotEntries.push({
          slotId,
          sourceNodeId,
          sourcePartKeyStr,
          sourcePortId: matchingEdge.from.portId,
          ...(entryCount > 1 ? { memberIndex } : {}),
        })
      }
    }

    if (slotEntries.length === 0) {
      continue
    }

    sourceEntriesBySlotId[slotId] = slotEntries
    splitMemberCountBySlotId[slotId] =
      publicationModeBySlotId[slotId] === 'split' ? slotEntries.length : 1
    previewEntries.push(...slotEntries)
  }

  return {
    outputPreviewNodeId: outputPreviewNode.nodeId,
    outputSlotIds,
    previewCandidateSlotIds: [...new Set(previewEntries.map((entry) => entry.slotId))],
    previewCandidatePartKeys: [...new Set(previewEntries.map((entry) => entry.sourcePartKeyStr))],
    sourceNodeIdBySlotId,
    sourcePartKeyBySlotId,
    sourcePortIdBySlotId,
    sourcePartKeyByNodeId,
    sourceEntriesBySlotId,
    publicationModeBySlotId,
    splitMemberCountBySlotId,
    slotStatusBySlotId,
    buildStatsReadyPartKeys: [],
    previewIntent: 'outputPreview',
  }
}

export const getPreviewPreparationEntriesForSlot = (
  previewPreparation: GraphPreviewPreparation,
  slotId: string,
): PreviewPreparationEntry[] => {
  const explicitEntries = previewPreparation.sourceEntriesBySlotId?.[slotId]
  if (explicitEntries !== undefined) {
    return explicitEntries
  }

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

  const publicationMode = readPreviewPreparationPublicationMode(previewPreparation, slotId)
  const splitMemberCount =
    publicationMode === 'split'
      ? Math.max(1, previewPreparation.splitMemberCountBySlotId?.[slotId] ?? 1)
      : 1

  return Array.from({ length: splitMemberCount }, (_, memberIndex) => ({
    slotId,
    sourceNodeId,
    sourcePartKeyStr,
    sourcePortId,
    ...(publicationMode === 'split' ? { memberIndex } : {}),
  }))
}

export const hasExplicitSolidBodyMemberPublication = (
  previewPreparation: GraphPreviewPreparation | null,
): boolean => {
  if (previewPreparation === null) {
    return false
  }
  return previewPreparation.outputSlotIds.some((slotId) =>
    getPreviewPreparationEntriesForSlot(previewPreparation, slotId).some(
      (entry) => parseExtrudeBodyMemberPortId(entry.sourcePortId) !== null,
    ),
  )
}

export const buildPreviewPreparationEntries = (
  previewPreparation: GraphPreviewPreparation,
  buildOutputs: readonly PartArtifact[],
  buildBundle?: BuildResultBundle | null,
  options?: {
    renderableEntryMode?: 'allAccepted' | 'rebuiltOnly'
  },
): Array<
  PreviewPreparationEntry & {
    outputEntryId: string
    renderable: PartArtifact | null
  }
> => {
  const renderableEntryMode = options?.renderableEntryMode ?? 'allAccepted'
  const artifactByPartKey = new Map<string, PartArtifact>()
  for (const artifact of buildOutputs) {
    const partKey = artifactToPartKeyStr(artifact)
    if (!artifactByPartKey.has(partKey)) {
      artifactByPartKey.set(partKey, artifact)
    }
  }
  const bundleEntryByOutputEntryId = new Map<string, BuildResultBundle['entries'][number]>()
  const artifactByOutputEntryId = new Map<string, PartArtifact>()
  for (const entry of buildBundle?.entries ?? []) {
    bundleEntryByOutputEntryId.set(entry.outputEntryId, entry)
    if (entry.status === 'evicted') {
      continue
    }
    if (renderableEntryMode === 'rebuiltOnly' && entry.status !== 'rebuilt') {
      continue
    }
    const artifact = entry.artifacts[0] ?? null
    if (artifact !== null && !artifactByOutputEntryId.has(entry.outputEntryId)) {
      artifactByOutputEntryId.set(entry.outputEntryId, artifact)
    }
  }

  const shouldAllowCoarseParentFallback = (entry: PreviewPreparationEntry): boolean =>
    parseExtrudeBodyMemberPortId(entry.sourcePortId) === null

  return previewPreparation.previewCandidateSlotIds
    .filter((slotId) => previewPreparation.slotStatusBySlotId[slotId] !== 'unresolved')
    .flatMap((slotId) => {
      const slotEntries = getPreviewPreparationEntriesForSlot(previewPreparation, slotId)
      const outputEntryIds = buildGraphOutputEntryIdsForSlot(slotId, slotEntries)
      return slotEntries.map((entry, entryIndex) => {
        const outputEntryId = outputEntryIds[entryIndex] ?? slotId
        const bundleEntry = bundleEntryByOutputEntryId.get(outputEntryId) ?? null
        const allowsCoarseFallback =
          shouldAllowCoarseParentFallback(entry) &&
          (buildBundle == null ||
            renderableEntryMode !== 'rebuiltOnly' ||
            bundleEntry?.status === 'rebuilt')
        return {
          ...entry,
          outputEntryId,
          renderable:
            artifactByOutputEntryId.get(outputEntryId) ??
            (allowsCoarseFallback
              ? (artifactByPartKey.get(entry.sourcePartKeyStr) ?? null)
              : null) ??
            null,
        }
      })
    })
}
