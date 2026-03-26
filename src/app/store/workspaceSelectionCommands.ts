import type {
  ConsoleContextSyncReason,
  WorkspaceSelectedTarget,
  WorkspaceSurface,
} from './useAppStore'

export type WorkspaceTargetSelectionCommandDeps = {
  setWorkspaceSelectedTarget: (target: WorkspaceSelectedTarget | null) => void
  selectPart?: (partKey: string | null) => void
  setActiveSurface?: (surface: WorkspaceSurface | null) => void
  requestConsoleContextSync?: (reason: ConsoleContextSyncReason) => void
}

export type WorkspaceExplicitSelectionCommit = {
  selectedTarget: WorkspaceSelectedTarget | null
  explicitSelectedTargets: WorkspaceSelectedTarget[]
  selectionAnchorTarget: WorkspaceSelectedTarget | null
}

export type WorkspaceExplicitSelectionCommandDeps = {
  setWorkspaceExplicitSelection: (selection: WorkspaceExplicitSelectionCommit) => void
  selectPart?: (partKey: string | null) => void
  setActiveSurface?: (surface: WorkspaceSurface | null) => void
  requestConsoleContextSync?: (reason: ConsoleContextSyncReason) => void
}

type WorkspaceSelectionCommandOptions = {
  selectedPartKey?: string | null
  activeSurface?: WorkspaceSurface | null
  syncReason?: ConsoleContextSyncReason
}

const applySharedWorkspaceSelectionSideEffects = (
  deps: {
    selectPart?: (partKey: string | null) => void
    setActiveSurface?: (surface: WorkspaceSurface | null) => void
    requestConsoleContextSync?: (reason: ConsoleContextSyncReason) => void
  },
  options: WorkspaceSelectionCommandOptions,
): void => {
  if (options.activeSurface !== undefined) {
    deps.setActiveSurface?.(options.activeSurface)
  }
  if (options.selectedPartKey !== undefined) {
    deps.selectPart?.(options.selectedPartKey)
  }
  deps.requestConsoleContextSync?.(options.syncReason ?? 'target-selection')
}

export const commitWorkspaceTargetSelection = (
  deps: WorkspaceTargetSelectionCommandDeps,
  target: WorkspaceSelectedTarget | null,
  options: WorkspaceSelectionCommandOptions = {},
): WorkspaceSelectedTarget | null => {
  deps.setWorkspaceSelectedTarget(target)
  applySharedWorkspaceSelectionSideEffects(deps, options)
  return target
}

export const clearWorkspaceTargetSelection = (
  deps: WorkspaceTargetSelectionCommandDeps,
  options: Omit<WorkspaceSelectionCommandOptions, 'selectedPartKey'> = {},
): WorkspaceSelectedTarget | null =>
  commitWorkspaceTargetSelection(deps, null, {
    ...options,
    selectedPartKey: null,
  })

export const commitWorkspaceExplicitSelection = (
  deps: WorkspaceExplicitSelectionCommandDeps,
  selection: WorkspaceExplicitSelectionCommit,
  options: WorkspaceSelectionCommandOptions = {},
): WorkspaceSelectedTarget | null => {
  deps.setWorkspaceExplicitSelection(selection)
  applySharedWorkspaceSelectionSideEffects(deps, options)
  return selection.selectedTarget
}
