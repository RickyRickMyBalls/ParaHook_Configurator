import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'
import type {
  BrowserGraphTreeRowVm,
  BrowserTreeRowsVm,
} from './selectBrowserTreeRows'
import { BrowserTreeRowShell, type BrowserTreeRowHandlers } from './browserTreeRowPresenter'

const BROWSER_CONTENT_ROW_FLIP_DURATION_MS = 180

function BrowserAnimatedContentRows(props: {
  contentRows: BrowserTreeRowsVm['contentRows']
  rowHandlers: BrowserTreeRowHandlers
  registerContentRowElement?: ((rowId: string) => (element: HTMLDivElement | null) => void) | undefined
}) {
  const { contentRows, registerContentRowElement, rowHandlers } = props
  const rowElementsByIdRef = useRef(new Map<string, HTMLDivElement>())
  const previousTopByRowIdRef = useRef(new Map<string, number>())
  const activeCleanupByRowIdRef = useRef(new Map<string, () => void>())
  const animationFrameIdsRef = useRef<number[]>([])

  const registerRowElement = useCallback(
    (rowId: string) => (element: HTMLDivElement | null) => {
      registerContentRowElement?.(rowId)(element)
      if (element === null) {
        rowElementsByIdRef.current.delete(rowId)
        return
      }
      rowElementsByIdRef.current.set(rowId, element)
    },
    [registerContentRowElement],
  )

  useEffect(() => {
    return () => {
      activeCleanupByRowIdRef.current.forEach((cleanup) => cleanup())
      activeCleanupByRowIdRef.current.clear()
      const cancelFrame =
        typeof window !== 'undefined' && typeof window.cancelAnimationFrame === 'function'
          ? window.cancelAnimationFrame.bind(window)
          : null
      animationFrameIdsRef.current.forEach((frameId) => {
        if (cancelFrame !== null) {
          cancelFrame(frameId)
        }
      })
      animationFrameIdsRef.current = []
    }
  }, [])

  useLayoutEffect(() => {
    const nextTopByRowId = new Map<string, number>()
    const scheduleAnimationFrame =
      typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function'
        ? window.requestAnimationFrame.bind(window)
        : (callback: FrameRequestCallback) =>
            window.setTimeout(() => callback(performance.now()), 0)

    contentRows.forEach((row) => {
      const element = rowElementsByIdRef.current.get(row.rowId)
      if (element === undefined) {
        return
      }
      const currentTop = element.getBoundingClientRect().top
      nextTopByRowId.set(row.rowId, currentTop)
      const previousTop = previousTopByRowIdRef.current.get(row.rowId)
      if (
        previousTop === undefined ||
        element.classList.contains('isDragging')
      ) {
        return
      }
      const deltaY = previousTop - currentTop
      if (Math.abs(deltaY) < 1) {
        return
      }

      activeCleanupByRowIdRef.current.get(row.rowId)?.()
      element.style.transition = 'none'
      element.style.transform = `translateY(${deltaY}px)`
      element.style.zIndex = '1'
      void element.getBoundingClientRect()

      const handleTransitionEnd = (event: TransitionEvent) => {
        if (event.propertyName !== 'transform') {
          return
        }
        cleanup()
      }

      const cleanup = () => {
        element.removeEventListener('transitionend', handleTransitionEnd)
        if (cleanupTimerId !== null) {
          window.clearTimeout(cleanupTimerId)
        }
        element.style.transition = ''
        element.style.transform = ''
        element.style.zIndex = ''
        activeCleanupByRowIdRef.current.delete(row.rowId)
      }

      let cleanupTimerId: number | null = null
      element.addEventListener('transitionend', handleTransitionEnd)
      const frameId = scheduleAnimationFrame(() => {
        element.style.transition = `transform ${BROWSER_CONTENT_ROW_FLIP_DURATION_MS}ms ease`
        element.style.transform = 'translateY(0px)'
        cleanupTimerId = window.setTimeout(
          cleanup,
          BROWSER_CONTENT_ROW_FLIP_DURATION_MS + 40,
        )
      })
      animationFrameIdsRef.current.push(frameId)
      activeCleanupByRowIdRef.current.set(row.rowId, cleanup)
    })

    previousTopByRowIdRef.current = nextTopByRowId
  }, [contentRows])

  return (
    <div className="BrowserAnimatedContentRows">
      {contentRows.map((row) => (
        <div key={row.rowId}>
          <BrowserTreeRowShell
            row={row}
            rowRef={registerRowElement(row.rowId)}
            {...rowHandlers}
          />
        </div>
      ))}
    </div>
  )
}

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
  contentRows: BrowserTreeRowsVm['contentRows']
  rowHandlers: BrowserTreeRowHandlers
  registerContentRowElement?: ((rowId: string) => (element: HTMLDivElement | null) => void) | undefined
  onOpenContentImportMenu: (event: ReactMouseEvent<HTMLButtonElement>) => void
}

export function BrowserContentSection(props: BrowserContentSectionProps) {
  const {
    contentRows,
    onOpenContentImportMenu,
    registerContentRowElement,
    rowHandlers,
  } = props

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
        {contentRows.length === 0 ? (
          <div className="BrowserTreeEmpty">No project content.</div>
        ) : (
          <>
            <BrowserAnimatedContentRows
              contentRows={contentRows}
              rowHandlers={rowHandlers}
              registerContentRowElement={registerContentRowElement}
            />
            {contentRows.length === 1 &&
            contentRows[0]?.rowKind === 'assembly' &&
            !contentRows[0].isExpandable &&
            contentRows[0].referenceContainerKind !== 'root' ? (
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
