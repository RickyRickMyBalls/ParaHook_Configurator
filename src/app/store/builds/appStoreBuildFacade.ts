import type { StoreApi } from 'zustand'
import type { CompileSpaghettiGraphResult } from '../../spaghetti/compiler/compileGraph'
import { createBuildPolicyActions } from './appStoreBuildPolicies'
import { createBuildRequestActions } from './appStoreBuildRequests'
import { createBuildReleaseFlowActions } from './appStoreBuildReleaseFlow'
import {
  createBuildSubscriptionRuntime,
  type BuildSubscriptionRuntimeOptions,
  type BuildSubscriptionSyncState,
} from './appStoreBuildSubscriptions'
import type { AppState, DraftSchedulingRuntimeEvent } from '../useAppStore'

type AppStoreApi = Pick<StoreApi<AppState>, 'getState' | 'setState'>

type BuildFacadeActions = Pick<
  AppState,
  | 'requestGraphDocumentBuild'
  | 'prepareGraphDocumentExport'
  | 'endBrowserBuildInteraction'
  | 'requestBrowserGraphDocumentBuild'
  | 'requestManualBuild'
  | 'setBuildPolicy'
  | 'getBrowserGraphBuildPolicy'
  | 'getBrowserContentBuildPolicy'
  | 'setBrowserGraphBuildPolicy'
  | 'clearBrowserGraphBuildPolicy'
  | 'cycleBrowserGraphBuildPolicy'
  | 'setBrowserContentBuildPolicy'
  | 'clearBrowserContentBuildPolicy'
  | 'cycleBrowserContentBuildPolicy'
>

export type BuildFacadeBridge = {
  actions: BuildFacadeActions
  initializeSubscriptions: <TAcceptedPublicationRecords>(
    options: BuildSubscriptionRuntimeOptions<TAcceptedPublicationRecords>,
  ) => void
}

export const createBuildFacadeBridge = ({
  get,
  set,
  getCompileErrorMessage,
  publishDraftSchedulingRuntimeEvent,
}: {
  get: AppStoreApi['getState']
  set: AppStoreApi['setState']
  getCompileErrorMessage: (compileResult: CompileSpaghettiGraphResult) => string
  publishDraftSchedulingRuntimeEvent: (
    event: Omit<DraftSchedulingRuntimeEvent, 'eventSeq'>,
  ) => void
}): BuildFacadeBridge => {
  let syncCurrentProjectFromSpaghetti = (_spaghettiState: BuildSubscriptionSyncState): void => {}

  const actions: BuildFacadeActions = {
    ...createBuildRequestActions({
      get,
      set,
      publishDraftSchedulingRuntimeEvent,
    }),
    ...createBuildReleaseFlowActions({
      get,
      set,
      getCompileErrorMessage,
      publishDraftSchedulingRuntimeEvent,
      syncCurrentProjectFromSpaghetti: (spaghettiState) =>
        syncCurrentProjectFromSpaghetti(spaghettiState),
    }),
    ...createBuildPolicyActions({
      get,
      set,
      syncCurrentProjectFromSpaghetti: (spaghettiState) =>
        syncCurrentProjectFromSpaghetti(spaghettiState),
    }),
  }

  const initializeSubscriptions = <TAcceptedPublicationRecords>(
    options: BuildSubscriptionRuntimeOptions<TAcceptedPublicationRecords>,
  ): void => {
    const runtime = createBuildSubscriptionRuntime(options)
    syncCurrentProjectFromSpaghetti = runtime.syncCurrentProjectFromSpaghetti
    runtime.initializeBuildSubscriptions()
  }

  return {
    actions,
    initializeSubscriptions,
  }
}
