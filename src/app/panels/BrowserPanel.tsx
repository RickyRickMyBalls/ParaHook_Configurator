import {
  useState,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
} from 'react'
import { defaultViewportPosition } from '../spaghetti/store/useSpaghettiStore'
import {
  BrowserContentSection,
  BrowserGraphDocumentsSection,
  BrowserOpenEditorsSection,
} from './browserTreeSections'
import {
  BrowserImportDialog,
  BrowserImportMenu,
  BrowserRowContextMenu,
} from './browserTreeMenus'
import { useBrowserPanelController } from './useBrowserPanelController'
import type { BrowserPresentationMode } from '../workspace/workspaceShellTypes'

type BrowserPanelProps = {
  presentationMode?: BrowserPresentationMode
  onCyclePresentationMode?: () => void
  isCollapsed?: boolean
  onToggleCollapsed?: () => void
  showTitleBar?: boolean
  isFloating?: boolean
  isPoppedOut?: boolean
  popoutButtonMode?: 'popout' | 'dock'
  showQuickDockButton?: boolean
  onQuickDock?: () => void
  onTogglePopout?: () => void
  onTitleBarPointerDown?: (event: ReactPointerEvent<HTMLDivElement>) => void
  onTitleBarContextMenu?: (event: ReactMouseEvent<HTMLDivElement>) => void
  onWheelCapture?: (event: ReactWheelEvent<HTMLElement>) => void
  newEditorSpawnPosition?: { x: number; y: number }
}

export function BrowserPanel({
  presentationMode,
  onCyclePresentationMode,
  isCollapsed: controlledIsCollapsed,
  onToggleCollapsed,
  showTitleBar = true,
  isFloating = false,
  isPoppedOut = false,
  popoutButtonMode = isPoppedOut ? 'dock' : 'popout',
  showQuickDockButton = false,
  onQuickDock,
  onTogglePopout,
  onTitleBarPointerDown,
  onTitleBarContextMenu,
  onWheelCapture,
  newEditorSpawnPosition = defaultViewportPosition,
}: BrowserPanelProps = {}) {
  const [localPresentationMode, setLocalPresentationMode] =
    useState<BrowserPresentationMode>('expanded')
  const resolvedPresentationMode =
    presentationMode ??
    (controlledIsCollapsed !== undefined
      ? controlledIsCollapsed
        ? 'collapsed'
        : 'expanded'
      : localPresentationMode)
  const isBrowserCollapsed = resolvedPresentationMode === 'collapsed'
  const isBrowserEssentials = resolvedPresentationMode === 'essentials'
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
    if (onCyclePresentationMode !== undefined) {
      onCyclePresentationMode()
      return
    }
    if (onToggleCollapsed !== undefined) {
      onToggleCollapsed()
      return
    }
    setLocalPresentationMode((current) =>
      current === 'expanded' ? 'essentials' : current === 'essentials' ? 'collapsed' : 'expanded',
    )
  }

  const handlePopoutBrowser = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    bodyHandlers.closeBrowserOverlays()
    onTogglePopout?.()
  }

  const handleQuickDockBrowser = (event: ReactMouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    bodyHandlers.closeBrowserOverlays()
    onQuickDock?.()
  }

  const stopTitleBarPointer = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.stopPropagation()
  }

  return (
    <section
      className={`V15Panel BrowserPanelRoot ${isFloating ? 'isFloating' : ''} ${
        isPoppedOut ? 'isPoppedOut' : ''
      } ${showTitleBar ? '' : 'isHeaderless'} ${
        isBrowserCollapsed ? 'isCollapsed' : ''
      }`}
      onPointerDownCapture={bodyHandlers.onActivateBrowserSurface}
      onWheelCapture={onWheelCapture}
    >
      {showTitleBar ? (
        <div
          className={`BrowserPanelTitleBar ${isBrowserCollapsed ? 'isCollapsed' : ''}`}
          onContextMenu={onTitleBarContextMenu}
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
              title={
                resolvedPresentationMode === 'expanded'
                  ? 'Browser essentials'
                  : resolvedPresentationMode === 'essentials'
                    ? 'Collapse browser'
                    : 'Expand browser'
              }
            >
              {resolvedPresentationMode === 'expanded'
                ? '-'
                : resolvedPresentationMode === 'essentials'
                  ? 'e'
                  : '+'}
            </button>
            <h3 className="BrowserPanelTitle">Browser</h3>
          </div>
          <div className="BrowserPanelTitleBarActions">
            {showQuickDockButton ? (
              <button
                type="button"
                className="BrowserPanelChromeButton BrowserPanelQuickDockButton"
                onPointerDown={stopTitleBarPointer}
                onClick={handleQuickDockBrowser}
                aria-label="Quick dock browser"
                title="Quick dock browser"
              >
                {'<'}
              </button>
            ) : null}
            <button
              type="button"
              className="BrowserPanelChromeButton BrowserPanelPopoutButton"
              onPointerDown={stopTitleBarPointer}
              onClick={handlePopoutBrowser}
              aria-label={popoutButtonMode === 'dock' ? 'Dock browser' : 'Pop out browser'}
              title={popoutButtonMode === 'dock' ? 'Dock browser' : 'Pop out browser'}
            >
              ↗
            </button>
          </div>
        </div>
      ) : null}
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
                contentBuildPolicy={sectionHandlers.contentBuildPolicy}
                contentRows={browserTreeRows.contentRows}
                onCycleContentBuildPolicy={sectionHandlers.onCycleContentBuildPolicy}
                rowHandlers={rowHandlers}
                registerContentRowElement={sectionHandlers.registerContentRowElement}
                onOpenContentImportMenu={sectionHandlers.onOpenContentImportMenu}
              />
              <BrowserGraphDocumentsSection
                isCollapsed={isBrowserEssentials}
                graphRows={browserTreeRows.graphRows}
                rowHandlers={rowHandlers}
                onCreateGraph={sectionHandlers.onCreateGraph}
                onDuplicateFocusedGraph={sectionHandlers.onDuplicateFocusedGraph}
                onLoadGraphFile={sectionHandlers.onLoadGraphFile}
              />
              <BrowserOpenEditorsSection
                isCollapsed={isBrowserEssentials}
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
        onOpenImportFiles={overlay.onOpenImportFiles}
        onImportReferenceFile={overlay.onImportReferenceFile}
        style={overlay.importMenuStyle}
      />
      <BrowserImportDialog
        draft={overlay.stagedImportDraft}
        previewRows={overlay.stagedImportPreviewRows}
        isBrowsing={overlay.isBrowsingImportFiles}
        onBrowse={overlay.onBrowseImportFiles}
        onSetImportMode={overlay.onSetStagedImportFileMode}
        onSetUpAxis={overlay.onSetStagedImportFileUpAxis}
        onSetScaleAlignment={overlay.onSetStagedImportFileScaleAlignment}
        onSetPutAcceptedInNewAssembly={overlay.onSetStagedImportPutAcceptedInNewAssembly}
        onCreatePreviewAssembly={overlay.onCreateStagedImportPreviewAssembly}
        onCreatePreviewComponent={overlay.onCreateStagedImportPreviewComponent}
        registerPreviewRowElement={overlay.registerStagedImportPreviewRowElement}
        onPreviewRowPointerDown={overlay.onStagedImportPreviewRowPointerDown}
        getPreviewRowDragState={overlay.getStagedImportPreviewRowDragState}
        onCommit={overlay.onCommitStagedImportDraft}
        onClose={overlay.onCloseImportDialog}
      />
    </section>
  )
}
