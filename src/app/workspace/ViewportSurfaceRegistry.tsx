import { ConsoleDock } from '../console/ConsoleDock'
import { BrowserPanel } from '../panels/BrowserPanel'
import { SpaghettiPanel } from '../panels/SpaghettiPanel'
import { selectEditorViewportById, useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { useWorkspaceStore } from './useWorkspaceStore'
import type { WorkspaceSurfaceKind, WorkspaceViewportSlotId } from './workspaceShellTypes'

type ViewportSurfaceRegistryProps = {
  slotId: WorkspaceViewportSlotId
  surfaceKind: WorkspaceSurfaceKind
  surfaceInstanceId: string
  onActivateSpaghettiSurface: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  spaghettiWindowSettingsOpen?: boolean
}

export function ViewportSurfaceRegistry(props: ViewportSurfaceRegistryProps) {
  const {
    slotId,
    surfaceKind,
    surfaceInstanceId,
    onActivateSpaghettiSurface,
    spaghettiWindowSettingsOpen = false,
  } = props
  const editorViewport = useSpaghettiStore((state) =>
    selectEditorViewportById(state, surfaceInstanceId),
  )
  const browserPresentationMode = useWorkspaceStore((state) => state.browserShell.presentationMode)
  const setBrowserPresentationMode = useWorkspaceStore((state) => state.setBrowserPresentationMode)

  if (surfaceKind === 'browser') {
    return (
      <div
        className="BrowserViewportSplitHost WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--browser"
        data-workspace-slot-id={slotId}
        data-workspace-surface-instance-id={surfaceInstanceId}
      >
        <BrowserPanel
          presentationMode={browserPresentationMode}
          onCyclePresentationMode={() =>
            setBrowserPresentationMode(
              browserPresentationMode === 'expanded'
                ? 'essentials'
                : browserPresentationMode === 'essentials'
                  ? 'collapsed'
                  : 'expanded',
            )
          }
          showTitleBar={false}
        />
      </div>
    )
  }

  if (surfaceKind === 'console') {
    return (
      <div
        className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--console"
        data-workspace-slot-id={slotId}
        data-workspace-surface-instance-id={surfaceInstanceId}
      >
        <ConsoleDock listLeftOffset={0} />
      </div>
    )
  }

  if (surfaceKind === 'spaghettiEditor') {
    return (
      <div
        className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--spaghetti"
        data-workspace-slot-id={slotId}
        data-workspace-surface-instance-id={surfaceInstanceId}
      >
        {editorViewport !== null ? (
          <SpaghettiPanel
            editorViewportId={editorViewport.editorViewportId}
            onActivateEditorContext={onActivateSpaghettiSurface}
            isWindowSettingsOpen={spaghettiWindowSettingsOpen}
          />
        ) : (
          <div className="WorkspaceViewportSlotPlaceholder">
            No editor surface is bound to this slot yet.
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--viewerPlaceholder"
      data-workspace-slot-id={slotId}
    >
      <div className="WorkspaceViewportSlotPlaceholder">
        Secondary model viewport runtime parity lands in `Workspace 7.3`.
      </div>
    </div>
  )
}
