import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  RefObject,
} from 'react'
import { PrimaryViewportLeftDock } from './PrimaryViewportLeftDock'
import { ViewportFrame, type ViewportFrameHeaderDragOutPayload } from './ViewportFrame'
import { ViewportSurfaceRegistry } from './ViewportSurfaceRegistry'
import { ViewportWorkspaceHost } from './ViewportWorkspaceHost'
import {
  defaultPrimaryViewportSlotId,
  type BrowserPresentationMode,
  type WorkspaceLayoutNode,
  type WorkspaceLayoutNodeId,
  type WorkspaceSurfaceKind,
  type WorkspaceViewportSlot,
  type WorkspaceViewportSlotId,
} from './workspaceShellTypes'
import { type WorkspaceSplitDockSide } from './workspaceSplitTypes'

type WorkspaceViewportTreeProps = {
  viewportSlotRootNodeId: WorkspaceLayoutNodeId
  viewportSlotsById: Record<string, WorkspaceViewportSlot>
  viewportLayoutNodesById: Record<string, WorkspaceLayoutNode>
  leftDockWidth: number
  primaryViewportSlotIsConstrained: boolean
  isLeftDockViewportSplit: boolean
  isBrowserDockPreviewActive: boolean
  isMeatballDockPreviewActive: boolean
  browserPresentationMode: BrowserPresentationMode
  isBrowserCollapsed: boolean
  windowSettingsOpenByViewportId: Record<string, boolean>
  dockedBrowserHostRef: RefObject<HTMLDivElement | null>
  dockedMeatballHostRef: RefObject<HTMLDivElement | null>
  onActivateSpaghettiSurface: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  onActivateViewerSurface: (viewportId: string) => void
  onOpenViewportSpawnMenu: (
    viewportId: string,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => void
  onCycleBrowserPresentationMode: () => void
  onRequestViewportSlotSurfaceKind: (
    slotId: WorkspaceViewportSlotId,
    surfaceKind: WorkspaceSurfaceKind,
  ) => void
  onOpenDashboardNoteInNotepad: (surfaceInstanceId: string, noteId: string) => void
  onSplitViewportSlot: (slotId: WorkspaceViewportSlotId, dockSide: WorkspaceSplitDockSide) => void
  onFloatViewportSlot: (slotId: WorkspaceViewportSlotId) => void
  onPopOutViewportSlot: (slotId: WorkspaceViewportSlotId) => void
  onCloseViewportSlot: (slotId: WorkspaceViewportSlotId) => void
  onViewportSlotHeaderDragOut: (
    slotId: WorkspaceViewportSlotId,
    payload: ViewportFrameHeaderDragOutPayload,
  ) => void
  onViewportLayoutDividerPointerDown: (
    nodeId: WorkspaceLayoutNodeId,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void
  onLeftDockResizeStart: (event: ReactPointerEvent<HTMLDivElement>) => void
  onLeftDockResizeContextMenu: (event: ReactMouseEvent<HTMLDivElement>) => void
  onLeftDockSplitTogglePointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => void
  onLeftDockSplitToggleClick: (event: ReactMouseEvent<HTMLButtonElement>) => void
  resolvePrimaryLeftDockBottomInset: (slotLeafNodeId: WorkspaceLayoutNodeId) => string
  splitDividerSize?: number
}

export function WorkspaceViewportTree(props: WorkspaceViewportTreeProps) {
  const {
    viewportSlotRootNodeId,
    viewportSlotsById,
    viewportLayoutNodesById,
    leftDockWidth,
    primaryViewportSlotIsConstrained,
    isLeftDockViewportSplit,
    isBrowserDockPreviewActive,
    isMeatballDockPreviewActive,
    browserPresentationMode,
    isBrowserCollapsed,
    windowSettingsOpenByViewportId,
    dockedBrowserHostRef,
    dockedMeatballHostRef,
    onActivateSpaghettiSurface,
    onActivateViewerSurface,
    onOpenViewportSpawnMenu,
    onCycleBrowserPresentationMode,
    onRequestViewportSlotSurfaceKind,
    onOpenDashboardNoteInNotepad,
    onSplitViewportSlot,
    onFloatViewportSlot,
    onPopOutViewportSlot,
    onCloseViewportSlot,
    onViewportSlotHeaderDragOut,
    onViewportLayoutDividerPointerDown,
    onLeftDockResizeStart,
    onLeftDockResizeContextMenu,
    onLeftDockSplitTogglePointerDown,
    onLeftDockSplitToggleClick,
    resolvePrimaryLeftDockBottomInset,
    splitDividerSize = 10,
  } = props

  const renderViewportSlot = (slotId: WorkspaceViewportSlotId): ReactNode => {
    const slot = viewportSlotsById[slotId] ?? null
    if (slot === null) {
      return null
    }
    const isPrimarySlot = slot.slotId === defaultPrimaryViewportSlotId

    return (
      <ViewportFrame
        key={slot.slotId}
        slotId={slot.slotId}
        surfaceKind={slot.surfaceKind}
        isPrimary={isPrimarySlot}
        onActivateSurface={
          slot.surfaceKind === 'spaghettiEditor'
            ? () => onActivateSpaghettiSurface(slot.surfaceInstanceId)
            : undefined
        }
        onPrimaryButtonClick={
          slot.surfaceKind === 'browser' ? onCycleBrowserPresentationMode : undefined
        }
        primaryButtonLabel={
          slot.surfaceKind === 'browser'
            ? browserPresentationMode === 'expanded'
              ? '-'
              : browserPresentationMode === 'essentials'
                ? 'e'
                : '+'
            : undefined
        }
        primaryButtonAriaLabel={
          slot.surfaceKind === 'browser'
            ? browserPresentationMode === 'expanded'
              ? 'Browser essentials'
              : browserPresentationMode === 'essentials'
                ? 'Collapse browser'
                : 'Expand browser'
            : undefined
        }
        primaryButtonTitle={
          slot.surfaceKind === 'browser'
            ? browserPresentationMode === 'expanded'
              ? 'Browser essentials'
              : browserPresentationMode === 'essentials'
                ? 'Collapse browser'
                : 'Expand browser'
            : undefined
        }
        primaryButtonExpanded={slot.surfaceKind === 'browser' ? !isBrowserCollapsed : undefined}
        onRequestSurfaceKind={(nextSurfaceKind) =>
          onRequestViewportSlotSurfaceKind(slot.slotId, nextSurfaceKind)
        }
        onSplitTop={() => onSplitViewportSlot(slot.slotId, 'top')}
        onSplitRight={() => onSplitViewportSlot(slot.slotId, 'right')}
        onSplitBottom={() => onSplitViewportSlot(slot.slotId, 'bottom')}
        onSplitLeft={() => onSplitViewportSlot(slot.slotId, 'left')}
        onFloat={isPrimarySlot ? undefined : () => onFloatViewportSlot(slot.slotId)}
        onPopOut={
          slot.surfaceKind === 'modelViewer' || !isPrimarySlot
            ? () => onPopOutViewportSlot(slot.slotId)
            : undefined
        }
        popOutButtonAriaLabel={
          isPrimarySlot && slot.surfaceKind === 'modelViewer'
            ? 'Open Model Viewport in new browser'
            : undefined
        }
        popOutButtonTitle={
          isPrimarySlot && slot.surfaceKind === 'modelViewer' ? 'Open in new browser' : undefined
        }
        onClose={isPrimarySlot ? undefined : () => onCloseViewportSlot(slot.slotId)}
        onHeaderDragOut={
          !isPrimarySlot && slot.surfaceKind !== 'modelViewer'
            ? (payload) => onViewportSlotHeaderDragOut(slot.slotId, payload)
            : undefined
        }
      >
        {slot.surfaceKind === 'modelViewer' ? (
          <>
            {isPrimarySlot ? (
              <PrimaryViewportLeftDock
                leftDockWidth={leftDockWidth}
                bottomInset={resolvePrimaryLeftDockBottomInset(slot.leafNodeId)}
                isConstrained={primaryViewportSlotIsConstrained}
                isViewportSplitHandleConstrained={false}
                isLeftDockViewportSplit={isLeftDockViewportSplit}
                isBrowserDockPreviewActive={isBrowserDockPreviewActive}
                isMeatballDockPreviewActive={isMeatballDockPreviewActive}
                dockedBrowserHostRef={dockedBrowserHostRef}
                dockedMeatballHostRef={dockedMeatballHostRef}
                onResizeStart={onLeftDockResizeStart}
                onResizeContextMenu={onLeftDockResizeContextMenu}
                onSplitTogglePointerDown={onLeftDockSplitTogglePointerDown}
                onSplitToggleClick={onLeftDockSplitToggleClick}
              />
            ) : null}
            <ViewportWorkspaceHost
              viewportId={slot.surfaceInstanceId}
              onActivateViewerSurface={onActivateViewerSurface}
              onViewportContextMenu={onOpenViewportSpawnMenu}
            />
          </>
        ) : (
          <ViewportSurfaceRegistry
            slotId={slot.slotId}
            surfaceKind={slot.surfaceKind}
            surfaceInstanceId={slot.surfaceInstanceId}
            onOpenDashboardNoteInNotepad={onOpenDashboardNoteInNotepad}
            onActivateSpaghettiSurface={onActivateSpaghettiSurface}
            spaghettiWindowSettingsOpen={windowSettingsOpenByViewportId[slot.surfaceInstanceId] ?? false}
          />
        )}
      </ViewportFrame>
    )
  }

  const renderViewportLayoutNode = (nodeId: WorkspaceLayoutNodeId): ReactNode => {
    const node = viewportLayoutNodesById[nodeId] ?? null
    if (node === null) {
      return null
    }
    if (node.kind === 'leaf') {
      return renderViewportSlot(node.slotId)
    }
    const splitDirectionClass = node.splitDirection === 'vertical' ? 'isVertical' : 'isHorizontal'
    const splitDockSideClass =
      node.splitDockSide === 'left'
        ? 'isEditorLeft'
        : node.splitDockSide === 'right'
          ? 'isEditorRight'
          : node.splitDockSide === 'top'
            ? 'isEditorTop'
            : 'isEditorBottom'
    const splitRatio = node.ratio
    const firstChildArea =
      node.splitDirection === 'vertical'
        ? node.splitDockSide === 'left'
          ? 'editor'
          : 'viewer'
        : node.splitDockSide === 'top'
          ? 'editor'
          : 'viewer'
    const secondChildArea = firstChildArea === 'editor' ? 'viewer' : 'editor'

    return (
      <div
        key={node.nodeId}
        className={`ViewportSplitLayout ${splitDirectionClass} ${splitDockSideClass}`}
        style={{
          gridTemplateColumns:
            node.splitDirection === 'vertical'
              ? node.splitDockSide === 'left'
                ? `${splitRatio}fr ${splitDividerSize}px ${1 - splitRatio}fr`
                : `${1 - splitRatio}fr ${splitDividerSize}px ${splitRatio}fr`
              : 'minmax(0, 1fr)',
          gridTemplateRows:
            node.splitDirection === 'vertical'
              ? 'minmax(0, 1fr)'
              : node.splitDockSide === 'top'
                ? `${splitRatio}fr ${splitDividerSize}px ${1 - splitRatio}fr`
                : `${1 - splitRatio}fr ${splitDividerSize}px ${splitRatio}fr`,
          gridTemplateAreas:
            node.splitDirection === 'vertical'
              ? node.splitDockSide === 'left'
                ? '"editor divider viewer"'
                : '"viewer divider editor"'
              : node.splitDockSide === 'top'
                ? '"editor" "divider" "viewer"'
                : '"viewer" "divider" "editor"',
        }}
      >
        <div
          className={`ViewportSplitPane ${
            firstChildArea === 'viewer' ? 'ViewportSplitPane--viewer' : 'ViewportSplitPane--editor'
          }`}
          style={{ gridArea: firstChildArea }}
        >
          {renderViewportLayoutNode(node.firstChildId)}
        </div>
        <div className="ViewportSplitDividerShell" style={{ gridArea: 'divider' }}>
          <button
            type="button"
            className="ViewportSplitDivider"
            onPointerDown={(event) => onViewportLayoutDividerPointerDown(node.nodeId, event)}
            aria-label="Resize split view"
            title="Drag to resize split view"
          />
        </div>
        <div
          className={`ViewportSplitPane ${
            secondChildArea === 'viewer' ? 'ViewportSplitPane--viewer' : 'ViewportSplitPane--editor'
          }`}
          style={{ gridArea: secondChildArea }}
        >
          {renderViewportLayoutNode(node.secondChildId)}
        </div>
      </div>
    )
  }

  return <>{renderViewportLayoutNode(viewportSlotRootNodeId)}</>
}
