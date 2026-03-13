import { selectGraphByDocumentId, useSpaghettiStore } from '../store/useSpaghettiStore'
import { CollapsedEditor } from './CollapsedEditor'
import { ExpandedEditor } from './ExpandedEditor'

type SpaghettiEditorViewMode = 'expanded' | 'collapsed'

type SpaghettiEditorProps = {
  graphDocumentId: string
  viewMode: SpaghettiEditorViewMode
  focusNodeId: string | null
  fitNodeId: string | null
  fitNodeRequestKey: number
  isMeatballView?: boolean
  isCanvasToolbarVisible: boolean
  onSetViewMode: (viewMode: SpaghettiEditorViewMode) => void
}

export function SpaghettiEditor({
  graphDocumentId,
  viewMode,
  focusNodeId,
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

          {graph === null ? null : viewMode === 'expanded' ? (
            <ExpandedEditor
              graphDocumentId={graphDocumentId}
              fitNodeId={fitNodeId}
              fitNodeRequestKey={fitNodeRequestKey}
              isMeatballView={isMeatballView}
              isCanvasToolbarVisible={isCanvasToolbarVisible}
              viewMode={viewMode}
              onSetViewMode={onSetViewMode}
            />
          ) : (
            <CollapsedEditor
              graphDocumentId={graphDocumentId}
              focusNodeId={focusNodeId}
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
