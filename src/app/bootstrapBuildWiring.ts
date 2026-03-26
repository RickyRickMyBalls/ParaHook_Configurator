import { buildDispatcher } from './buildDispatcher'
import { useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { appendConsoleEntry } from './console/useConsoleStore'
import { useBuildStatsStore } from './store/buildStatsStore'
import { useAppStore } from './store/useAppStore'

let wired = false

export const bootstrapBuildWiring = (): void => {
  if (wired) {
    return
  }

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
  buildDispatcher.setRuntimeHooks({
    onBuildRequestStarted: ({ seq, routingIdentity, buildStatsPartKeys }) => {
      useBuildStatsStore.getState().resetStatsForSeq(seq, buildStatsPartKeys)
      useBuildStatsStore.getState().setOverallState('building')
      appendConsoleEntry({
        layer: 'Worker',
        text: `Build started (${routingIdentity.graphDocumentId})`,
        source: routingIdentity.graphDocumentId,
        severity: 'info',
      })
    },
    onBuildProgress: (progress) => {
      useBuildStatsStore.getState().applyProgress(progress)
      appendConsoleEntry({
        layer: 'Worker',
        text: `${progress.partKey}: ${progress.state}`,
        source: progress.graphDocumentId,
        severity: progress.state === 'error' ? 'error' : 'info',
      })
    },
    onBuildResultSettled: (result) => {
      useBuildStatsStore.getState().setOverallState('idle')
      appendConsoleEntry({
        layer: 'Worker',
        text: `Build complete (${result.graphDocumentId})`,
        source: result.graphDocumentId,
        severity: 'info',
      })
      appendConsoleEntry({
        layer: 'Worker',
        text:
          `Build summary (${result.bundle.resultClass}): ` +
          `rebuilt ${result.bundle.summary.rebuiltCount}, ` +
          `retained ${result.bundle.summary.retainedCount}, ` +
          `evicted ${result.bundle.summary.evictedCount}`,
        source: result.graphDocumentId,
        severity: 'info',
      })
    },
    onWorkerError: (error) => {
      useBuildStatsStore.getState().setOverallState('error')
      appendConsoleEntry({
        layer: 'Diagnostics',
        text: error.message,
        source: error.graphDocumentId ?? error.op,
        severity: 'error',
      })
    },
  })

  useAppStore.getState().requestSpaghettiBuild()
  wired = true
}
