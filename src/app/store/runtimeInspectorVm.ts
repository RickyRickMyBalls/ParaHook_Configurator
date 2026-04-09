import {
  selectHasDeterminateProgress,
  selectOverallProgress01,
  useBuildStatsStore,
} from './buildStatsStore'
import {
  selectViewportRuntimeStats,
  type ViewportRuntimeStats,
  useViewportRuntimeStatsStore,
} from './viewportRuntimeStatsStore'
import {
  selectCurrentRuntimeInspectorTask,
  selectLatestArchivedRuntimeInspectorTask,
  type RuntimeInspectorTask,
  useRuntimeInspectorTaskStore,
} from './runtimeInspectorTaskStore'

type RuntimeInspectorStatCardVm = {
  label: 'Triangles' | 'Lines' | 'Points' | 'FPS'
  value: string
}

type RuntimeInspectorTaskVm =
  | {
      kind: 'idle'
      statusLabel: 'Idle'
      title: 'No active runtime task'
      detail: 'Build activity will appear here when the worker starts new work.'
    }
  | {
      kind: 'task'
      statusLabel: string
      title: string
      progressLabel: string
      graphDocumentId: string | null
      detail: string | null
      progressPercent: number | null
      tone: RuntimeInspectorTask['state']
    }

export type RuntimeInspectorQueueCardVm = {
  title: string
  statusLabel: string
  progressLabel: string
  graphDocumentId: string | null
  detail: string | null
  progressPercent: number | null
  tone: 'active' | 'queued' | 'done' | 'reused' | 'error'
}

export type RuntimeInspectorVm = {
  overallState: string
  pulseNonce: number
  pulseKind: 'cache_hit' | null
  progressWidth: string
  isIndeterminate: boolean
  shellStateLabel: 'Viewport Stats'
  statCards: RuntimeInspectorStatCardVm[]
  task: RuntimeInspectorTaskVm
  activeQueueCards: RuntimeInspectorQueueCardVm[]
  archiveCards: RuntimeInspectorQueueCardVm[]
  hint: string
}

const formatRuntimeStatValue = (value: number | null): string =>
  value === null ? 'Unavailable' : value.toLocaleString()

const formatTaskProgress = (value: number | null): string =>
  value === null ? 'Progress unavailable' : `${Math.round(value * 100)}%`

const buildStatCards = (runtimeStats: ViewportRuntimeStats): RuntimeInspectorStatCardVm[] => [
  {
    label: 'Triangles',
    value: formatRuntimeStatValue(runtimeStats.triangles),
  },
  {
    label: 'Lines',
    value: formatRuntimeStatValue(runtimeStats.lines),
  },
  {
    label: 'Points',
    value: formatRuntimeStatValue(runtimeStats.points),
  },
  {
    label: 'FPS',
    value: formatRuntimeStatValue(runtimeStats.fps),
  },
]

const buildTaskVm = (
  currentTask: RuntimeInspectorTask | null,
  fallbackArchivedTask: RuntimeInspectorTask | null,
): RuntimeInspectorTaskVm => {
  const visibleTask = currentTask ?? fallbackArchivedTask
  if (visibleTask === null) {
    return {
      kind: 'idle',
      statusLabel: 'Idle',
      title: 'No active runtime task',
      detail: 'Build activity will appear here when the worker starts new work.',
    }
  }

  return {
    kind: 'task',
    statusLabel: visibleTask.status,
    title: visibleTask.label,
    progressLabel: formatTaskProgress(visibleTask.progress01),
    graphDocumentId: visibleTask.graphDocumentId,
    detail: visibleTask.detail,
    progressPercent:
      visibleTask.progress01 === null
        ? null
        : Math.max(0, Math.min(1, visibleTask.progress01)) * 100,
    tone: visibleTask.state === 'reused' || visibleTask.state === 'done' ? 'active' : visibleTask.state,
  }
}

const toQueueCardTone = (
  state: RuntimeInspectorTask['state'],
): 'active' | 'queued' | 'done' | 'reused' | 'error' => {
  if (state === 'error') {
    return 'error'
  }
  if (state === 'queued') {
    return 'queued'
  }
  if (state === 'done') {
    return 'done'
  }
  if (state === 'reused') {
    return 'reused'
  }
  return 'active'
}

const buildQueueCardVm = (task: RuntimeInspectorTask): RuntimeInspectorQueueCardVm => ({
  title: task.label,
  statusLabel: task.status,
  progressLabel: formatTaskProgress(task.progress01),
  graphDocumentId: task.graphDocumentId,
  detail: task.detail,
  progressPercent:
    task.progress01 === null ? null : Math.max(0, Math.min(1, task.progress01)) * 100,
  tone: toQueueCardTone(task.state),
})

const sameTaskIdentity = (left: RuntimeInspectorTask, right: RuntimeInspectorTask): boolean =>
  left.seq === right.seq &&
  left.graphDocumentId === right.graphDocumentId &&
  left.buildRequestId === right.buildRequestId &&
  left.partKey === right.partKey

const buildHint = (runtimeStats: ViewportRuntimeStats): string => {
  const hasAnyRuntimeStats = Object.values(runtimeStats).some((value) => value !== null)
  return hasAnyRuntimeStats
    ? 'The first runtime task card now reflects the current accepted build lifecycle only.'
    : 'Waiting for the first viewer runtime sample. The current task card still reflects accepted build lifecycle only.'
}

export const useRuntimeInspectorVm = (viewportId: string): RuntimeInspectorVm => {
  const overallState = useBuildStatsStore((state) => state.overallState)
  const pulseNonce = useBuildStatsStore((state) => state.pulseNonce)
  const pulseKind = useBuildStatsStore((state) => state.pulseKind)
  const overallProgress01 = useBuildStatsStore(selectOverallProgress01)
  const hasDeterminateProgress = useBuildStatsStore(selectHasDeterminateProgress)
  const runtimeStats = useViewportRuntimeStatsStore((state) =>
    selectViewportRuntimeStats(state, viewportId),
  )
  const currentTask = useRuntimeInspectorTaskStore(selectCurrentRuntimeInspectorTask)
  const activeQueue = useRuntimeInspectorTaskStore((state) => state.activeQueue)
  const archive = useRuntimeInspectorTaskStore((state) => state.archive)
  const latestArchivedTask = useRuntimeInspectorTaskStore(selectLatestArchivedRuntimeInspectorTask)

  const shouldShowProgress = overallState === 'building' || overallState === 'assembling'
  const fallbackArchivedTask = overallState === 'error' ? latestArchivedTask : null
  const visibleArchive = archive.filter(
    (task) => !(fallbackArchivedTask !== null && sameTaskIdentity(task, fallbackArchivedTask)),
  )

  return {
    overallState,
    pulseNonce,
    pulseKind,
    progressWidth: shouldShowProgress ? `${Math.round(overallProgress01 * 100)}%` : '0%',
    isIndeterminate: shouldShowProgress && !hasDeterminateProgress,
    shellStateLabel: 'Viewport Stats',
    statCards: buildStatCards(runtimeStats),
    task: buildTaskVm(currentTask, fallbackArchivedTask),
    activeQueueCards: activeQueue.slice(1).map(buildQueueCardVm),
    archiveCards: visibleArchive.map(buildQueueCardVm),
    hint: buildHint(runtimeStats),
  }
}
