import type {
  BuildResultBundle,
  PartArtifact,
  ViewerRenderablePart,
} from '../../../shared/buildTypes'
import type { GraphPreviewPreparation } from '../previewPreparation'
import {
  selectPreviewRenderVmFromPreparation,
  type PreviewRenderVm,
  type PreviewRenderVmItem,
} from './selectPreviewRenderVm'

export type SharedPreviewRenderContribution = {
  graphDocumentId: string
  previewPreparation: GraphPreviewPreparation | null
  buildOutputs: PartArtifact[]
  buildBundle?: BuildResultBundle | null
}

export type SharedPreviewRenderVm = PreviewRenderVm & {
  contributingGraphDocumentIds: string[]
}

const qualifyViewerKey = (graphDocumentId: string, viewerKey: string): string =>
  `${graphDocumentId}:${viewerKey}`

const qualifyViewerPart = (
  graphDocumentId: string,
  viewerPart: ViewerRenderablePart,
): ViewerRenderablePart => ({
  ...viewerPart,
  viewerKey: qualifyViewerKey(graphDocumentId, viewerPart.viewerKey),
})

const qualifyPreviewItem = (
  graphDocumentId: string,
  item: PreviewRenderVmItem,
): PreviewRenderVmItem => {
  const viewerKey = qualifyViewerKey(graphDocumentId, item.viewerKey)
  return {
    ...item,
    id: qualifyViewerKey(graphDocumentId, item.id),
    viewerKey,
    viewerPart: item.viewerPart === null ? null : qualifyViewerPart(graphDocumentId, item.viewerPart),
  }
}

export const selectSharedPreviewRenderVm = (
  contributions: SharedPreviewRenderContribution[],
): SharedPreviewRenderVm => {
  const items: PreviewRenderVmItem[] = []
  const viewerParts: ViewerRenderablePart[] = []
  const contributingGraphDocumentIds: string[] = []

  for (const contribution of contributions) {
    if (contribution.previewPreparation === null) {
      continue
    }
    const previewVm = selectPreviewRenderVmFromPreparation(
      contribution.previewPreparation,
      contribution.buildOutputs,
      contribution.buildBundle ?? null,
    )
    contributingGraphDocumentIds.push(contribution.graphDocumentId)
    items.push(
      ...previewVm.items.map((item) => qualifyPreviewItem(contribution.graphDocumentId, item)),
    )
    viewerParts.push(
      ...previewVm.viewerParts.map((viewerPart) =>
        qualifyViewerPart(contribution.graphDocumentId, viewerPart),
      ),
    )
  }

  return {
    contributingGraphDocumentIds,
    items,
    viewerParts,
  }
}
