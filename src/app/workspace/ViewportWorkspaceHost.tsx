import type { CSSProperties, MouseEvent as ReactMouseEvent } from 'react'
import { useEffect } from 'react'
import { SpaghettiPanel } from '../panels/SpaghettiPanel'
import { BuildPathViewportDock } from '../buildPath/BuildPathSurface'
import { ViewToolbar } from '../components/ViewToolbar'
import { ViewerHost } from '../components/ViewerHost'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useWorkspaceStore } from './useWorkspaceStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import type { WorkspaceViewportId } from './workspaceShellTypes'

type ViewportWorkspaceHostProps = {
  viewportId: WorkspaceViewportId
  onActivateViewerSurface: (viewportId: WorkspaceViewportId) => void
  reserveBottomConsoleBar?: boolean
  onViewportContextMenu?: (
    viewportId: WorkspaceViewportId,
    event: ReactMouseEvent<HTMLDivElement>,
  ) => void
}

export function ViewportWorkspaceHost(props: ViewportWorkspaceHostProps) {
  const {
    viewportId,
    onActivateViewerSurface,
    reserveBottomConsoleBar = false,
    onViewportContextMenu,
  } = props
  const ensureViewportChrome = useWorkspaceStore((state) => state.ensureViewportChrome)
  const activeViewerViewportId = useWorkspaceStore((state) => state.activeViewerViewportId)
  const activeEditorViewportId = useSpaghettiStore((state) => state.activeEditorViewportId)
  const overlayModeByViewportId = useSpaghettiStore((state) => state.editorViewportOverlayModeById)
  const overlayCanvasHiddenByViewportId = useSpaghettiStore(
    (state) => state.editorViewportOverlayCanvasHiddenById,
  )
  const headerCollapsedByViewportId = useSpaghettiStore(
    (state) => state.editorViewportHeaderCollapsedById,
  )
  const canvasToolbarVisibleByViewportId = useSpaghettiStore(
    (state) => state.editorViewportCanvasToolbarVisibleById,
  )
  const setActiveEditorViewportId = useSpaghettiStore((state) => state.setActiveEditorViewportId)
  const overlayBackgroundOpacityByViewportId = useSpaghettiStore(
    (state) => state.editorViewportOverlayBackgroundOpacityById,
  )

  useEffect(() => {
    ensureViewportChrome(viewportId)
  }, [ensureViewportChrome, viewportId])

  const overlayEditorViewportId =
    viewportId === activeViewerViewportId &&
    activeEditorViewportId.length > 0 &&
    overlayModeByViewportId[activeEditorViewportId] === true
      ? activeEditorViewportId
      : null
  const overlayHeaderCollapsed =
    overlayEditorViewportId === null
      ? false
      : headerCollapsedByViewportId[overlayEditorViewportId] ?? true
  const overlayCanvasHidden =
    overlayEditorViewportId === null
      ? false
      : overlayCanvasHiddenByViewportId[overlayEditorViewportId] ?? false
  const overlayCanvasToolbarVisible =
    overlayEditorViewportId === null
      ? true
      : canvasToolbarVisibleByViewportId[overlayEditorViewportId] ?? false
  const overlayBackgroundOpacity =
    overlayEditorViewportId === null
      ? 0
      : overlayBackgroundOpacityByViewportId[overlayEditorViewportId] ?? 0

  return (
    <div
      className="ViewportWorkspaceHost"
      data-workspace-viewport-id={viewportId}
      data-bottom-console-bar-reserved={reserveBottomConsoleBar ? 'true' : 'false'}
      onPointerDownCapture={() => onActivateViewerSurface(viewportId)}
      onContextMenu={
        onViewportContextMenu === undefined
          ? undefined
          : (event) => {
              onViewportContextMenu(viewportId, event)
            }
      }
    >
      <div className="ViewportViewerSurface" data-workspace-viewport-id={viewportId}>
        <ViewerHost viewportId={viewportId} />
      </div>
      {overlayEditorViewportId !== null && !overlayCanvasHidden ? (
        <div
          className="ViewportSpaghettiOverlayRoot"
          data-workspace-viewport-id={viewportId}
          data-editor-viewport-id={overlayEditorViewportId}
        >
          <div
            className="ViewportSpaghettiOverlayPanel"
            data-overlay-background-opacity={overlayBackgroundOpacity.toFixed(2)}
            style={
              {
                '--sp-overlay-background-opacity': `${overlayBackgroundOpacity}`,
              } as CSSProperties
            }
            onPointerDownCapture={() => {
              setActiveEditorViewportId(overlayEditorViewportId)
            }}
          >
            <SpaghettiPanel
              editorViewportId={overlayEditorViewportId}
              activateOnPointerDownCapture
              isEssentials
              isHeaderCollapsed={overlayHeaderCollapsed}
              isCanvasToolbarVisible={overlayCanvasToolbarVisible}
            />
          </div>
        </div>
      ) : null}
      <ViewportOverlay viewportId={viewportId} />
      <ViewToolbar viewportId={viewportId} />
      <BuildPathViewportDock placement="bottom" />
    </div>
  )
}
