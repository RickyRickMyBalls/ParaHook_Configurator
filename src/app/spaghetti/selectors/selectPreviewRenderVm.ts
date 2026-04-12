import {
  type BuildResultBundle,
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
  outputEntryId: string
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
  buildBundle: BuildResultBundle | null = null,
): PreviewRenderVm => {
  const renderableEntryByOutputEntryId = new Map(
    buildPreviewPreparationEntries(previewPreparation, buildOutputs, buildBundle).map((entry) => [
      entry.outputEntryId,
      entry,
    ] as const),
  )

  const items = [...renderableEntryByOutputEntryId.values()].map((entry) => ({
    ...entry,
    id: `preview:${entry.outputEntryId}`,
    nodeId: entry.sourceNodeId,
    isReady: entry.renderable !== null,
    viewerKey: entry.outputEntryId,
    viewerPart:
      entry.renderable === null ? null : toViewerRenderablePart(entry.renderable, entry.outputEntryId),
  }))
  return {
    items,
    viewerParts: items.flatMap((item) => (item.viewerPart === null ? [] : [item.viewerPart])),
  }
}

let lastGraph: SpaghettiGraph | undefined
let lastBuildOutputs: PartArtifact[] | undefined
let lastBuildBundle: BuildResultBundle | null | undefined
let lastPreviewRenderVm: PreviewRenderVm | undefined
let lastPreviewPreparation: GraphPreviewPreparation | undefined

export const selectPreviewRenderVm = (
  graph: SpaghettiGraph,
  buildOutputs: PartArtifact[],
  buildBundle: BuildResultBundle | null = null,
): PreviewRenderVm => {
  if (
    lastPreviewRenderVm !== undefined &&
    lastGraph === graph &&
    lastBuildOutputs === buildOutputs &&
    lastBuildBundle === buildBundle
  ) {
    return lastPreviewRenderVm
  }
  const previewPreparation = prepareGraphPreviewPreparation(graph)
  const next = buildPreviewRenderVmFromPreparation(previewPreparation, buildOutputs, buildBundle)
  lastGraph = graph
  lastBuildOutputs = buildOutputs
  lastBuildBundle = buildBundle
  lastPreviewPreparation = previewPreparation
  lastPreviewRenderVm = next
  return next
}

export const selectPreviewRenderVmFromPreparation = (
  previewPreparation: GraphPreviewPreparation,
  buildOutputs: PartArtifact[],
  buildBundle: BuildResultBundle | null = null,
): PreviewRenderVm => {
  if (
    lastPreviewRenderVm !== undefined &&
    lastPreviewPreparation === previewPreparation &&
    lastBuildOutputs === buildOutputs &&
    lastBuildBundle === buildBundle
  ) {
    return lastPreviewRenderVm
  }
  const next = buildPreviewRenderVmFromPreparation(previewPreparation, buildOutputs, buildBundle)
  lastGraph = undefined
  lastBuildOutputs = buildOutputs
  lastBuildBundle = buildBundle
  lastPreviewPreparation = previewPreparation
  lastPreviewRenderVm = next
  return next
}
