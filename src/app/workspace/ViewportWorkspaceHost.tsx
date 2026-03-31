import { useEffect } from 'react'
import { ViewToolbar } from '../components/ViewToolbar'
import { ViewerHost } from '../components/ViewerHost'
import { ViewportOverlay } from '../components/ViewportOverlay'
import { useWorkspaceStore } from './useWorkspaceStore'
import type { WorkspaceViewportId } from './workspaceShellTypes'

type ViewportWorkspaceHostProps = {
  viewportId: WorkspaceViewportId
  onActivateViewerSurface: (viewportId: WorkspaceViewportId) => void
}

export function ViewportWorkspaceHost(props: ViewportWorkspaceHostProps) {
  const { viewportId, onActivateViewerSurface } = props
  const ensureViewportChrome = useWorkspaceStore((state) => state.ensureViewportChrome)

  useEffect(() => {
    ensureViewportChrome(viewportId)
  }, [ensureViewportChrome, viewportId])

  return (
    <div
      className="ViewportWorkspaceHost"
      data-workspace-viewport-id={viewportId}
      onPointerDownCapture={() => onActivateViewerSurface(viewportId)}
    >
      <div className="ViewportViewerSurface" data-workspace-viewport-id={viewportId}>
        <ViewerHost viewportId={viewportId} />
      </div>
      <ViewportOverlay viewportId={viewportId} />
      <ViewToolbar viewportId={viewportId} />
    </div>
  )
}
