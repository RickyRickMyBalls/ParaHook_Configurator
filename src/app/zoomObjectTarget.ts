import {
  buildObjectPartKeys,
  resolveOwnedContentSelection,
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
  | {
      kind: 'environment-light'
      lightId: string
    }
  | {
      kind: 'selection-set'
      partKeys: string[]
      referenceIds: string[]
    }

export const resolveSelectionSetForZoomObject = (
  appState: AppState,
): { partKeys: string[]; referenceIds: string[] } => {
  const selectedTargets =
    appState.workspaceSelection.explicitSelectedTargets.length > 0
      ? appState.workspaceSelection.explicitSelectedTargets
      : appState.workspaceSelection.selectedTarget === null
        ? []
        : [appState.workspaceSelection.selectedTarget]
  const selectedContentSelection =
    selectedTargets.length > 1
      ? null
      : appState.workspaceSelection.resolvedContentSelection ??
        (appState.workspaceSelection.selectedTarget !== null
          ? resolveOwnedContentSelection(
              {
                projectContent: appState.projectContent,
                referenceWorkspace: appState.referenceWorkspace,
              },
              appState.workspaceSelection.selectedTarget,
            )
          : null)
  const fallbackPartKeys =
    selectedContentSelection?.partKeys ??
    selectedTargets.flatMap((target) =>
      resolveOwnedContentSelection(
        {
          projectContent: appState.projectContent,
          referenceWorkspace: appState.referenceWorkspace,
        },
        target,
      )?.partKeys ?? [],
    )
  return {
    partKeys: [...new Set(fallbackPartKeys)],
    referenceIds: [
      ...new Set(
        selectedTargets.flatMap((target) =>
          resolveReferenceIdsForWorkspaceTarget(
            {
              projectContent: appState.projectContent,
              referenceWorkspace: appState.referenceWorkspace,
            },
            target,
          ),
        ),
      ),
    ],
  }
}

export const resolveSelectedEnvironmentLightIdForZoom = (
  appState: AppState,
): string | null => {
  const selectedTarget = appState.workspaceSelection.selectedTarget
  return selectedTarget?.kind === 'environment-light' ? selectedTarget.lightId : null
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
  if (appState.workspaceSelection.explicitSelectedTargets.length > 1) {
    const selectionSet = resolveSelectionSetForZoomObject(appState)
    if (selectionSet.partKeys.length > 0 || selectionSet.referenceIds.length > 0) {
      return {
        kind: 'selection-set',
        partKeys: selectionSet.partKeys,
        referenceIds: selectionSet.referenceIds,
      }
    }
  }
  const selectedPartKey = resolveSelectedObjectPartKeyForZoom(appState)
  if (selectedPartKey !== null) {
    return {
      kind: 'part',
      partKey: selectedPartKey,
    }
  }
  const selectedEnvironmentLightId = resolveSelectedEnvironmentLightIdForZoom(appState)
  if (selectedEnvironmentLightId !== null) {
    return {
      kind: 'environment-light',
      lightId: selectedEnvironmentLightId,
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
