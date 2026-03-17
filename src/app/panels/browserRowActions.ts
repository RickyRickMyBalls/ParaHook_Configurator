import type {
  BrowserRenderableRowVm,
  BrowserTreeRowActionVm,
} from './selectBrowserTreeRows'

export type BrowserRowActionHandlers = {
  sharedViewerCompositionActive: boolean
  onSaveGraph: (cachedGraphId: string) => void
  onOpenGraph: (graphDocumentId: string) => void
  onTransformReference: (referenceId: string) => void
  onViewInGraph: (graphDocumentId: string, nodeId: string | null) => void
  onOpenGraphInNewViewport: (graphDocumentId: string) => void
  onSwapFocusedEditorViewportToGraphDocument: (graphDocumentId: string) => void
  onRevealGraph: (graphDocumentId: string) => void
  onFocusViewport: (editorViewportId: string) => void
  onCloseViewport: (editorViewportId: string) => void
}

export const runBrowserRowAction = (
  row: BrowserRenderableRowVm,
  action: BrowserTreeRowActionVm,
  handlers: BrowserRowActionHandlers,
) => {
  if (row.rowKind === 'graph-document') {
    if (action.actionId === 'save') {
      handlers.onSaveGraph(row.cachedGraphId)
      return
    }
    if (action.actionId === 'open') {
      handlers.onOpenGraph(row.graphDocumentId)
      return
    }
    if (action.actionId === 'reveal') {
      if (!handlers.sharedViewerCompositionActive) {
        handlers.onRevealGraph(row.graphDocumentId)
      }
      return
    }
    if (action.actionId === 'new-editor') {
      handlers.onOpenGraphInNewViewport(row.graphDocumentId)
      return
    }
    if (action.actionId === 'swap-editor') {
      handlers.onSwapFocusedEditorViewportToGraphDocument(row.graphDocumentId)
    }
    return
  }

  if (row.rowKind === 'graph-rebuild-object' || row.rowKind === 'graph-node') {
    if (action.actionId === 'view-in-graph') {
      handlers.onViewInGraph(row.authoringGraphDocumentId, row.authoringNodeId)
    }
    return
  }

  if (row.rowKind === 'reference-item') {
    if (action.actionId === 'transform-object') {
      handlers.onTransformReference(row.referenceId)
    }
    return
  }

  if (row.rowKind === 'component' || row.rowKind === 'object') {
    if (action.actionId === 'view-in-graph' && row.authoringGraphDocumentId !== null) {
      handlers.onViewInGraph(row.authoringGraphDocumentId, row.authoringNodeId)
    }
    return
  }

  if (row.rowKind === 'viewport') {
    if (action.actionId === 'focus') {
      handlers.onFocusViewport(row.editorViewportId)
      return
    }
    if (action.actionId === 'close') {
      handlers.onCloseViewport(row.editorViewportId)
    }
  }
}
