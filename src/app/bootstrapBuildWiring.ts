import { buildDispatcher } from './buildDispatcher'
import { selectChangedGeomParamIds, useAppStore } from './store/useAppStore'

let wired = false

export const bootstrapBuildWiring = (): void => {
  if (wired) {
    return
  }

  buildDispatcher.setChangedParamIdsProvider(() =>
    useAppStore.getState().inputMode === 'spaghetti'
      ? useAppStore.getState().spaghettiPendingChangedParamIds
      : selectChangedGeomParamIds(useAppStore.getState()),
  )
  buildDispatcher.setBuildResultHandler((result) => {
    useAppStore.getState().acceptBuildResult(result)
  })
  buildDispatcher.setAssembleResultHandler((result) => {
    useAppStore.getState().setAssembled(result)
  })
  buildDispatcher.setWorkerErrorHandler((error) => {
    useAppStore.getState().setWorkerError(error.message)
  })
  buildDispatcher.setBuildInstancesProvider(() => {
    const state = useAppStore.getState()
    if (state.inputMode === 'spaghetti') {
      return (
        state.spaghettiPendingInstances ?? {
          heelKickInstances: [1],
          toeHookInstances: [1],
        }
      )
    }
    return {
      heelKickInstances: state.heelKickInstances,
      toeHookInstances: state.toeHookInstances,
    }
  })

  buildDispatcher.requestBuild(useAppStore.getState().box)
  wired = true
}
