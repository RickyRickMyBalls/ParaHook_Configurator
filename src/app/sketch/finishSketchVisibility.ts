import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { buildProjectSketchBrowserRowId, useAppStore } from '../store/useAppStore'

export const revealFinishedSketch = (nodeId: string): void => {
  const spaghettiState = useSpaghettiStore.getState()
  const activeGraphDocumentId = spaghettiState.activeGraphDocumentId
  if (activeGraphDocumentId.length === 0) {
    return
  }

  const graphDocument = spaghettiState.graphDocumentsById[activeGraphDocumentId]
  const sketchNode =
    graphDocument?.graph.nodes.find(
      (node) => node.nodeId === nodeId && node.type === 'Geometry/Sketch',
    ) ?? null
  const rawSketch = sketchNode?.params.sketch as { featureId?: unknown } | undefined
  if (typeof rawSketch?.featureId !== 'string' || rawSketch.featureId.length === 0) {
    return
  }

  useAppStore
    .getState()
    .setSketchVisibility(
      buildProjectSketchBrowserRowId(activeGraphDocumentId, nodeId, rawSketch.featureId),
      true,
    )
}
