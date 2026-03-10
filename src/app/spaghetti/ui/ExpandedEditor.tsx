import { SpaghettiCanvas } from '../canvas/SpaghettiCanvas'

type ExpandedEditorProps = {
  graphDocumentId: string
}

export function ExpandedEditor({ graphDocumentId }: ExpandedEditorProps) {
  return (
    <div className="spaghettiCanvasHost">
      <SpaghettiCanvas graphDocumentId={graphDocumentId} />
    </div>
  )
}
