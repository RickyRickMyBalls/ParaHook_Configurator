import { buildDispatcher } from './buildDispatcher'
import { LEGACY_BUILD_STATS_PART_ORDER } from '../shared/buildStatsKeys'
import { selectActiveGraphPendingBuildState, useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { selectChangedGeomParamIds, useAppStore } from './store/useAppStore'

let wired = false

export const bootstrapBuildWiring = (): void => {
  if (wired) {
    return
  }

  buildDispatcher.setChangedParamIdsProvider(() =>
    selectActiveGraphPendingBuildState(useSpaghettiStore.getState())?.pendingChangedParamIds ??
    selectChangedGeomParamIds(useAppStore.getState()),
  )
  buildDispatcher.setBuildResultHandler((result) => {
    useAppStore.getState().acceptBuildResult(result)
  })
  buildDispatcher.setWorkerErrorHandler((error) => {
    if (
      error.op === 'build' &&
      typeof error.projectFileId === 'string' &&
      typeof error.graphDocumentId === 'string' &&
      typeof error.buildRequestId === 'string'
    ) {
      useSpaghettiStore.getState().clearGraphBuildRequest({
        projectFileId: error.projectFileId,
        graphDocumentId: error.graphDocumentId,
        buildRequestId: error.buildRequestId,
        buildSeq: error.seq,
      })
    }
    useAppStore.getState().setWorkerError(error.message)
  })
  buildDispatcher.setBuildInstancesProvider(() => {
    const pendingBuildState = selectActiveGraphPendingBuildState(useSpaghettiStore.getState())
    return (
      pendingBuildState?.pendingInstances ?? {
        heelKickInstances: [1],
        toeHookInstances: [1],
      }
    )
  })
  buildDispatcher.setBuildStatsPartKeysProvider(() => {
    return (
      selectActiveGraphPendingBuildState(useSpaghettiStore.getState())?.pendingStatsPartKeys ??
      [...LEGACY_BUILD_STATS_PART_ORDER]
    )
  })

  useAppStore.getState().requestSpaghettiBuild()
  wired = true
}
