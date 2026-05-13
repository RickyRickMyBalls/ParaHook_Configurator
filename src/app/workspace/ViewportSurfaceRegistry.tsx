import { ConsoleDock } from '../console/ConsoleDock'
import { BrowserPanel } from '../panels/BrowserPanel'
import { SpaghettiPanel } from '../panels/SpaghettiPanel'
import { selectEditorViewportById, useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { NotepadSurface } from '../notepad/NotepadSurface'
import { CatalogSurface } from './CatalogSurface'
import { DashboardSurface } from './DashboardSurface'
import { EditHistoryReaderSurface } from './EditHistoryReaderSurface'
import { HomePageSurface } from './HomePageSurface'
import { PropertiesSurface } from './PropertiesSurface'
import { SettingsSurface, type SettingsSectionId } from './SettingsSurface'
import {
  getWorkspaceSurfaceRenderFamily,
} from './workspaceSurfaceCatalog'
import { useWorkspaceStore } from './useWorkspaceStore'
import { cycleBrowserPresentationModeWithHistory } from '../store/workspaceLayoutEditHistory'
import type { WorkspaceSurfaceKind, WorkspaceViewportSlotId } from './workspaceShellTypes'

type ViewportSurfaceRegistryProps = {
  slotId: WorkspaceViewportSlotId
  surfaceKind: WorkspaceSurfaceKind
  surfaceInstanceId: string
  onOpenDashboardNoteInNotepad?: (surfaceInstanceId: string, noteId: string) => void
  onOpenHomePageSurface?: (surfaceKind: WorkspaceSurfaceKind) => void
  onOpenSettings?: (initialSectionId?: SettingsSectionId) => void
  onActivateSpaghettiSurface: (
    editorViewportId?: string,
    target?: {
      graphDocumentId?: string | null
      nodeId?: string | null
      mode?: 'graph' | 'node'
    },
  ) => void
  spaghettiWindowSettingsOpen?: boolean
  settingsInitialSectionId?: import('./SettingsSurface').SettingsSectionId
}

export function ViewportSurfaceRegistry(props: ViewportSurfaceRegistryProps) {
  const {
    slotId,
    surfaceKind,
    surfaceInstanceId,
    onOpenDashboardNoteInNotepad,
    onOpenHomePageSurface,
    onOpenSettings,
    onActivateSpaghettiSurface,
    spaghettiWindowSettingsOpen = false,
    settingsInitialSectionId = 'all',
  } = props
  const editorViewport = useSpaghettiStore((state) =>
    selectEditorViewportById(state, surfaceInstanceId),
  )
  const browserPresentationMode = useWorkspaceStore((state) => state.browserShell.presentationMode)
  const renderFamily = getWorkspaceSurfaceRenderFamily(surfaceKind)

  if (renderFamily === 'browser') {
    return (
      <div
        className="BrowserViewportSplitHost WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--browser"
        data-workspace-slot-id={slotId}
        data-workspace-surface-instance-id={surfaceInstanceId}
      >
        <BrowserPanel
          presentationMode={browserPresentationMode}
          onCyclePresentationMode={() =>
            cycleBrowserPresentationModeWithHistory(browserPresentationMode)
          }
          showTitleBar={false}
        />
      </div>
    )
  }

  if (renderFamily === 'console') {
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

  if (renderFamily === 'spaghettiEditor') {
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

  if (renderFamily === 'dashboard') {
    return (
      <DashboardSurface
        surfaceInstanceId={surfaceInstanceId}
        onOpenNoteInNotepad={(noteId) => onOpenDashboardNoteInNotepad?.(surfaceInstanceId, noteId)}
      />
    )
  }

  if (renderFamily === 'catalog') {
    return <CatalogSurface slotId={slotId} surfaceInstanceId={surfaceInstanceId} />
  }

  if (renderFamily === 'notepad') {
    return <NotepadSurface surfaceInstanceId={surfaceInstanceId} />
  }

  if (renderFamily === 'homePage') {
    return (
      <HomePageSurface
        slotId={slotId}
        surfaceInstanceId={surfaceInstanceId}
        onOpenSurface={onOpenHomePageSurface}
        onOpenSettings={onOpenSettings}
      />
    )
  }

  if (renderFamily === 'settings') {
    return (
      <SettingsSurface
        slotId={slotId}
        surfaceInstanceId={surfaceInstanceId}
        initialSectionId={settingsInitialSectionId}
      />
    )
  }

  if (renderFamily === 'properties') {
    return <PropertiesSurface slotId={slotId} surfaceInstanceId={surfaceInstanceId} />
  }

  if (renderFamily === 'editHistory') {
    return <EditHistoryReaderSurface surfaceInstanceId={surfaceInstanceId} />
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
