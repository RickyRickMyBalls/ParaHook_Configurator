import type { MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent, RefObject } from 'react'
import { TitleStatusBar } from '../components/TitleStatusBar'

const leftDockStackDividerSize = 10

type PrimaryViewportLeftDockProps = {
  viewportId: string
  leftDockWidth: number
  leftDockStackHeight: number
  leftDockStackSplitRatio: number
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
    leftDockStackHeight,
    leftDockStackSplitRatio,
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
  const isLowerPanelActive = isMeatballDockOccupied
  const browserPanelHeight = isLowerPanelActive
    ? Math.max(
        120,
        Math.round(
          (leftDockStackHeight - leftDockStackDividerSize) * leftDockStackSplitRatio,
        ),
      )
    : leftDockStackHeight
  const meatballPanelHeight = isLowerPanelActive
    ? Math.max(
        120,
        leftDockStackHeight - browserPanelHeight - leftDockStackDividerSize,
      )
    : 0
  const panelStackShellStyle = isLowerPanelActive
    ? {
        height: `${leftDockStackHeight}px`,
        minHeight: `${leftDockStackHeight}px`,
        maxHeight: `${leftDockStackHeight}px`,
      }
    : {
        maxHeight: `min(${leftDockStackHeight}px, 100%)`,
      }
  const browserPanelTargetStyle = isLowerPanelActive
    ? {
        height: `${browserPanelHeight}px`,
        minHeight: `${browserPanelHeight}px`,
        maxHeight: `${browserPanelHeight}px`,
      }
    : undefined

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
          data-left-dock-stack-height={`${leftDockStackHeight}`}
          style={panelStackShellStyle}
        >
          <div className={`PanelStack ${isConstrained ? 'isConstrained' : ''}`}>
            <div
              ref={dockedBrowserHostRef}
              className={`PrimaryViewportLeftDockPanelTarget PrimaryViewportLeftDockPanelTarget--browser ${
                isLowerPanelActive ? 'isStackSized' : ''
              } ${
                isBrowserDockPreviewActive ? 'isPreviewActive' : ''
              }`}
              data-left-dock-shared-width={`${leftDockWidth}`}
              data-left-dock-panel-height={`${browserPanelHeight}`}
              style={browserPanelTargetStyle}
            >
              <div
                className="PrimaryViewportLeftDockPanelGhostSlot"
                aria-hidden={!isBrowserDockPreviewActive}
              >
                <div className="PrimaryViewportLeftDockPanelGhost">Browser Dock Target</div>
              </div>
            </div>
            {isLowerPanelActive ? (
              <div
                className="PrimaryViewportLeftDockStackDivider"
                data-left-dock-split-ratio={`${leftDockStackSplitRatio}`}
                onPointerDown={onResizeStart}
                data-left-dock-resize-target="stack-split"
                aria-hidden="true"
              />
            ) : null}
            <div
              ref={dockedMeatballHostRef}
              className={`PrimaryViewportLeftDockPanelTarget PrimaryViewportLeftDockPanelTarget--meatball-editor ${
                isMeatballDockOccupied ? 'isOccupied' : ''
              } ${
                isMeatballDockPreviewActive ? 'isPreviewActive' : ''
              }`}
              data-left-dock-panel-height={`${meatballPanelHeight}`}
              style={
                isLowerPanelActive
                  ? {
                      height: `${meatballPanelHeight}px`,
                      minHeight: `${meatballPanelHeight}px`,
                      maxHeight: `${meatballPanelHeight}px`,
                    }
                  : undefined
              }
            >
              <div
                className="PrimaryViewportLeftDockPanelGhostSlot"
                aria-hidden={!isMeatballDockPreviewActive}
              >
                <div className="PrimaryViewportLeftDockPanelGhost">Meatball Dock Target</div>
              </div>
            </div>
          </div>
          <div
            className="PrimaryViewportLeftDockStackHeightHandle"
            onPointerDown={onResizeStart}
            data-left-dock-resize-target="stack-height"
            aria-hidden="true"
          />
        </div>
        <div
          className={`PrimaryViewportLeftDockResizeHandle ${
            isViewportSplitHandleConstrained ? 'isViewportSplit' : ''
          } ${isLeftDockViewportSplit ? 'isSlotSplitActive' : ''}`}
          onPointerDown={onResizeStart}
          onContextMenu={onResizeContextMenu}
          data-left-dock-resize-target="width"
          aria-hidden="true"
        />
      </div>
    </aside>
  )
}
