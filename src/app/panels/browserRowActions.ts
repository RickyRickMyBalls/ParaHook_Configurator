import type {
  BrowserRenderableRowVm,
  BrowserTreeRowActionVm,
} from './selectBrowserTreeRows'

export type BrowserRowActionHandlers = {
  sharedViewerCompositionActive: boolean
  onSaveGraph: (cachedGraphId: string) => void
  onOpenGraph: (graphDocumentId: string) => void
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

  if (row.rowKind === 'published-output') {
    if (action.actionId === 'reveal' && !handlers.sharedViewerCompositionActive) {
      handlers.onRevealGraph(row.graphDocumentId)
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
