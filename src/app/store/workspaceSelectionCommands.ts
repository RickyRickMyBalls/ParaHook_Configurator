import type {
  ConsoleContextSyncReason,
  ConsoleWorkspaceContextHandoff,
  WorkspaceSelectedTarget,
  WorkspaceSurface,
} from './useAppStore'
import {
  captureEnvironmentLookHistorySnapshot,
  commitEnvironmentLookHistory,
} from './environmentLookEditHistory'
import { useUiPrefsStore } from './uiPrefsStore'

export type WorkspaceTargetSelectionCommandDeps = {
  setWorkspaceSelectedTarget: (target: WorkspaceSelectedTarget | null) => void
  selectLight?: (lightId: string | null) => void
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
  selectLight?: (lightId: string | null) => void
  selectPart?: (partKey: string | null) => void
  setActiveSurface?: (surface: WorkspaceSurface | null) => void
  requestConsoleContextSync?: (reason: ConsoleContextSyncReason) => void
  requestConsoleWorkspaceContextHandoff?: (
    handoff: Omit<ConsoleWorkspaceContextHandoff, 'seq'>,
  ) => void
}

export type WorkspaceSelectedEnvironmentLightDeleteCommandDeps = WorkspaceTargetSelectionCommandDeps & {
  deleteLight: (lightId: string) => void
}

export type WorkspaceSelectedEnvironmentLightDeleteResult = {
  deletedTarget: Extract<WorkspaceSelectedTarget, { kind: 'environment-light' }>
  nextSelectedTarget: WorkspaceSelectedTarget | null
}

type WorkspaceSelectionCommandOptions = {
  selectedPartKey?: string | null
  activeSurface?: WorkspaceSurface | null
  syncReason?: ConsoleContextSyncReason
}

const applySharedWorkspaceSelectionSideEffects = (
  deps: {
    selectLight?: (lightId: string | null) => void
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
  deps.selectLight?.(target?.kind === 'environment-light' ? target.lightId : null)
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

export const deleteWorkspaceSelectedEnvironmentLight = (
  deps: WorkspaceSelectedEnvironmentLightDeleteCommandDeps,
  target: Extract<WorkspaceSelectedTarget, { kind: 'environment-light' }>,
  options: WorkspaceSelectionCommandOptions = {},
): WorkspaceSelectedEnvironmentLightDeleteResult | null => {
  const currentLights = useUiPrefsStore.getState().view.lighting.lights
  if (!currentLights.some((light) => light.id === target.lightId)) {
    return null
  }

  deps.deleteLight(target.lightId)
  const nextSelectedLightId = useUiPrefsStore.getState().view.lighting.selectedLightId
  const nextSelectedTarget =
    nextSelectedLightId === null
      ? null
      : ({
          kind: 'environment-light',
          lightId: nextSelectedLightId,
        } as const)

  if (nextSelectedTarget === null) {
    clearWorkspaceTargetSelection(deps, options)
  } else {
    commitWorkspaceTargetSelection(deps, nextSelectedTarget, options)
  }

  return {
    deletedTarget: target,
    nextSelectedTarget,
  }
}

export const deleteWorkspaceSelectedEnvironmentLightWithHistory = (
  deps: WorkspaceSelectedEnvironmentLightDeleteCommandDeps,
  target: Extract<WorkspaceSelectedTarget, { kind: 'environment-light' }>,
  options: WorkspaceSelectionCommandOptions = {},
): WorkspaceSelectedEnvironmentLightDeleteResult | null => {
  const beforeSnapshot = captureEnvironmentLookHistorySnapshot()
  const result = deleteWorkspaceSelectedEnvironmentLight(deps, target, options)
  if (result === null) {
    return null
  }
  commitEnvironmentLookHistory(beforeSnapshot, {
    targetId: `environment-light:${target.lightId}:delete`,
    targetLabel: 'Environment light delete',
  })
  return result
}
