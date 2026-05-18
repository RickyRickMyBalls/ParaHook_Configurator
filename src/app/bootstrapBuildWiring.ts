import { buildDispatcher } from './buildDispatcher'
import { downloadExportResult } from './exportDownload'
import { useSpaghettiStore } from './spaghetti/store/useSpaghettiStore'
import { appendConsoleEntry } from './console/useConsoleStore'
import { useBuildStatsStore } from './store/buildStatsStore'
import { useRuntimeInspectorTaskStore } from './store/runtimeInspectorTaskStore'
import {
  subscribeDraftSchedulingRuntimeEvents,
  useAppStore,
  type DraftSchedulingRuntimeEvent,
} from './store/useAppStore'
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

const toDraftSchedulingLabel = (graphDocumentId: string): string => `Draft ${graphDocumentId}`

const toDraftSchedulingTask = (
  event: DraftSchedulingRuntimeEvent,
): {
  seq: number
  graphDocumentId: string
  buildRequestId: null
  partKey: null
  label: string
  status: string
  progress01: null
  detail: string | null
  state: 'delayed' | 'replaced' | 'suppressed'
} | null => {
  switch (event.type) {
    case 'draft_delayed':
      return {
        seq: event.eventSeq,
        graphDocumentId: event.graphDocumentId,
        buildRequestId: null,
        partKey: null,
        label: toDraftSchedulingLabel(event.graphDocumentId),
        status: event.draftPolicy === 'settle' ? 'Waiting to settle' : 'Waiting for release',
        progress01: null,
        detail:
          event.draftPolicy === 'settle'
            ? 'Draft preview is delayed until a settle trigger exists.'
            : 'Draft preview is delayed until interaction release.',
        state: 'delayed',
      }
    case 'draft_replaced':
      return {
        seq: event.eventSeq,
        graphDocumentId: event.graphDocumentId,
        buildRequestId: null,
        partKey: null,
        label: toDraftSchedulingLabel(event.graphDocumentId),
        status: 'Replaced',
        progress01: null,
        detail: 'A newer draft intent replaced this delayed request before it ran.',
        state: 'replaced',
      }
    case 'draft_suppressed':
      return {
        seq: event.eventSeq,
        graphDocumentId: event.graphDocumentId,
        buildRequestId: null,
        partKey: null,
        label: toDraftSchedulingLabel(event.graphDocumentId),
        status: 'Suppressed',
        progress01: null,
        detail: 'Draft preview was intentionally suppressed by policy.',
        state: 'suppressed',
      }
    case 'draft_released':
      return null
  }
}

export const bootstrapBuildWiring = (): void => {
  if (wired) {
    return
  }

  buildDispatcher.setBuildResultHandler((result) => {
    useAppStore.getState().acceptBuildResult(result)
  })
  buildDispatcher.setExportResultHandler((result) => {
    useAppStore.getState().acceptGraphDocumentExportResult(result)
    downloadExportResult(result)
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
    if (error.op === 'export') {
      useAppStore.getState().failGraphDocumentExport(error)
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
    onBuildSuperseded: (superseded) => {
      useSpaghettiStore.getState().clearGraphBuildRequest({
        projectFileId: superseded.projectFileId,
        graphDocumentId: superseded.graphDocumentId,
        buildRequestId: superseded.buildRequestId,
        buildSeq: superseded.seq,
      })
      useRuntimeInspectorTaskStore.getState().supersedeBuild({
        seq: superseded.seq,
        graphDocumentId: superseded.graphDocumentId,
        buildRequestId: superseded.buildRequestId,
        partKey: null,
        label: toTaskLabel(superseded.graphDocumentId, null),
        status: 'Superseded',
        progress01: null,
        detail: null,
        state: 'superseded',
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
    onExportRequestStarted: (request) => {
      useRuntimeInspectorTaskStore.getState().beginBuild({
        seq: request.seq,
        graphDocumentId: request.graphDocumentId,
        buildRequestId: request.buildRequestId,
        partKey: null,
        label: `Export ${request.graphDocumentId}`,
        status: 'Starting',
        progress01: null,
        detail: 'Writing STEP from authoritative geometry.',
        state: 'queued',
      })
      appendConsoleEntry({
        layer: 'Worker',
        text: `STEP export started (${request.graphDocumentId})`,
        source: request.graphDocumentId,
        severity: 'info',
      })
    },
    onExportResultSettled: (result) => {
      useRuntimeInspectorTaskStore.getState().settleBuild({
        seq: result.seq,
        graphDocumentId: result.graphDocumentId,
        buildRequestId: result.buildRequestId,
      })
      appendConsoleEntry({
        layer: 'Worker',
        text: `STEP export complete (${result.filename})`,
        source: result.graphDocumentId,
        severity: 'info',
      })
    },
    onExportError: (error) => {
      useRuntimeInspectorTaskStore.getState().failBuild({
        seq: error.seq,
        graphDocumentId: error.graphDocumentId ?? null,
        buildRequestId: error.buildRequestId ?? null,
        partKey: null,
        label: error.graphDocumentId === undefined ? 'STEP export' : `Export ${error.graphDocumentId}`,
        status: 'Failed',
        progress01: null,
        detail: error.message,
        state: 'error',
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

  subscribeDraftSchedulingRuntimeEvents((event) => {
    if (event.type === 'draft_released') {
      useRuntimeInspectorTaskStore.getState().releaseDelayedDraft({
        graphDocumentId: event.graphDocumentId,
      })
      return
    }

    const task = toDraftSchedulingTask(event)
    if (task === null) {
      return
    }

    if (event.type === 'draft_delayed') {
      useRuntimeInspectorTaskStore.getState().delayDraft(task)
      return
    }
    if (event.type === 'draft_replaced') {
      useRuntimeInspectorTaskStore.getState().replaceDelayedDraft(task)
      return
    }
    useRuntimeInspectorTaskStore.getState().suppressDraft(task)
  })

  useAppStore.getState().requestSpaghettiBuild()
  wired = true
}
