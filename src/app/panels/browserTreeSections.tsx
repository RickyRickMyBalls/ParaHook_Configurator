import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import type { BrowserGraphTreeRowVm, BrowserTreeRowsVm } from './selectBrowserTreeRows'
import { BrowserTreeRowShell, type BrowserTreeRowHandlers } from './browserTreeRowPresenter'

type BrowserSectionActionButtonProps = {
  label: string
  ariaLabel: string
  title: string
  disabled?: boolean
  onClick: () => void
}

function BrowserSectionActionButton(props: BrowserSectionActionButtonProps) {
  const { ariaLabel, disabled = false, label, onClick, title } = props

  const handlePointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  const handleClick = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    onClick()
  }

  return (
    <button
      type="button"
      className="BrowserTreeSummaryAction"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
    >
      {label}
    </button>
  )
}

type BrowserContentSectionProps = {
  referenceRows: BrowserTreeRowsVm['referenceRows']
  contentRows: BrowserTreeRowsVm['contentRows']
  rowHandlers: BrowserTreeRowHandlers
  onOpenContentImportMenu: (event: ReactMouseEvent<HTMLButtonElement>) => void
}

export function BrowserContentSection(props: BrowserContentSectionProps) {
  const { contentRows, onOpenContentImportMenu, referenceRows, rowHandlers } = props

  return (
    <details open className="BrowserTreeSection BrowserTreeSection--content">
      <summary className="BrowserTreeSummary BrowserTreeSummary--withActions">
        <span className="BrowserTreeSummaryLabel">Content</span>
        <span className="BrowserTreeSummaryActions">
          <button
            type="button"
            className="BrowserTreeSummaryAction"
            onPointerDown={(event) => event.stopPropagation()}
            onClick={onOpenContentImportMenu}
            aria-label="Import reference file"
            title="Import Reference"
          >
            +
          </button>
        </span>
      </summary>
      <div className="BrowserTreeGroup BrowserTreeGroup--content">
        {referenceRows.map((row) => (
          <div key={row.rowId}>
            <BrowserTreeRowShell row={row} {...rowHandlers} />
            {row.rowKind === 'reference-category' &&
            row.isExpanded &&
            row.itemCount === 0 &&
            row.emptyLabel.length > 0 ? (
              <div className="BrowserTreeEmpty BrowserTreeEmpty--nested">{row.emptyLabel}</div>
            ) : null}
          </div>
        ))}
        {referenceRows.length === 0 && contentRows.length === 0 ? (
          <div className="BrowserTreeEmpty">No project content.</div>
        ) : (
          <>
            {contentRows.map((row) => (
              <BrowserTreeRowShell key={row.rowId} row={row} {...rowHandlers} />
            ))}
            {contentRows.length === 1 &&
            contentRows[0]?.rowKind === 'assembly' &&
            !contentRows[0].isExpandable &&
            referenceRows.length === 0 ? (
              <div className="BrowserTreeEmpty">No published content.</div>
            ) : null}
          </>
        )}
      </div>
    </details>
  )
}

type BrowserGraphDocumentsSectionProps = {
  graphRows: BrowserGraphTreeRowVm[]
  rowHandlers: BrowserTreeRowHandlers
  onCreateGraph: () => void
  onDuplicateFocusedGraph: () => void
  onLoadGraphFile: () => void
}

export function BrowserGraphDocumentsSection(props: BrowserGraphDocumentsSectionProps) {
  const {
    graphRows,
    onCreateGraph,
    onDuplicateFocusedGraph,
    onLoadGraphFile,
    rowHandlers,
  } = props

  return (
    <details open className="BrowserTreeSection">
      <summary className="BrowserTreeSummary BrowserTreeSummary--withActions">
        <span className="BrowserTreeSummaryLabel">Graph Documents</span>
        <span className="BrowserTreeSummaryActions">
          <BrowserSectionActionButton
            ariaLabel="Create new graph"
            label="+"
            onClick={onCreateGraph}
            title="New Graph"
          />
          <BrowserSectionActionButton
            ariaLabel="Duplicate focused graph"
            label="D"
            onClick={onDuplicateFocusedGraph}
            title="Duplicate Focused"
          />
          <BrowserSectionActionButton
            ariaLabel="Load graph into new graph"
            label="L"
            onClick={onLoadGraphFile}
            title="Load Into New Graph"
          />
        </span>
      </summary>
      <div className="BrowserTreeGroup">
        {graphRows.length === 0 ? (
          <div className="BrowserTreeEmpty">No graph documents.</div>
        ) : (
          graphRows.map((row) => (
            <div key={row.cachedGraphId}>
              <BrowserTreeRowShell row={row} {...rowHandlers} />
              {row.isExpanded ? (
                <div className="BrowserTreeGroup">
                  {row.children.length === 0 ? (
                    <div className="BrowserTreeEmpty">No graph child sections.</div>
                  ) : (
                    row.children.map((childRow) => (
                      <div key={childRow.rowId}>
                        <BrowserTreeRowShell row={childRow} {...rowHandlers} />
                        {childRow.rowKind === 'graph-section' &&
                        childRow.isExpanded &&
                        childRow.childCount === 0 &&
                        childRow.emptyLabel.length > 0 ? (
                          <div className="BrowserTreeEmpty BrowserTreeEmpty--nested">
                            {childRow.emptyLabel}
                          </div>
                        ) : null}
                      </div>
                    ))
                  )}
                </div>
              ) : null}
            </div>
          ))
        )}
      </div>
    </details>
  )
}

type BrowserOpenEditorsSectionProps = {
  viewportRows: BrowserTreeRowsVm['viewportRows']
  rowHandlers: BrowserTreeRowHandlers
  canOpenNewEditor: boolean
  onOpenNewEditor: () => void
}

export function BrowserOpenEditorsSection(props: BrowserOpenEditorsSectionProps) {
  const { canOpenNewEditor, onOpenNewEditor, rowHandlers, viewportRows } = props

  return (
    <details open className="BrowserTreeSection">
      <summary className="BrowserTreeSummary BrowserTreeSummary--withActions">
        <span className="BrowserTreeSummaryLabel">Open Editors</span>
        <span className="BrowserTreeSummaryActions">
          <BrowserSectionActionButton
            ariaLabel="Open new editor"
            disabled={!canOpenNewEditor}
            label="+"
            onClick={onOpenNewEditor}
            title="New Editor"
          />
        </span>
      </summary>
      <div className="BrowserTreeSectionNote">
        Tracks editor sessions. The workspace currently shows the active editor surface.
      </div>
      <div className="BrowserTreeGroup">
        {viewportRows.length === 0 ? (
          <div className="BrowserTreeEmpty">No open editors.</div>
        ) : (
          viewportRows.map((viewport) => (
            <BrowserTreeRowShell key={viewport.rowId} row={viewport} {...rowHandlers} />
          ))
        )}
      </div>
    </details>
  )
}
