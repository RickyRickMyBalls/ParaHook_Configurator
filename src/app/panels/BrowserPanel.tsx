import { useMemo } from 'react'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { useAppStore } from '../store/useAppStore'

export function BrowserPanel() {
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const graphDocumentOrder = useSpaghettiStore((state) => state.graphDocumentOrder)
  const editorViewportsById = useSpaghettiStore((state) => state.editorViewportsById)
  const editorViewportOrder = useSpaghettiStore((state) => state.editorViewportOrder)
  const activeGraphDocumentId = useSpaghettiStore((state) => state.activeGraphDocumentId)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const createGraphDocument = useSpaghettiStore((state) => state.createGraphDocument)
  const duplicateActiveGraphDocument = useSpaghettiStore((state) => state.duplicateActiveGraphDocument)
  const openGraphDocumentInViewport = useSpaghettiStore((state) => state.openGraphDocumentInViewport)
  const closeEditorViewport = useSpaghettiStore((state) => state.closeEditorViewport)
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const setInputMode = useAppStore((state) => state.setInputMode)

  const graphDocuments = useMemo(
    () =>
      graphDocumentOrder
        .map((graphDocumentId) => graphDocumentsById[graphDocumentId] ?? null)
        .filter((document) => document !== null),
    [graphDocumentOrder, graphDocumentsById],
  )

  const editorViewports = useMemo(
    () =>
      editorViewportOrder
        .map((editorViewportId) => editorViewportsById[editorViewportId] ?? null)
        .filter((viewport) => viewport !== null),
    [editorViewportOrder, editorViewportsById],
  )

  const openViewportByGraphDocumentId = new Map(
    editorViewports.map((viewport) => [viewport.graphDocumentId, viewport]),
  )

  const handleOpenOrFocusGraph = (graphDocumentId: string) => {
    openGraphDocumentInViewport(graphDocumentId)
    setInputMode('spaghetti')
  }

  const handleCreateGraph = () => {
    const graphDocumentId = createGraphDocument()
    openGraphDocumentInViewport(graphDocumentId)
    setInputMode('spaghetti')
  }

  const handleDuplicateFocusedGraph = () => {
    const graphDocumentId = duplicateActiveGraphDocument()
    openGraphDocumentInViewport(graphDocumentId)
    setInputMode('spaghetti')
  }

  return (
    <section className="V15Panel BrowserPanelRoot">
      <div className="BrowserPanelHeader">
        <h3 className="V15PanelTitle">Browser</h3>
        <div className="BrowserPanelActions">
          <button type="button" onClick={handleCreateGraph}>
            New Graph
          </button>
          <button type="button" onClick={handleDuplicateFocusedGraph}>
            Duplicate Focused
          </button>
        </div>
      </div>

      <div className="BrowserTree" role="tree" aria-label="Project browser">
        <details open className="BrowserTreeSection BrowserTreeSection--root">
          <summary className="BrowserTreeSummary">Project</summary>

          <details open className="BrowserTreeSection">
            <summary className="BrowserTreeSummary">Graphs</summary>
            <div className="BrowserTreeGroup">
              {graphDocuments.map((document) => {
                const openViewport = openViewportByGraphDocumentId.get(document.graphDocumentId) ?? null
                const isFocusedGraph = activeGraphDocumentId === document.graphDocumentId
                const isFocusedViewport =
                  openViewport !== null && activeEditorViewportId === openViewport.editorViewportId

                return (
                  <div
                    key={document.graphDocumentId}
                    className={`BrowserTreeRow ${isFocusedGraph ? 'isSelected' : ''}`}
                  >
                    <button
                      type="button"
                      className="BrowserTreeRowMain"
                      onClick={() => handleOpenOrFocusGraph(document.graphDocumentId)}
                    >
                      <span className="BrowserTreeRowLabel">{document.name}</span>
                      <span className="BrowserTreeRowMeta">
                        {openViewport === null ? 'Closed' : isFocusedViewport ? 'Focused' : 'Open'}
                      </span>
                    </button>
                  </div>
                )
              })}
            </div>
          </details>

          <details open className="BrowserTreeSection">
            <summary className="BrowserTreeSummary">Open Viewports</summary>
            <div className="BrowserTreeGroup">
              {editorViewports.length === 0 ? (
                <div className="BrowserTreeEmpty">No open editor viewports.</div>
              ) : (
                editorViewports
                  .slice()
                  .sort((a, b) => b.zOrder - a.zOrder)
                  .map((viewport) => {
                    const document = graphDocuments.find(
                      (currentDocument) => currentDocument.graphDocumentId === viewport.graphDocumentId,
                    )
                    return (
                      <div
                        key={viewport.editorViewportId}
                        className={`BrowserTreeRow ${viewport.isFocused ? 'isSelected' : ''}`}
                      >
                        <button
                          type="button"
                          className="BrowserTreeRowMain"
                          onClick={() => {
                            setActiveEditorViewportId(viewport.editorViewportId)
                            setInputMode('spaghetti')
                          }}
                        >
                          <span className="BrowserTreeRowLabel">
                            {document?.name ?? viewport.graphDocumentId}
                          </span>
                          <span className="BrowserTreeRowMeta">
                            {viewport.isFocused ? 'Focused' : `z${viewport.zOrder}`}
                          </span>
                        </button>
                        <button
                          type="button"
                          className="BrowserTreeRowAction"
                          onClick={() => closeEditorViewport(viewport.editorViewportId)}
                          aria-label={`Close ${document?.name ?? viewport.graphDocumentId}`}
                        >
                          Close
                        </button>
                      </div>
                    )
                  })
              )}
            </div>
          </details>
        </details>
      </div>
    </section>
  )
}
