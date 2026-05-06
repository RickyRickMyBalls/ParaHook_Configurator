import { useSpaghettiStore, type SpaghettiStoreState } from '../../spaghetti/store/useSpaghettiStore'
import type {
  AppState,
  BrowserBuildExecutionTarget,
  BrowserBuildPolicy,
} from '../useAppStore'

const BROWSER_BUILD_POLICY_ORDER: readonly BrowserBuildPolicy[] = [
  'live',
  'release',
  'manual',
  'off',
]

const BROWSER_BUILD_POLICY_PRIORITY: Record<BrowserBuildPolicy, number> = {
  off: 0,
  manual: 1,
  release: 2,
  live: 3,
}

const buildRootAssemblyId = (projectFileId: string): string =>
  `assembly-root:${projectFileId}`

const cycleBrowserBuildPolicy = (policy: BrowserBuildPolicy): BrowserBuildPolicy => {
  const currentIndex = BROWSER_BUILD_POLICY_ORDER.indexOf(policy)
  return BROWSER_BUILD_POLICY_ORDER[(currentIndex + 1) % BROWSER_BUILD_POLICY_ORDER.length]
}

const pickMoreEagerBrowserBuildPolicy = (
  left: BrowserBuildPolicy,
  right: BrowserBuildPolicy,
): BrowserBuildPolicy =>
  BROWSER_BUILD_POLICY_PRIORITY[right] > BROWSER_BUILD_POLICY_PRIORITY[left] ? right : left

const selectAssemblyBrowserBuildPolicy = (
  state: Pick<
    AppState,
    'currentProject' | 'browserContentBuildPolicyByRowId'
  >,
): BrowserBuildPolicy | null => {
  const rootAssemblyId =
    state.currentProject.rootAssemblyId ?? buildRootAssemblyId(state.currentProject.projectFileId)
  return state.browserContentBuildPolicyByRowId[rootAssemblyId] ?? null
}

const selectStrongestIndependentBrowserContentPolicyForGraphDocument = (
  state: Pick<AppState, 'projectContent' | 'browserContentBuildPolicyByRowId'>,
  graphDocumentId: string,
): BrowserBuildPolicy | null => {
  let strongest: BrowserBuildPolicy | null = null

  for (const component of Object.values(state.projectContent.componentsById)) {
    if (component.ownerGraphDocumentId !== graphDocumentId) {
      continue
    }
    const authored = state.browserContentBuildPolicyByRowId[component.componentId] ?? null
    if (authored === null) {
      continue
    }
    strongest = strongest === null ? authored : pickMoreEagerBrowserBuildPolicy(strongest, authored)
  }

  for (const objectRow of Object.values(state.projectContent.objectsById)) {
    if (objectRow.ownerGraphDocumentId !== graphDocumentId) {
      continue
    }
    const authored = state.browserContentBuildPolicyByRowId[objectRow.objectId] ?? null
    if (authored === null) {
      continue
    }
    strongest = strongest === null ? authored : pickMoreEagerBrowserBuildPolicy(strongest, authored)
  }

  return strongest
}

export const selectEffectiveBrowserExecutionPolicy = (
  state: Pick<
    AppState,
    | 'currentProject'
    | 'projectContent'
    | 'browserGraphBuildPolicyByGraphDocumentId'
    | 'browserContentBuildPolicyByRowId'
  >,
  target: BrowserBuildExecutionTarget,
): BrowserBuildPolicy => {
  if (target.kind !== 'graph-document') {
    return 'live'
  }

  let effective =
    state.browserGraphBuildPolicyByGraphDocumentId[target.graphDocumentId] ??
    selectAssemblyBrowserBuildPolicy(state) ??
    'live'

  const strongestIndependent =
    selectStrongestIndependentBrowserContentPolicyForGraphDocument(state, target.graphDocumentId)
  if (strongestIndependent !== null) {
    effective = pickMoreEagerBrowserBuildPolicy(effective, strongestIndependent)
  }

  return effective
}

export const selectShouldSuppressBrowserGraphRuntimeOutput = (
  state: Pick<
    AppState,
    | 'currentProject'
    | 'projectContent'
    | 'browserGraphBuildPolicyByGraphDocumentId'
    | 'browserContentBuildPolicyByRowId'
  >,
  graphDocumentId: string,
): boolean =>
  selectEffectiveBrowserExecutionPolicy(state, {
    kind: 'graph-document',
    graphDocumentId,
  }) === 'off'

type BuildPolicyActionState = Pick<
  AppState,
  | 'buildPolicy'
  | 'pendingBuildAfterRelease'
  | 'browserGraphBuildPolicyByGraphDocumentId'
  | 'browserContentBuildPolicyByRowId'
>

type BuildPolicyActionGet = () => Pick<
  AppState,
  'browserGraphBuildPolicyByGraphDocumentId' | 'browserContentBuildPolicyByRowId'
>

type BuildPolicyActionSet = (
  updater:
    | Partial<BuildPolicyActionState>
    | ((state: BuildPolicyActionState) => Partial<BuildPolicyActionState> | BuildPolicyActionState),
) => void

type SyncCurrentProjectFromSpaghetti = (
  spaghettiState: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
  >,
) => void

export const createBuildPolicyActions = ({
  get,
  set,
  syncCurrentProjectFromSpaghetti,
}: {
  get: BuildPolicyActionGet
  set: BuildPolicyActionSet
  syncCurrentProjectFromSpaghetti: SyncCurrentProjectFromSpaghetti
}): Pick<
  AppState,
  | 'setBuildPolicy'
  | 'getBrowserGraphBuildPolicy'
  | 'getBrowserContentBuildPolicy'
  | 'setBrowserGraphBuildPolicy'
  | 'clearBrowserGraphBuildPolicy'
  | 'cycleBrowserGraphBuildPolicy'
  | 'setBrowserContentBuildPolicy'
  | 'clearBrowserContentBuildPolicy'
  | 'cycleBrowserContentBuildPolicy'
> => ({
  setBuildPolicy: (policy) => {
    set((state) => ({
      buildPolicy: policy,
      pendingBuildAfterRelease:
        policy === 'release' ? state.pendingBuildAfterRelease : false,
    }))
  },
  getBrowserGraphBuildPolicy: (graphDocumentId) =>
    get().browserGraphBuildPolicyByGraphDocumentId[graphDocumentId] ?? null,
  getBrowserContentBuildPolicy: (rowId) => get().browserContentBuildPolicyByRowId[rowId] ?? null,
  setBrowserGraphBuildPolicy: (graphDocumentId, policy) => {
    set((state) => ({
      browserGraphBuildPolicyByGraphDocumentId: {
        ...state.browserGraphBuildPolicyByGraphDocumentId,
        [graphDocumentId]: policy,
      },
    }))
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  clearBrowserGraphBuildPolicy: (graphDocumentId) => {
    set((state) => {
      const next = { ...state.browserGraphBuildPolicyByGraphDocumentId }
      delete next[graphDocumentId]
      return {
        browserGraphBuildPolicyByGraphDocumentId: next,
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  cycleBrowserGraphBuildPolicy: (graphDocumentId, basePolicy) => {
    set((state) => {
      const currentPolicy =
        state.browserGraphBuildPolicyByGraphDocumentId[graphDocumentId] ?? basePolicy ?? 'live'
      return {
        browserGraphBuildPolicyByGraphDocumentId: {
          ...state.browserGraphBuildPolicyByGraphDocumentId,
          [graphDocumentId]: cycleBrowserBuildPolicy(currentPolicy),
        },
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  setBrowserContentBuildPolicy: (rowId, policy) => {
    set((state) => ({
      browserContentBuildPolicyByRowId: {
        ...state.browserContentBuildPolicyByRowId,
        [rowId]: policy,
      },
    }))
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  clearBrowserContentBuildPolicy: (rowId) => {
    set((state) => {
      const next = { ...state.browserContentBuildPolicyByRowId }
      delete next[rowId]
      return {
        browserContentBuildPolicyByRowId: next,
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
  cycleBrowserContentBuildPolicy: (rowId, basePolicy) => {
    set((state) => {
      const currentPolicy =
        state.browserContentBuildPolicyByRowId[rowId] ?? basePolicy ?? 'live'
      return {
        browserContentBuildPolicyByRowId: {
          ...state.browserContentBuildPolicyByRowId,
          [rowId]: cycleBrowserBuildPolicy(currentPolicy),
        },
      }
    })
    syncCurrentProjectFromSpaghetti(useSpaghettiStore.getState())
  },
})
