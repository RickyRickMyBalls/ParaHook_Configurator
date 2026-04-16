import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react'
import { TitleStatusBar } from '../components/TitleStatusBar'

type PrimaryViewportLeftDockProps = {
  viewportId: string
  leftDockWidth: number
  bottomInset: string
  isConstrained: boolean
  isViewportSplitHandleConstrained: boolean
  isLeftDockViewportSplit: boolean
  isBrowserDockPreviewActive: boolean
  isMeatballDockPreviewActive: boolean
  isMeatballDockOccupied: boolean
  dockedBrowserHostRef: RefObject<HTMLDivElement | null>
  dockedMeatballHostRef: RefObject<HTMLDivElement | null>
  onResizeStart: (event: ReactPointerEvent<HTMLDivElement>) => void
  onResizeContextMenu: (event: ReactMouseEvent<HTMLDivElement>) => void
}

export function PrimaryViewportLeftDock(props: PrimaryViewportLeftDockProps) {
  const {
    viewportId,
    leftDockWidth,
    bottomInset,
    isConstrained,
    isViewportSplitHandleConstrained,
    isLeftDockViewportSplit,
    isBrowserDockPreviewActive,
    isMeatballDockPreviewActive,
    isMeatballDockOccupied,
    dockedBrowserHostRef,
    dockedMeatballHostRef,
    onResizeStart,
    onResizeContextMenu,
  } = props

  return (
    <aside
      className="PrimaryViewportLeftDock"
      style={{
        width: `${leftDockWidth}px`,
        minWidth: `${leftDockWidth}px`,
        maxWidth: `${leftDockWidth}px`,
        bottom: bottomInset,
      }}
    >
      <div className="PrimaryViewportLeftDockContent">
        <div
          className="PrimaryViewportLeftDockStatus"
          data-left-dock-shared-width={`${leftDockWidth}`}
        >
          <TitleStatusBar viewportId={viewportId} />
        </div>
        <div
          className={`PrimaryViewportLeftDockPanelStackShell ${isConstrained ? 'isConstrained' : ''}`}
        >
          <div className={`PanelStack ${isConstrained ? 'isConstrained' : ''}`}>
            <div
              ref={dockedBrowserHostRef}
              className={`PrimaryViewportLeftDockPanelTarget PrimaryViewportLeftDockPanelTarget--browser ${
                isBrowserDockPreviewActive ? 'isPreviewActive' : ''
              }`}
              data-left-dock-shared-width={`${leftDockWidth}`}
            >
              <div
                className="PrimaryViewportLeftDockPanelGhostSlot"
                aria-hidden={!isBrowserDockPreviewActive}
              >
                <div className="PrimaryViewportLeftDockPanelGhost">Browser Dock Target</div>
              </div>
            </div>
            <div
              ref={dockedMeatballHostRef}
              className={`PrimaryViewportLeftDockPanelTarget PrimaryViewportLeftDockPanelTarget--meatball-editor ${
                isMeatballDockOccupied ? 'isOccupied' : ''
              } ${
                isMeatballDockPreviewActive ? 'isPreviewActive' : ''
              }`}
            >
              <div
                className="PrimaryViewportLeftDockPanelGhostSlot"
                aria-hidden={!isMeatballDockPreviewActive}
              >
                <div className="PrimaryViewportLeftDockPanelGhost">Meatball Dock Target</div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`PrimaryViewportLeftDockResizeHandle ${
            isViewportSplitHandleConstrained ? 'isViewportSplit' : ''
          } ${isLeftDockViewportSplit ? 'isSlotSplitActive' : ''}`}
          onPointerDown={onResizeStart}
          onContextMenu={onResizeContextMenu}
          aria-hidden="true"
        />
      </div>
    </aside>
  )
}
