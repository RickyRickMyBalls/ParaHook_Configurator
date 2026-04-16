import {
  buildObjectPartKeys,
  resolveReferenceIdsForWorkspaceTarget,
  useAppStore,
} from './store/useAppStore'

type AppState = ReturnType<typeof useAppStore.getState>

export type ZoomObjectTarget =
  | {
      kind: 'part'
      partKey: string
    }
  | {
      kind: 'reference'
      referenceId: string
    }

export const resolveSelectedReferenceIdForZoom = (appState: AppState): string | null => {
  const selectedTarget = appState.workspaceSelection.selectedTarget
  if (selectedTarget !== null) {
    const resolvedReferenceIds = resolveReferenceIdsForWorkspaceTarget(appState, selectedTarget)
    if (resolvedReferenceIds.length === 1) {
      return resolvedReferenceIds[0]
    }
  }
  return appState.referenceWorkspace.activeReferenceTransformSession?.referenceId ?? null
}

export const resolveSelectedObjectPartKeyForZoom = (appState: AppState): string | null => {
  if (appState.selectedPartKey !== null) {
    return appState.selectedPartKey
  }
  const explicitObjectTarget =
    appState.workspaceSelection.explicitSelectedTargets.find((target) => target.kind === 'object') ??
    null
  const selectedTarget =
    appState.workspaceSelection.selectedTarget?.kind === 'object'
      ? appState.workspaceSelection.selectedTarget
      : explicitObjectTarget?.kind === 'object'
        ? explicitObjectTarget
        : null
  if (selectedTarget !== null) {
    const objectRecord = appState.projectContent.objectsById[selectedTarget.objectId]
    if (objectRecord !== undefined) {
      return buildObjectPartKeys(objectRecord)[0] ?? null
    }
  }
  return appState.workspaceSelection.resolvedContentSelection?.partKeys[0] ?? null
}

export const resolveZoomObjectTarget = (appState: AppState): ZoomObjectTarget | null => {
  const selectedPartKey = resolveSelectedObjectPartKeyForZoom(appState)
  if (selectedPartKey !== null) {
    return {
      kind: 'part',
      partKey: selectedPartKey,
    }
  }
  const selectedReferenceId = resolveSelectedReferenceIdForZoom(appState)
  if (selectedReferenceId !== null) {
    return {
      kind: 'reference',
      referenceId: selectedReferenceId,
    }
  }
  return null
}
