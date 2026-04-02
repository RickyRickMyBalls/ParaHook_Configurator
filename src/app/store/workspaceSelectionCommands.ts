import type {
  ConsoleContextSyncReason,
  ConsoleWorkspaceContextHandoff,
  WorkspaceSelectedTarget,
  WorkspaceSurface,
} from './useAppStore'

export type WorkspaceTargetSelectionCommandDeps = {
  setWorkspaceSelectedTarget: (target: WorkspaceSelectedTarget | null) => void
  selectPart?: (partKey: string | null) => void
  setActiveSurface?: (surface: WorkspaceSurface | null) => void
  requestConsoleContextSync?: (reason: ConsoleContextSyncReason) => void
  requestConsoleWorkspaceContextHandoff?: (
    handoff: Omit<ConsoleWorkspaceContextHandoff, 'seq'>,
  ) => void
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
  requestConsoleWorkspaceContextHandoff?: (
    handoff: Omit<ConsoleWorkspaceContextHandoff, 'seq'>,
  ) => void
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
    requestConsoleWorkspaceContextHandoff?: (
      handoff: Omit<ConsoleWorkspaceContextHandoff, 'seq'>,
    ) => void
  },
  target: WorkspaceSelectedTarget | null,
  options: WorkspaceSelectionCommandOptions,
): void => {
  if (options.activeSurface !== undefined) {
    deps.setActiveSurface?.(options.activeSurface)
  }
  if (options.selectedPartKey !== undefined) {
    deps.selectPart?.(options.selectedPartKey)
  }
  deps.requestConsoleWorkspaceContextHandoff?.({
    sourceSurface: options.activeSurface ?? null,
    mode: 'selection',
    graphDocumentId:
      target?.kind === 'graph-document' || target?.kind === 'graph-node'
        ? target.graphDocumentId
        : null,
    nodeId: target?.kind === 'graph-node' ? target.nodeId : null,
    editorViewportId: null,
    selectedTarget: target,
  })
  deps.requestConsoleContextSync?.(options.syncReason ?? 'target-selection')
}

export const commitWorkspaceTargetSelection = (
  deps: WorkspaceTargetSelectionCommandDeps,
  target: WorkspaceSelectedTarget | null,
  options: WorkspaceSelectionCommandOptions = {},
): WorkspaceSelectedTarget | null => {
  deps.setWorkspaceSelectedTarget(target)
  applySharedWorkspaceSelectionSideEffects(deps, target, options)
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
  applySharedWorkspaceSelectionSideEffects(deps, selection.selectedTarget, options)
  return selection.selectedTarget
}
