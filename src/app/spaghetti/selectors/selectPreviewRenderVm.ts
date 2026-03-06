import {
  toViewerRenderablePart,
  type PartArtifact,
  type ViewerRenderablePart,
} from '../../../shared/buildTypes'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { evaluateSpaghettiGraph } from '../compiler/evaluateGraph'
import {
  selectPreviewRenderList,
  type PreviewRenderEntry,
} from '../viewer/selectPreviewRenderList'
import { selectDiagnosticsVm } from './selectDiagnosticsVm'

export type PreviewRenderVmItem = PreviewRenderEntry & {
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

const buildPreviewRenderVm = (
  graph: SpaghettiGraph,
  buildOutputs: PartArtifact[],
): PreviewRenderVm => {
  const evaluation = evaluateSpaghettiGraph(graph)
  const diagnosticsVm = selectDiagnosticsVm({
    graph,
    evaluation,
  })

  const items = selectPreviewRenderList(graph, buildOutputs)
    .filter((entry) => diagnosticsVm.slotStatus[entry.slotId] !== 'unresolved')
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
  const next = buildPreviewRenderVm(graph, buildOutputs)
  lastGraph = graph
  lastBuildOutputs = buildOutputs
  lastPreviewRenderVm = next
  return next
}
