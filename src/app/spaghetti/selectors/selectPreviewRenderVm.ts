import {
  toViewerRenderablePart,
  type PartArtifact,
  type ViewerRenderablePart,
} from '../../../shared/buildTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import {
  buildPreviewPreparationEntries,
  prepareGraphPreviewPreparation,
  type GraphPreviewPreparation,
} from '../previewPreparation'

export type PreviewRenderVmItem = ReturnType<typeof buildPreviewPreparationEntries>[number] & {
  id: string
  nodeId: string
  isReady: boolean
  viewerKey: string
  viewerPart: ViewerRenderablePart | null
}

export type PreviewRenderVm = {
  items: PreviewRenderVmItem[]
  viewerParts: ViewerRenderablePart[]
}

const buildPreviewRenderVmFromPreparation = (
  previewPreparation: GraphPreviewPreparation,
  buildOutputs: PartArtifact[],
): PreviewRenderVm => {
  const items = buildPreviewPreparationEntries(previewPreparation, buildOutputs)
    .map((entry) => ({
      ...entry,
      id: `preview:${entry.slotId}:${entry.sourceNodeId}:${entry.sourcePartKeyStr}`,
      nodeId: entry.sourceNodeId,
      isReady: entry.renderable !== null,
      // Preview identity stays slot-scoped even when the underlying artifact identity is part-scoped.
      viewerKey: entry.slotId,
      viewerPart:
        entry.renderable === null
          ? null
          : toViewerRenderablePart(entry.renderable, entry.slotId),
    }))
  return {
    items,
    viewerParts: items.flatMap((item) => (item.viewerPart === null ? [] : [item.viewerPart])),
  }
}

let lastGraph: SpaghettiGraph | undefined
let lastBuildOutputs: PartArtifact[] | undefined
let lastPreviewRenderVm: PreviewRenderVm | undefined
let lastPreviewPreparation: GraphPreviewPreparation | undefined

export const selectPreviewRenderVm = (
  graph: SpaghettiGraph,
  buildOutputs: PartArtifact[],
): PreviewRenderVm => {
  if (
    lastPreviewRenderVm !== undefined &&
    lastGraph === graph &&
    lastBuildOutputs === buildOutputs
  ) {
    return lastPreviewRenderVm
  }
  const previewPreparation = prepareGraphPreviewPreparation(graph)
  const next = buildPreviewRenderVmFromPreparation(previewPreparation, buildOutputs)
  lastGraph = graph
  lastBuildOutputs = buildOutputs
  lastPreviewPreparation = previewPreparation
  lastPreviewRenderVm = next
  return next
}

export const selectPreviewRenderVmFromPreparation = (
  previewPreparation: GraphPreviewPreparation,
  buildOutputs: PartArtifact[],
): PreviewRenderVm => {
  if (
    lastPreviewRenderVm !== undefined &&
    lastPreviewPreparation === previewPreparation &&
    lastBuildOutputs === buildOutputs
  ) {
    return lastPreviewRenderVm
  }
  const next = buildPreviewRenderVmFromPreparation(previewPreparation, buildOutputs)
  lastGraph = undefined
  lastBuildOutputs = buildOutputs
  lastPreviewPreparation = previewPreparation
  lastPreviewRenderVm = next
  return next
}
