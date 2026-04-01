import { SpaghettiCanvas } from '../canvas/SpaghettiCanvas'

type SpaghettiEditorViewMode = 'expanded' | 'essentials' | 'collapsed'

type ExpandedEditorProps = {
  editorViewportId: string
  graphDocumentId: string
  fitCanvasRequestKey: number
  fitNodeId: string | null
  fitNodeRequestKey: number
  isMeatballView?: boolean
  isCanvasToolbarVisible: boolean
  viewMode: SpaghettiEditorViewMode
  onSetViewMode: (viewMode: SpaghettiEditorViewMode) => void
}

export function ExpandedEditor({
  editorViewportId,
  graphDocumentId,
  fitCanvasRequestKey,
  fitNodeId,
  fitNodeRequestKey,
  isMeatballView = false,
  isCanvasToolbarVisible,
  viewMode,
  onSetViewMode,
}: ExpandedEditorProps) {
  return (
    <div className="spaghettiCanvasHost">
      <SpaghettiCanvas
        editorViewportId={editorViewportId}
        graphDocumentId={graphDocumentId}
        fitCanvasRequestKey={fitCanvasRequestKey}
        fitNodeId={fitNodeId}
        fitNodeRequestKey={fitNodeRequestKey}
        isMeatballView={isMeatballView}
        isToolbarVisible={isCanvasToolbarVisible}
        viewMode={viewMode}
        onSetViewMode={onSetViewMode}
      />
    </div>
  )
}
