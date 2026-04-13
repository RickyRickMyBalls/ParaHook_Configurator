import type {
  BrowserRenderableRowVm,
  BrowserTreeRowActionVm,
} from './selectBrowserTreeRows'
import type { OpenGraphDocumentIntentStrategy } from '../store/workspaceIntents'

export type BrowserGraphTargetActionOptions = {
  strategy?: OpenGraphDocumentIntentStrategy
  fitNodeInViewport?: boolean
}

export type BrowserRowActionHandlers = {
  sharedViewerCompositionActive: boolean
  onSaveGraph: (cachedGraphId: string) => void
  onActivateGraphTarget: (
    graphDocumentId: string,
    nodeId: string | null,
    options?: BrowserGraphTargetActionOptions,
  ) => void
  onTransformReference: (referenceId: string) => void
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
      handlers.onActivateGraphTarget(row.graphDocumentId, null, {
        strategy: 'open-or-focus',
      })
      return
    }
    if (action.actionId === 'reveal') {
      handlers.onRevealGraph(row.graphDocumentId)
      return
    }
    if (action.actionId === 'new-editor') {
      handlers.onActivateGraphTarget(row.graphDocumentId, null, {
        strategy: 'open-new',
      })
      return
    }
    if (action.actionId === 'swap-editor') {
      handlers.onActivateGraphTarget(row.graphDocumentId, null, {
        strategy: 'swap-focused-or-open',
      })
    }
    return
  }

  if (row.rowKind === 'graph-rebuild-object' || row.rowKind === 'graph-node') {
    if (action.actionId === 'view-in-graph') {
      handlers.onActivateGraphTarget(row.authoringGraphDocumentId, row.authoringNodeId, {
        fitNodeInViewport: true,
      })
    }
    return
  }

  if (row.rowKind === 'reference-item') {
    if (action.actionId === 'transform-object') {
      handlers.onTransformReference(row.referenceId)
    }
    return
  }

  if (
    row.rowKind === 'object' &&
    (row.contentOriginKind === 'imported-reference' || row.contentOriginKind === 'source-reference')
  ) {
    if (action.actionId === 'transform-object' && row.referenceId) {
      handlers.onTransformReference(row.referenceId)
    }
    return
  }

  if (row.rowKind === 'component' || row.rowKind === 'object' || row.rowKind === 'sketch') {
    if (action.actionId === 'view-in-graph' && row.authoringGraphDocumentId !== null) {
      handlers.onActivateGraphTarget(row.authoringGraphDocumentId, row.authoringNodeId, {
        fitNodeInViewport: row.authoringNodeId !== null,
      })
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
