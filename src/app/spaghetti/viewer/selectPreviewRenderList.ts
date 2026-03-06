import type { PartArtifact } from '../../../shared/buildTypes'
import { artifactToPartKeyStr } from '../../parts/partKeyResolver'
import { computeFeatureStackIrParts } from '../compiler/compileGraph'
import type { SpaghettiGraph, SpaghettiNode } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'

export type PreviewRenderEntry = {
  key: string
  slotId: string
  sourceNodeId: string
  sourcePartKeyStr: string
  sourcePortId: string
  renderable: PartArtifact | null
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

export const selectPreviewRenderList = (
  graph: SpaghettiGraph,
  buildOutputs: PartArtifact[],
): PreviewRenderEntry[] => {
  const outputPreviewNode = graph.nodes.find(isOutputPreviewNode)
  if (outputPreviewNode === undefined) {
    return []
  }

  const slotIds = readSlotIds(outputPreviewNode)
  if (slotIds.length === 0) {
    return []
  }

  const artifactByPartKey = new Map<string, PartArtifact>()
  for (const artifact of buildOutputs) {
    const partKey = artifactToPartKeyStr(artifact)
    if (!artifactByPartKey.has(partKey)) {
      artifactByPartKey.set(partKey, artifact)
    }
  }

  const partMapping = computeFeatureStackIrParts(graph).nodeIdToPartKey
  if (partMapping === undefined) {
    throw new Error('OP-5 STOP: nodeIdToPartKey mapping missing.')
  }

  const renderEntries: PreviewRenderEntry[] = []
  for (const slotId of slotIds) {
    const matchingEdge = findMatchingIncomingSlotEdge(graph, outputPreviewNode.nodeId, slotId)
    if (matchingEdge === undefined) {
      continue
    }

    const sourceNodeId = matchingEdge.from.nodeId
    // OutputPreview stays graph-topology-only here: slot edge -> source nodeId -> compile-owned partKey -> build artifact.
    const sourcePartKey = partMapping[sourceNodeId]
    if (sourcePartKey === undefined) {
      throw new Error(
        `OP-5 STOP: missing nodeIdToPartKey mapping for connected source nodeId "${sourceNodeId}".`,
      )
    }

    renderEntries.push({
      key: slotId,
      slotId,
      sourceNodeId,
      sourcePartKeyStr: sourcePartKey,
      sourcePortId: matchingEdge.from.portId,
      renderable: artifactByPartKey.get(sourcePartKey) ?? null,
    })
  }

  return renderEntries
}
