import type {
  ViewportPresentationSettings,
  ViewportPresentationStateId,
  ViewportPresentationStyleSettings,
  WorkspaceSelectionState,
  WorkspaceSelectedTarget,
  WorkspaceSurface,
} from '../useAppStore'

type ViewportPresentationState = {
  viewportPresentationSettings: ViewportPresentationSettings
}

type WorkspaceSelectionSource = {
  workspaceSelection: WorkspaceSelectionState
}

export const selectViewportPresentationSettings = (
  state: ViewportPresentationState,
): ViewportPresentationSettings => state.viewportPresentationSettings

export const selectViewportPresentationStyleSettings = (
  state: ViewportPresentationState,
  stateId: ViewportPresentationStateId,
): ViewportPresentationStyleSettings => state.viewportPresentationSettings[stateId]

export const selectWorkspaceSelection = (
  state: WorkspaceSelectionSource,
): WorkspaceSelectionState => state.workspaceSelection

export const selectWorkspaceSelectedTarget = (
  state: WorkspaceSelectionSource,
): WorkspaceSelectedTarget | null => state.workspaceSelection.selectedTarget

export const selectActiveWorkspaceSurface = (
  state: WorkspaceSelectionSource,
): WorkspaceSurface | null => state.workspaceSelection.activeSurface
