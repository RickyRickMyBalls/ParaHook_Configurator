import { selectGraphByDocumentId, useSpaghettiStore } from '../store/useSpaghettiStore'
import { CollapsedEditor } from './CollapsedEditor'
import { ExpandedEditor } from './ExpandedEditor'

type SpaghettiEditorViewMode = 'expanded' | 'essentials' | 'collapsed'

type SpaghettiEditorProps = {
  editorViewportId: string
  graphDocumentId: string
  viewMode: SpaghettiEditorViewMode
  focusNodeId: string | null
  fitCanvasRequestKey: number
  fitNodeId: string | null
  fitNodeRequestKey: number
  isMeatballView?: boolean
  isCanvasToolbarVisible: boolean
  onSetViewMode: (viewMode: SpaghettiEditorViewMode) => void
}

export function SpaghettiEditor({
  editorViewportId,
  graphDocumentId,
  viewMode,
  focusNodeId,
  fitCanvasRequestKey,
  fitNodeId,
  fitNodeRequestKey,
  isMeatballView = false,
  isCanvasToolbarVisible,
  onSetViewMode,
}: SpaghettiEditorProps) {
  const graph = useSpaghettiStore((state) => selectGraphByDocumentId(state, graphDocumentId))

  return (
    <div
      className="SpaghettiEditorRoot"
      data-graph-document-id={graphDocumentId}
    >
      <div className="SpaghettiEditorShell">
        <div className="SpaghettiEditorBody">
          {graph === null ? (
            <div className="V15Error">Viewport graph binding is missing.</div>
          ) : null}

          {graph === null ? null : viewMode === 'collapsed' ? (
            <CollapsedEditor
              graphDocumentId={graphDocumentId}
              focusNodeId={focusNodeId}
              isCanvasToolbarVisible={isCanvasToolbarVisible}
              viewMode={viewMode}
              onSetViewMode={onSetViewMode}
            />
          ) : (
            <ExpandedEditor
              editorViewportId={editorViewportId}
              graphDocumentId={graphDocumentId}
              fitCanvasRequestKey={fitCanvasRequestKey}
              fitNodeId={fitNodeId}
              fitNodeRequestKey={fitNodeRequestKey}
              isMeatballView={isMeatballView}
              isCanvasToolbarVisible={isCanvasToolbarVisible}
              viewMode={viewMode}
              onSetViewMode={onSetViewMode}
            />
          )}
        </div>
      </div>
    </div>
  )
}
