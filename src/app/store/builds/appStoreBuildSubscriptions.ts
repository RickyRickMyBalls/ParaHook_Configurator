import {
  selectGraphRuntimeByDocumentId,
  useSpaghettiStore,
  type GraphRuntimeState,
  type SpaghettiStoreState,
} from '../../spaghetti/store/useSpaghettiStore'
import {
  selectViewportResultModeBehaviorById,
  selectViewportResultModeById,
  useWorkspaceStore,
  type WorkspaceStoreState,
} from '../../workspace/useWorkspaceStore'
import type { WorkspaceViewportResultModeBehavior } from '../../workspace/workspaceViewportResultMode'
import { selectEffectiveBrowserExecutionPolicy } from './appStoreBuildPolicies'
import type { AppState } from '../useAppStore'
import { deleteRecordKey } from '../storeRecordUtils'

export type BuildSubscriptionSyncState = Pick<
  SpaghettiStoreState,
  'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
>

type SetAppState = (
  updater: Partial<AppState> | ((state: AppState) => Partial<AppState> | AppState),
) => void

export type BuildSubscriptionRuntimeOptions<TAcceptedPublicationRecords> = {
  getAppState: () => AppState
  setAppState: SetAppState
  buildProjectGraphDocuments: (
    spaghettiState: BuildSubscriptionSyncState,
  ) => AppState['currentProject']['graphDocuments']
  buildRootAssemblyId: (projectFileId: string) => string
  areProjectGraphDocumentsEqual: (
    left: AppState['currentProject']['graphDocuments'],
    right: AppState['currentProject']['graphDocuments'],
  ) => boolean
  buildProjectAcceptedPublicationRecords: (
    project: AppState['currentProject'],
    spaghettiState: BuildSubscriptionSyncState,
    context: Pick<
      AppState,
      | 'currentProject'
      | 'projectContent'
      | 'browserGraphBuildPolicyByGraphDocumentId'
      | 'browserContentBuildPolicyByRowId'
    >,
  ) => TAcceptedPublicationRecords
  buildProjectContentDerivation: (
    project: AppState['currentProject'],
    spaghettiState: BuildSubscriptionSyncState,
    acceptedPublicationRecords: TAcceptedPublicationRecords,
    context: Pick<AppState, 'projectContent' | 'runtimeContentPlacementByRowId'>,
  ) => Pick<AppState, 'projectContent' | 'runtimeContentPlacementByRowId'>
  areProjectContentStatesEqual: (
    left: AppState['projectContent'],
    right: AppState['projectContent'],
  ) => boolean
  areRuntimeContentPlacementOverlaysEqual: (
    left: AppState['runtimeContentPlacementByRowId'],
    right: AppState['runtimeContentPlacementByRowId'],
  ) => boolean
}

export const createBuildSubscriptionRuntime = <TAcceptedPublicationRecords>({
  getAppState,
  setAppState,
  buildProjectGraphDocuments,
  buildRootAssemblyId,
  areProjectGraphDocumentsEqual,
  buildProjectAcceptedPublicationRecords,
  buildProjectContentDerivation,
  areProjectContentStatesEqual,
  areRuntimeContentPlacementOverlaysEqual,
}: BuildSubscriptionRuntimeOptions<TAcceptedPublicationRecords>) => {
  const isGraphVisibleInActiveViewer = (
    state: Pick<SpaghettiStoreState, 'viewerTargetGraphDocumentId' | 'sharedViewerComposition'>,
    graphDocumentId: string,
  ): boolean =>
    state.viewerTargetGraphDocumentId === graphDocumentId ||
    state.sharedViewerComposition?.graphDocumentIds.includes(graphDocumentId) === true

  const selectActiveViewerModeBehavior = (): WorkspaceViewportResultModeBehavior => {
    const workspaceState = useWorkspaceStore.getState()
    return selectViewportResultModeBehaviorById(
      workspaceState,
      workspaceState.activeViewerViewportId,
    )
  }

  const isGraphVisibleInActiveAutoViewer = (graphDocumentId: string): boolean =>
    isGraphVisibleInActiveViewer(useSpaghettiStore.getState(), graphDocumentId) &&
    selectActiveViewerModeBehavior().mode === 'auto'

  const doesRuntimeHaveCurrentAcceptedResult = (
    runtime: GraphRuntimeState | null | undefined,
  ): boolean => {
    if (runtime === undefined || runtime === null) {
      return false
    }

    const currentGraphRevision = runtime.compileBuild.currentGraphRevision
    const latestAcceptedGraphRevision = runtime.compileBuild.latestAcceptedGraphRevision
    if (
      currentGraphRevision === null ||
      latestAcceptedGraphRevision === null ||
      latestAcceptedGraphRevision !== currentGraphRevision
    ) {
      return false
    }

    return (
      runtime.acceptedAuthoritativeGeometryResult !== null ||
      runtime.acceptedDraftGeometryResult !== null ||
      runtime.acceptedPreviewBuildOutputs.length > 0
    )
  }

  const requestAutoViewportDraftBuildIfAllowed = (graphDocumentId: string): void => {
    const appState = getAppState()
    const policy = selectEffectiveBrowserExecutionPolicy(appState, {
      kind: 'graph-document',
      graphDocumentId,
    })
    if (policy === 'manual' || policy === 'off') {
      return
    }

    appState.requestGraphDocumentBuild(graphDocumentId, {
      browserExecutionPolicy: policy,
      geometryTargetOverride: 'draft_preview',
    })
  }

  const maybeRequestAutoViewportAuthoritativeFollowThrough = (
    graphDocumentId: string,
  ): void => {
    if (!isGraphVisibleInActiveAutoViewer(graphDocumentId)) {
      return
    }

    const appState = getAppState()
    const policy = selectEffectiveBrowserExecutionPolicy(appState, {
      kind: 'graph-document',
      graphDocumentId,
    })
    if (policy === 'manual' || policy === 'off') {
      return
    }

    if (appState.delayedAuthoritativeBuildByGraphDocumentId[graphDocumentId] !== undefined) {
      return
    }

    const runtime = selectGraphRuntimeByDocumentId(useSpaghettiStore.getState(), graphDocumentId)
    if (runtime === null) {
      return
    }

    const currentGraphRevision = runtime.compileBuild.currentGraphRevision
    const latestAcceptedGraphRevision = runtime.compileBuild.latestAcceptedGraphRevision
    if (
      currentGraphRevision === null ||
      latestAcceptedGraphRevision === null ||
      latestAcceptedGraphRevision !== currentGraphRevision
    ) {
      return
    }

    if (runtime.compileBuild.inFlightBuildRequestId !== null) {
      return
    }

    if (
      runtime.acceptedDraftGeometryResult === null &&
      runtime.acceptedPreviewBuildOutputs.length === 0
    ) {
      return
    }

    if (
      runtime.acceptedAuthoritativeGeometryResult !== null &&
      runtime.acceptedAuthoritativeGraphRevision === currentGraphRevision
    ) {
      return
    }

    if (
      runtime.acceptedBuildBundle?.executionIntent.geometryTarget === 'authoritative' &&
      runtime.acceptedBuildBundle.seq === runtime.compileBuild.latestAcceptedBuildSeq
    ) {
      return
    }

    appState.requestBrowserGraphDocumentBuild(graphDocumentId, {
      geometryTargetOverride: 'authoritative',
      reuseCurrentAcceptedPreviewComparison: true,
    })
  }

  const syncCurrentProjectFromSpaghetti = (spaghettiState: BuildSubscriptionSyncState): void => {
    const nextGraphDocuments = buildProjectGraphDocuments(spaghettiState)
    setAppState((state) => {
      const nextRootAssemblyId =
        state.currentProject.rootAssemblyId ?? buildRootAssemblyId(state.currentProject.projectFileId)
      const currentProjectChanged =
        !areProjectGraphDocumentsEqual(state.currentProject.graphDocuments, nextGraphDocuments) ||
        state.currentProject.rootAssemblyId !== nextRootAssemblyId
      const nextCurrentProject = currentProjectChanged
        ? {
            ...state.currentProject,
            graphDocuments: nextGraphDocuments,
            rootAssemblyId: nextRootAssemblyId,
          }
        : state.currentProject
      const acceptedPublicationRecords = buildProjectAcceptedPublicationRecords(
        nextCurrentProject,
        spaghettiState,
        {
          currentProject: nextCurrentProject,
          projectContent: state.projectContent,
          browserGraphBuildPolicyByGraphDocumentId:
            state.browserGraphBuildPolicyByGraphDocumentId,
          browserContentBuildPolicyByRowId: state.browserContentBuildPolicyByRowId,
        },
      )
      const nextDerivation = buildProjectContentDerivation(
        nextCurrentProject,
        spaghettiState,
        acceptedPublicationRecords,
        {
          projectContent: state.projectContent,
          runtimeContentPlacementByRowId: state.runtimeContentPlacementByRowId,
        },
      )
      const nextProjectContent = nextDerivation.projectContent

      if (
        nextCurrentProject === state.currentProject &&
        areProjectContentStatesEqual(state.projectContent, nextProjectContent) &&
        areRuntimeContentPlacementOverlaysEqual(
          state.runtimeContentPlacementByRowId,
          nextDerivation.runtimeContentPlacementByRowId,
        )
      ) {
        return state
      }
      return {
        currentProject: nextCurrentProject,
        projectContent: nextProjectContent,
        runtimeContentPlacementByRowId: nextDerivation.runtimeContentPlacementByRowId,
      }
    })
  }

  const handleBrowserGraphRuntimeRevisionChange = (graphDocumentId: string): void => {
    const state = getAppState()
    const policy = selectEffectiveBrowserExecutionPolicy(state, {
      kind: 'graph-document',
      graphDocumentId,
    })

    if (isGraphVisibleInActiveAutoViewer(graphDocumentId)) {
      if (policy === 'live' || policy === 'release') {
        requestAutoViewportDraftBuildIfAllowed(graphDocumentId)
        return
      }

      setAppState((current) => ({
        pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
          current.pendingBrowserBuildGraphDocumentIds,
          graphDocumentId,
        ),
      }))
      return
    }

    if (policy === 'live') {
      state.requestBrowserGraphDocumentBuild(graphDocumentId)
      return
    }

    if (policy === 'release') {
      if (state.browserInteractionGraphDocumentIds[graphDocumentId] === true) {
        setAppState((current) => ({
          pendingBrowserBuildGraphDocumentIds: {
            ...current.pendingBrowserBuildGraphDocumentIds,
            [graphDocumentId]: true,
          },
        }))
        return
      }
      state.requestBrowserGraphDocumentBuild(graphDocumentId)
      return
    }

    setAppState((current) => ({
      pendingBrowserBuildGraphDocumentIds: deleteRecordKey(
        current.pendingBrowserBuildGraphDocumentIds,
        graphDocumentId,
      ),
    }))
  }

  const shouldTriggerViewerModeBuildRequest = (
    previousState: Pick<WorkspaceStoreState, 'activeViewerViewportId' | 'viewportChromeById'>,
    nextState: Pick<WorkspaceStoreState, 'activeViewerViewportId' | 'viewportChromeById'>,
  ): boolean => {
    const previousActiveViewportId = previousState.activeViewerViewportId
    const nextActiveViewportId = nextState.activeViewerViewportId
    const previousMode = selectViewportResultModeById(previousState, previousActiveViewportId)
    const nextMode = selectViewportResultModeById(nextState, nextActiveViewportId)

    if (previousActiveViewportId === nextActiveViewportId && previousMode === nextMode) {
      return false
    }

    return nextMode === 'auto' || nextMode === 'final'
  }

  const requestViewerTargetBuildForViewportPreference = (): void => {
    const viewerTargetGraphDocumentId = useSpaghettiStore.getState().viewerTargetGraphDocumentId
    if (viewerTargetGraphDocumentId === null) {
      return
    }
    const modeBehavior = selectActiveViewerModeBehavior()
    const graphRuntime = selectGraphRuntimeByDocumentId(
      useSpaghettiStore.getState(),
      viewerTargetGraphDocumentId,
    )
    const currentGraphRevision = graphRuntime?.compileBuild.currentGraphRevision ?? null
    const latestAcceptedGraphRevision = graphRuntime?.compileBuild.latestAcceptedGraphRevision ?? null
    if (modeBehavior.mode === 'auto') {
      if (!doesRuntimeHaveCurrentAcceptedResult(graphRuntime)) {
        requestAutoViewportDraftBuildIfAllowed(viewerTargetGraphDocumentId)
      }
      maybeRequestAutoViewportAuthoritativeFollowThrough(viewerTargetGraphDocumentId)
      return
    }
    if (
      graphRuntime?.acceptedAuthoritativeGeometryResult !== null &&
      currentGraphRevision !== null &&
      latestAcceptedGraphRevision !== null &&
      currentGraphRevision <= latestAcceptedGraphRevision
    ) {
      return
    }
    getAppState().requestBrowserGraphDocumentBuild(viewerTargetGraphDocumentId)
  }

  let initialized = false

  const initializeBuildSubscriptions = (): void => {
    if (initialized) {
      return
    }
    initialized = true

    useSpaghettiStore.subscribe((state, previousState) => {
      if (
        state.graphDocumentOrder === previousState.graphDocumentOrder &&
        state.graphDocumentsById === previousState.graphDocumentsById &&
        state.graphRuntimeByDocumentId === previousState.graphRuntimeByDocumentId
      ) {
        return
      }
      syncCurrentProjectFromSpaghetti(state)

      const changedGraphDocumentIds = new Set<string>([
        ...Object.keys(state.graphRuntimeByDocumentId),
        ...Object.keys(previousState.graphRuntimeByDocumentId),
      ])

      for (const graphDocumentId of changedGraphDocumentIds) {
        const nextRevision =
          state.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild.currentGraphRevision ??
          null
        const previousRevision =
          previousState.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild.currentGraphRevision ??
          null
        if (
          nextRevision === null ||
          previousRevision === null ||
          nextRevision === previousRevision
        ) {
          continue
        }
        handleBrowserGraphRuntimeRevisionChange(graphDocumentId)
      }

      for (const graphDocumentId of changedGraphDocumentIds) {
        const nextCompileBuild = state.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild ?? null
        const previousCompileBuild =
          previousState.graphRuntimeByDocumentId[graphDocumentId]?.compileBuild ?? null
        const acceptedRevisionChanged =
          nextCompileBuild?.latestAcceptedGraphRevision !==
          previousCompileBuild?.latestAcceptedGraphRevision
        const inFlightRequestChanged =
          nextCompileBuild?.inFlightBuildRequestId !== previousCompileBuild?.inFlightBuildRequestId
        if (!acceptedRevisionChanged && !inFlightRequestChanged) {
          continue
        }
        maybeRequestAutoViewportAuthoritativeFollowThrough(graphDocumentId)
      }
    })

    useWorkspaceStore.subscribe((state, previousState) => {
      if (!shouldTriggerViewerModeBuildRequest(previousState, state)) {
        return
      }
      requestViewerTargetBuildForViewportPreference()
    })
  }

  return {
    syncCurrentProjectFromSpaghetti,
    initializeBuildSubscriptions,
  }
}
