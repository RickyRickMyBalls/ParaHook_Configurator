import { buildDispatcher } from './buildDispatcher'
import { useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { appendConsoleEntry } from './console/useConsoleStore'
import { useBuildStatsStore } from './store/buildStatsStore'
import { useRuntimeInspectorTaskStore } from './store/runtimeInspectorTaskStore'
import { useAppStore } from './store/useAppStore'
import type { BuildProgressState } from '../shared/buildTypes'

let wired = false

const toTaskLabel = (graphDocumentId: string, partKey: string | null): string =>
  partKey === null ? `Build ${graphDocumentId}` : `Building ${partKey}`

const toTaskStatus = (state: BuildProgressState): string => {
  switch (state) {
    case 'queued':
      return 'Queued'
    case 'cache_hit':
      return 'Cache Hit'
    case 'building':
      return 'In Progress'
    case 'done':
      return 'Done'
    case 'error':
      return 'Failed'
  }
}

const toInspectorTaskState = (
  state: BuildProgressState,
): 'queued' | 'active' | 'done' | 'reused' | 'error' => {
  switch (state) {
    case 'queued':
      return 'queued'
    case 'building':
      return 'active'
    case 'done':
      return 'done'
    case 'cache_hit':
      return 'reused'
    case 'error':
      return 'error'
  }
}

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
      useRuntimeInspectorTaskStore.getState().beginBuild({
        seq,
        graphDocumentId: routingIdentity.graphDocumentId,
        buildRequestId: routingIdentity.buildRequestId,
        partKey: null,
        label: toTaskLabel(routingIdentity.graphDocumentId, null),
        status: 'Starting',
        progress01: null,
        detail: buildStatsPartKeys.length > 0 ? `Preparing ${buildStatsPartKeys[0]}` : null,
        state: 'queued',
      })
      appendConsoleEntry({
        layer: 'Worker',
        text: `Build started (${routingIdentity.graphDocumentId})`,
        source: routingIdentity.graphDocumentId,
        severity: 'info',
      })
    },
    onBuildProgress: (progress) => {
      useBuildStatsStore.getState().applyProgress(progress)
      const inspectorTask = {
        seq: progress.seq,
        graphDocumentId: progress.graphDocumentId,
        buildRequestId: progress.buildRequestId,
        partKey: progress.partKey,
        label: toTaskLabel(progress.graphDocumentId, progress.partKey),
        status: toTaskStatus(progress.state),
        progress01: typeof progress.progress01 === 'number' ? progress.progress01 : null,
        detail: progress.message ?? null,
        state: toInspectorTaskState(progress.state),
      } as const
      if (progress.state === 'queued' || progress.state === 'building') {
        useRuntimeInspectorTaskStore.getState().upsertActiveEntry(inspectorTask)
      } else {
        useRuntimeInspectorTaskStore.getState().resolveEntry(inspectorTask)
      }
      appendConsoleEntry({
        layer: 'Worker',
        text: `${progress.partKey}: ${progress.state}`,
        source: progress.graphDocumentId,
        severity: progress.state === 'error' ? 'error' : 'info',
      })
    },
    onBuildResultSettled: (result) => {
      useBuildStatsStore.getState().setOverallState('idle')
      useRuntimeInspectorTaskStore.getState().settleBuild({
        seq: result.seq,
        graphDocumentId: result.graphDocumentId,
        buildRequestId: result.buildRequestId,
      })
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
      useRuntimeInspectorTaskStore.getState().failBuild({
        seq: error.seq,
        graphDocumentId: error.graphDocumentId ?? null,
        buildRequestId: error.buildRequestId ?? null,
        partKey: null,
        label: error.graphDocumentId === undefined ? 'Build runtime' : `Build ${error.graphDocumentId}`,
        status: 'Failed',
        progress01: null,
        detail: error.message,
        state: 'error',
      })
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
