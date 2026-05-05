import { useWorkspaceStore } from './useWorkspaceStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'

const defaultOverlayBackgroundOpacity = 0
const overlayCanvasToggleGlyph = '\u25c9'

type ViewportOverlayModeTitlebarControlsProps = {
  viewportId: string
}

export function ViewportOverlayModeTitlebarControls(
  props: ViewportOverlayModeTitlebarControlsProps,
) {
  const { viewportId } = props
  const activeViewerViewportId = useWorkspaceStore((state) => state.activeViewerViewportId)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById)
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const overlayModeByViewportId = useSpaghettiStore((state) => state.editorViewportOverlayModeById)
  const overlayBackgroundOpacityByViewportId = useSpaghettiStore(
    (state) => state.editorViewportOverlayBackgroundOpacityById,
  )
  const overlayCanvasHiddenByViewportId = useSpaghettiStore(
    (state) => state.editorViewportOverlayCanvasHiddenById,
  )
  const setEditorViewportPresentationMode = useSpaghettiStore(
    (state) => state.setEditorViewportPresentationMode,
  )
  const setEditorViewportOverlayCanvasHidden = useSpaghettiStore(
    (state) => state.setEditorViewportOverlayCanvasHidden,
  )
  const setEditorViewportOverlayBackgroundOpacity = useSpaghettiStore(
    (state) => state.setEditorViewportOverlayBackgroundOpacity,
  )

  const overlayEditorViewportId =
    viewportId === activeViewerViewportId &&
    activeEditorViewportId.length > 0 &&
    overlayModeByViewportId[activeEditorViewportId] === true
      ? activeEditorViewportId
      : null

  if (overlayEditorViewportId === null) {
    return null
  }

  const overlayViewport = editorViewportsById[overlayEditorViewportId] ?? null
  const graphDocument =
    overlayViewport === null ? null : graphDocumentsById[overlayViewport.graphDocumentId] ?? null
  const graphName = graphDocument?.name?.trim() || 'Graph'
  const overlayBackgroundOpacity =
    overlayBackgroundOpacityByViewportId[overlayEditorViewportId] ?? defaultOverlayBackgroundOpacity
  const overlayCanvasHidden = overlayCanvasHiddenByViewportId[overlayEditorViewportId] ?? false
  const overlayCanvasButtonTitle = overlayCanvasHidden
    ? 'Show overlay canvas'
    : 'Hide overlay canvas'

  return (
    <div
      className="ViewportOverlayModeControls"
      data-editor-viewport-id={overlayEditorViewportId}
      onPointerDown={(event) => {
        event.stopPropagation()
      }}
      onContextMenu={(event) => {
        event.stopPropagation()
      }}
    >
      <button
        type="button"
        className="ViewportOverlayModeButton"
        onClick={() => {
          setEditorViewportPresentationMode(overlayEditorViewportId, 'expanded')
        }}
        aria-label="Leave overlay mode"
        title="Leave overlay mode"
      >
        O
      </button>
      <span className="ViewportOverlayModeGraphName" title={graphName}>
        {graphName}
      </span>
      <button
        type="button"
        className={`ViewportOverlayModeButton ViewportOverlayModeCanvasToggle ${
          overlayCanvasHidden ? 'isInactive' : ''
        }`}
        onClick={() => {
          setEditorViewportOverlayCanvasHidden(overlayEditorViewportId, !overlayCanvasHidden)
        }}
        aria-label={overlayCanvasButtonTitle}
        aria-pressed={!overlayCanvasHidden}
        title={overlayCanvasButtonTitle}
      >
        {overlayCanvasToggleGlyph}
      </button>
      <label className="ViewportOverlayModeSliderGroup">
        <span className="ViewportOverlayModeSliderLabel">BG</span>
        <input
          className="ViewportOverlayModeSlider"
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={overlayBackgroundOpacity}
          onChange={(event) => {
            setEditorViewportOverlayBackgroundOpacity(
              overlayEditorViewportId,
              Number(event.currentTarget.value),
            )
          }}
          aria-label="Overlay background transparency"
          title="Overlay background transparency"
        />
      </label>
    </div>
  )
}
