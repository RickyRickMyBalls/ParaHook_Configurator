import { SpaghettiCanvas } from '../canvas/SpaghettiCanvas'

type SpaghettiEditorViewMode = 'expanded' | 'collapsed'

type ExpandedEditorProps = {
  graphDocumentId: string
  fitNodeId: string | null
  fitNodeRequestKey: number
  isMeatballView?: boolean
  isCanvasToolbarVisible: boolean
  viewMode: SpaghettiEditorViewMode
  onSetViewMode: (viewMode: SpaghettiEditorViewMode) => void
}

export function ExpandedEditor({
  graphDocumentId,
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
        graphDocumentId={graphDocumentId}
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
