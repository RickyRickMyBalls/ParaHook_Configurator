import {
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { defaultViewportPosition } from '../spaghetti/store/useSpaghettiStore'
import {
  BrowserContentSection,
  BrowserGraphDocumentsSection,
  BrowserOpenEditorsSection,
} from './browserTreeSections'
import { BrowserImportMenu, BrowserRowContextMenu } from './browserTreeMenus'
import { useBrowserPanelController } from './useBrowserPanelController'

type BrowserPanelProps = {
  isCollapsed?: boolean
  onToggleCollapsed?: () => void
  isFloating?: boolean
  onTogglePopout?: () => void
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void
  newEditorSpawnPosition?: { x: number; y: number }
}

export function BrowserPanel({
  isCollapsed: controlledIsCollapsed,
  onToggleCollapsed,
  isFloating = false,
  onTogglePopout,
  onTitleBarPointerDown,
  newEditorSpawnPosition = defaultViewportPosition,
}: BrowserPanelProps = {}) {
  const [localIsBrowserCollapsed, setLocalIsBrowserCollapsed] = useState(false)
  const isBrowserCollapsed = controlledIsCollapsed ?? localIsBrowserCollapsed
  const {
    browserTreeRows,
    canOpenNewEditor,
    rowHandlers,
    sectionHandlers,
    overlay,
    bodyHandlers,
  } = useBrowserPanelController({
    newEditorSpawnPosition,
  })

  const toggleBrowserCollapsed = () => {
    bodyHandlers.closeBrowserOverlays()
    if (onToggleCollapsed !== undefined) {
      onToggleCollapsed()
      return
    }
    setLocalIsBrowserCollapsed((current) => !current)
  }

  const handlePopoutBrowser = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    bodyHandlers.closeBrowserOverlays()
    onTogglePopout?.()
  }

  const stopTitleBarPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <section
      className={`V15Panel BrowserPanelRoot ${isFloating ? 'isFloating' : ''} ${
        isBrowserCollapsed ? 'isCollapsed' : ''
      }`}
      onPointerDownCapture={bodyHandlers.onActivateBrowserSurface}
    >
      <div
        className={`BrowserPanelTitleBar ${isBrowserCollapsed ? 'isCollapsed' : ''}`}
        onPointerDown={onTitleBarPointerDown}
      >
        <div className="BrowserPanelTitleCluster">
          <button
            type="button"
            className="BrowserPanelChromeButton BrowserPanelCollapseButton"
            onPointerDown={stopTitleBarPointer}
            onClick={toggleBrowserCollapsed}
            aria-label="Toggle browser panel"
            aria-expanded={!isBrowserCollapsed}
            aria-controls="browser-panel-body"
            title={isBrowserCollapsed ? 'Expand browser' : 'Collapse browser'}
          >
            {isBrowserCollapsed ? '+' : '-'}
          </button>
          <h3 className="BrowserPanelTitle">Browser</h3>
        </div>
        <button
          type="button"
          className="BrowserPanelChromeButton BrowserPanelPopoutButton"
          onPointerDown={stopTitleBarPointer}
          onClick={handlePopoutBrowser}
          aria-label={isFloating ? 'Dock browser' : 'Pop out browser'}
          title={isFloating ? 'Dock browser' : 'Pop out browser'}
        >
          []
        </button>
      </div>
      {!isBrowserCollapsed ? (
        <div
          id="browser-panel-body"
          className="BrowserPanelBody"
          onClick={bodyHandlers.onBrowserBodyClick}
        >
          <div className="BrowserTree" role="tree" aria-label="Project browser">
            <details open className="BrowserTreeSection BrowserTreeSection--root">
              <summary className="BrowserTreeSummary">Project Browser</summary>
              <BrowserContentSection
                referenceRows={browserTreeRows.referenceRows}
                contentRows={browserTreeRows.contentRows}
                rowHandlers={rowHandlers}
                onOpenContentImportMenu={sectionHandlers.onOpenContentImportMenu}
              />
              <BrowserGraphDocumentsSection
                graphRows={browserTreeRows.graphRows}
                rowHandlers={rowHandlers}
                onCreateGraph={sectionHandlers.onCreateGraph}
                onDuplicateFocusedGraph={sectionHandlers.onDuplicateFocusedGraph}
                onLoadGraphFile={sectionHandlers.onLoadGraphFile}
              />
              <BrowserOpenEditorsSection
                viewportRows={browserTreeRows.viewportRows}
                rowHandlers={rowHandlers}
                canOpenNewEditor={canOpenNewEditor}
                onOpenNewEditor={sectionHandlers.onOpenNewEditor}
              />
            </details>
          </div>
        </div>
      ) : null}
      <BrowserRowContextMenu
        contextMenu={overlay.contextMenu}
        menuRef={overlay.contextMenuRef}
        style={overlay.contextMenuStyle}
      />
      <BrowserImportMenu
        importMenu={overlay.importMenu}
        menuRef={overlay.importMenuRef}
        onImportReferenceFile={overlay.onImportReferenceFile}
        style={overlay.importMenuStyle}
      />
    </section>
  )
}
