import { appendConsoleEntry } from '../../console/useConsoleStore'
import { useSpaghettiStore } from '../../spaghetti/store/useSpaghettiStore'
import type {
  AppState,
  ConsoleContextSyncSource,
  ConsoleContextSyncReason,
  ConsoleWorkspaceContextHandoff,
  WorkspaceResolvedContentSelection,
  WorkspaceSelectedTarget,
} from '../useAppStore'

type AppStoreSet = (
  partial:
    | AppState
    | Partial<AppState>
    | ((state: AppState) => AppState | Partial<AppState>),
) => void

export const isExplicitWorkspaceSelectionTarget = (
  target: WorkspaceSelectedTarget | null,
): target is Extract<
  WorkspaceSelectedTarget,
  | { kind: 'assembly' }
  | { kind: 'component' }
  | { kind: 'object' }
  | { kind: 'environment-light' }
> =>
  target !== null &&
  (target.kind === 'assembly' ||
    target.kind === 'component' ||
    target.kind === 'object' ||
    target.kind === 'environment-light')

const getWorkspaceSelectedTargetKey = (target: WorkspaceSelectedTarget): string => {
  switch (target.kind) {
    case 'graph-document':
      return `graph-document:${target.graphDocumentId}`
    case 'graph-node':
      return `graph-node:${target.graphDocumentId}:${target.nodeId}`
    case 'references-root':
      return 'references-root'
    case 'reference-category':
      return `reference-category:${target.categoryId}`
    case 'reference-item':
      return `reference-item:${target.referenceId}`
    case 'assembly':
      return `assembly:${target.assemblyId}`
    case 'component':
      return `component:${target.componentId}`
    case 'object':
      return `object:${target.objectId}`
    case 'environment-light':
      return `environment-light:${target.lightId}`
    case 'part':
      return `part:${target.partKey}`
  }
}

const areWorkspaceSelectedTargetsEqual = (
  left: WorkspaceSelectedTarget | null,
  right: WorkspaceSelectedTarget | null,
): boolean => {
  if (left === right) {
    return true
  }
  if (left === null || right === null) {
    return false
  }
  return getWorkspaceSelectedTargetKey(left) === getWorkspaceSelectedTargetKey(right)
}

export const resolveExplicitContentSelection = (
  state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
  selectedTarget: WorkspaceSelectedTarget | null,
  explicitSelectedTargets: WorkspaceSelectedTarget[],
  resolveOwnedContentSelection: (
    state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
    target: Extract<
      WorkspaceSelectedTarget,
      { kind: 'assembly' } | { kind: 'component' } | { kind: 'object' }
    >,
  ) => WorkspaceResolvedContentSelection | null,
): WorkspaceResolvedContentSelection | null => {
  const explicitContentTargets = explicitSelectedTargets.filter(
    (target): target is Extract<
      WorkspaceSelectedTarget,
      { kind: 'assembly' } | { kind: 'component' } | { kind: 'object' }
    > =>
      target.kind === 'assembly' || target.kind === 'component' || target.kind === 'object',
  )

  if (explicitContentTargets.length === 0) {
    return null
  }

  if (explicitSelectedTargets.length === 1) {
    return resolveOwnedContentSelection(state, explicitContentTargets[0])
  }

  const partKeySet = new Set<string>()
  const groupedRowIdSet = new Set<string>()
  for (const target of explicitContentTargets) {
    const selection = resolveOwnedContentSelection(state, target)
    if (selection === null) {
      continue
    }
    selection.partKeys.forEach((partKey) => partKeySet.add(partKey))
    selection.groupedRowIds.forEach((rowId) => groupedRowIdSet.add(rowId))
  }

  if (partKeySet.size === 0 && groupedRowIdSet.size === 0) {
    return null
  }

  return {
    rootRowId:
      selectedTarget !== null &&
      (selectedTarget.kind === 'assembly' ||
        selectedTarget.kind === 'component' ||
        selectedTarget.kind === 'object')
        ? getWorkspaceSelectedTargetKey(selectedTarget)
        : 'multi-select',
    rootKind: 'multi-select',
    partKeys: [...partKeySet],
    groupedRowIds: [...groupedRowIdSet],
  }
}

export const createWorkspaceSelectionAppStoreSlice = (
  set: AppStoreSet,
  deps: {
    resolveOwnedContentSelection: (
      state: Pick<AppState, 'projectContent' | 'referenceWorkspace'>,
      target: Extract<
        WorkspaceSelectedTarget,
        { kind: 'assembly' } | { kind: 'component' } | { kind: 'object' }
      >,
    ) => WorkspaceResolvedContentSelection | null
  },
) => ({
  setWorkspaceSelectedTarget: (target: WorkspaceSelectedTarget | null) => {
    set((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: target,
        explicitSelectedTargets: isExplicitWorkspaceSelectionTarget(target) ? [target] : [],
        selectionAnchorTarget: isExplicitWorkspaceSelectionTarget(target) ? target : null,
        resolvedContentSelection: null,
      },
    }))
  },
  setWorkspaceExplicitSelection: (selection: {
    selectedTarget: WorkspaceSelectedTarget | null
    explicitSelectedTargets: WorkspaceSelectedTarget[]
    selectionAnchorTarget: WorkspaceSelectedTarget | null
  }) => {
    set((state) => {
      const dedupedExplicitSelectedTargets = selection.explicitSelectedTargets.filter(
        (target, index, targets) =>
          targets.findIndex((candidate) => areWorkspaceSelectedTargetsEqual(candidate, target)) ===
          index,
      )
      return {
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: selection.selectedTarget,
          explicitSelectedTargets: dedupedExplicitSelectedTargets,
          selectionAnchorTarget: selection.selectionAnchorTarget,
          resolvedContentSelection: resolveExplicitContentSelection(
            state,
            selection.selectedTarget,
            dedupedExplicitSelectedTargets,
            deps.resolveOwnedContentSelection,
          ),
        },
      }
    })
  },
  setWorkspaceResolvedContentSelection: (selection: WorkspaceResolvedContentSelection | null) => {
    set((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        resolvedContentSelection: selection,
      },
    }))
  },
  setActiveSurface: (surface: AppState['workspaceSelection']['activeSurface']) => {
    set((state) => {
      if (state.workspaceSelection.activeSurface === surface) {
        return state
      }
      return {
        workspaceSelection: {
          ...state.workspaceSelection,
          activeSurface: surface,
        },
      }
    })
    const shouldSuppressSurfaceEntry =
      surface === 'viewer' && useSpaghettiStore.getState().sketchPlanePickSession !== null
    if (surface !== null && !shouldSuppressSurfaceEntry) {
      appendConsoleEntry({
        layer: 'Selection',
        text: `Active surface: ${surface}`,
        source: surface,
        severity: 'info',
      })
    }
  },
  requestConsoleContextSync: (
    reason: ConsoleContextSyncReason,
    source: ConsoleContextSyncSource = 'legacy',
  ) => {
    set((state) => ({
      consoleContextSyncRequest: {
        reason,
        source,
        seq: (state.consoleContextSyncRequest?.seq ?? 0) + 1,
      },
    }))
  },
  requestConsoleWorkspaceContextHandoff: (
    handoff: Omit<ConsoleWorkspaceContextHandoff, 'seq'>,
  ) => {
    set((state) => ({
      consoleWorkspaceContextHandoff: {
        ...handoff,
        seq: (state.consoleWorkspaceContextHandoff?.seq ?? 0) + 1,
      },
    }))
  },
})
