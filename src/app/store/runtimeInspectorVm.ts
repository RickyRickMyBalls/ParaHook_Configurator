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
import {
  type GraphRuntimeState,
  selectViewerTargetGraphDocument,
  selectViewerTargetGraphRuntime,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import type { SpaghettiGraph, SpaghettiNode } from '../spaghetti/schema/spaghettiTypes'
import { getNodeDef } from '../spaghetti/registry/nodeRegistry'

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
  tone:
    | 'active'
    | 'queued'
    | 'delayed'
    | 'done'
    | 'reused'
    | 'replaced'
    | 'suppressed'
    | 'superseded'
    | 'error'
}

export type RuntimeInspectorChangeImpactMetricVm = {
  label: 'Affected Units' | 'Rebuilt' | 'Reused' | 'Evicted' | 'Untouched'
  value: string
}

export type RuntimeInspectorChangeImpactSummaryVm = {
  sectionLabel: 'Change Impact'
  summaryLabel: 'Latest Accepted Edit'
  changedParamsText: string
  metrics: RuntimeInspectorChangeImpactMetricVm[]
}

export type RuntimeInspectorChangeImpactGroupKey = 'rebuilt' | 'reused' | 'evicted'

export type RuntimeInspectorChangeImpactRowVm = {
  key: string
  buildUnitId: string
  outputEntryId: string
  sourceNodeId: string | null
  label: string
  detail: string | null
  tone: RuntimeInspectorChangeImpactGroupKey
}

export type RuntimeInspectorChangeImpactGroupVm = {
  key: RuntimeInspectorChangeImpactGroupKey
  label: 'Rebuilt' | 'Reused' | 'Evicted'
  tone: RuntimeInspectorChangeImpactGroupKey
  rows: RuntimeInspectorChangeImpactRowVm[]
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
  changeImpactSummary: RuntimeInspectorChangeImpactSummaryVm | null
  changeImpactGroups: RuntimeInspectorChangeImpactGroupVm[] | null
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
):
  | 'active'
  | 'queued'
  | 'delayed'
  | 'done'
  | 'reused'
  | 'replaced'
  | 'suppressed'
  | 'superseded'
  | 'error' => {
  if (state === 'error') {
    return 'error'
  }
  if (state === 'queued') {
    return 'queued'
  }
  if (state === 'delayed') {
    return 'delayed'
  }
  if (state === 'done') {
    return 'done'
  }
  if (state === 'reused') {
    return 'reused'
  }
  if (state === 'replaced') {
    return 'replaced'
  }
  if (state === 'suppressed') {
    return 'suppressed'
  }
  if (state === 'superseded') {
    return 'superseded'
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

const resolveNodeDisplayLabel = (node: SpaghettiNode | undefined): string | null => {
  if (node === undefined) {
    return null
  }
  const maybeLabel = (node as SpaghettiNode & { label?: unknown }).label
  if (typeof maybeLabel === 'string' && maybeLabel.trim().length > 0) {
    return maybeLabel.trim()
  }
  return getNodeDef(node.type)?.label ?? node.type
}

const buildImpactNodeById = (graph: SpaghettiGraph | null): Map<string, SpaghettiNode> =>
  new Map((graph?.nodes ?? []).map((node) => [node.nodeId, node] as const))

const formatChangedParamsText = (changedParamIds: readonly string[]): string => {
  if (changedParamIds.length === 0) {
    return 'Changed params: none recorded'
  }
  if (changedParamIds.length <= 2) {
    return `Changed params: ${changedParamIds.join(', ')}`
  }
  return `${changedParamIds.length} params changed`
}

type AcceptedBuildImpactSnapshot = GraphRuntimeState['acceptedBuildImpact']
type AcceptedBuildImpactEntry = NonNullable<AcceptedBuildImpactSnapshot>['entries'][number]

const buildChangeImpactSummaryVm = (
  acceptedBuildImpact: AcceptedBuildImpactSnapshot,
): RuntimeInspectorChangeImpactSummaryVm | null => {
  if (acceptedBuildImpact === null) {
    return null
  }

  const targetBuildUnitIds = [...new Set(acceptedBuildImpact.targetBuildUnitIds)]
  const affectedBuildUnitIdSet = new Set(acceptedBuildImpact.affectedBuildUnitIds)
  const untouchedCount =
    targetBuildUnitIds.length > 0
      ? targetBuildUnitIds.filter((buildUnitId) => !affectedBuildUnitIdSet.has(buildUnitId)).length
      : null

  const metrics: RuntimeInspectorChangeImpactMetricVm[] = [
    {
      label: 'Affected Units',
      value: acceptedBuildImpact.affectedBuildUnitIds.length.toLocaleString(),
    },
    {
      label: 'Rebuilt',
      value: acceptedBuildImpact.summary.rebuiltCount.toLocaleString(),
    },
    {
      label: 'Reused',
      value: acceptedBuildImpact.summary.retainedCount.toLocaleString(),
    },
    {
      label: 'Evicted',
      value: acceptedBuildImpact.summary.evictedCount.toLocaleString(),
    },
  ]

  if (untouchedCount !== null) {
    metrics.push({
      label: 'Untouched',
      value: untouchedCount.toLocaleString(),
    })
  }

  return {
    sectionLabel: 'Change Impact',
    summaryLabel: 'Latest Accepted Edit',
    changedParamsText: formatChangedParamsText(acceptedBuildImpact.changedParamIds),
    metrics,
  }
}

const buildChangeImpactRowVm = (options: {
  entry: AcceptedBuildImpactEntry
  nodeById: Map<string, SpaghettiNode>
  partKeyByNodeId: Record<string, string>
  tone: RuntimeInspectorChangeImpactGroupKey
}): RuntimeInspectorChangeImpactRowVm => {
  const sourceNodeId = options.entry.sourceNodeId
  const node = sourceNodeId === null ? undefined : options.nodeById.get(sourceNodeId)
  const nodeLabel = resolveNodeDisplayLabel(node)
  const partKey = sourceNodeId === null ? null : options.partKeyByNodeId[sourceNodeId] ?? null
  const label = nodeLabel ?? partKey ?? options.entry.outputEntryId
  const detail =
    partKey !== null && partKey !== label
      ? partKey
      : nodeLabel === null && options.entry.outputEntryId !== label
        ? options.entry.outputEntryId
        : null

  return {
    key: `${options.tone}:${options.entry.buildUnitId}:${options.entry.outputEntryId}`,
    buildUnitId: options.entry.buildUnitId,
    outputEntryId: options.entry.outputEntryId,
    sourceNodeId,
    label,
    detail,
    tone: options.tone,
  }
}

const buildChangeImpactGroupsVm = (options: {
  acceptedBuildImpact: AcceptedBuildImpactSnapshot
  viewerTargetGraph: SpaghettiGraph | null
  partKeyByNodeId: Record<string, string>
}): RuntimeInspectorChangeImpactGroupVm[] | null => {
  if (options.acceptedBuildImpact === null) {
    return null
  }

  const nodeById = buildImpactNodeById(options.viewerTargetGraph)
  const rowsByGroup: Record<RuntimeInspectorChangeImpactGroupKey, RuntimeInspectorChangeImpactRowVm[]> = {
    rebuilt: [],
    reused: [],
    evicted: [],
  }

  for (const entry of options.acceptedBuildImpact.entries) {
    const tone =
      entry.status === 'rebuilt'
        ? 'rebuilt'
        : entry.status === 'retained'
          ? 'reused'
          : entry.status === 'evicted'
            ? 'evicted'
            : null
    if (tone === null) {
      continue
    }
    rowsByGroup[tone].push(
      buildChangeImpactRowVm({
        entry,
        nodeById,
        partKeyByNodeId: options.partKeyByNodeId,
        tone,
      }),
    )
  }

  const groups: RuntimeInspectorChangeImpactGroupVm[] = [
    {
      key: 'rebuilt' as const,
      label: 'Rebuilt' as const,
      tone: 'rebuilt' as const,
      rows: rowsByGroup.rebuilt,
    },
    {
      key: 'reused' as const,
      label: 'Reused' as const,
      tone: 'reused' as const,
      rows: rowsByGroup.reused,
    },
    {
      key: 'evicted' as const,
      label: 'Evicted' as const,
      tone: 'evicted' as const,
      rows: rowsByGroup.evicted,
    },
  ].filter((group) => group.rows.length > 0)

  return groups
}

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
  const acceptedBuildImpact = useSpaghettiStore((state) =>
    selectViewerTargetGraphRuntime(state)?.acceptedBuildImpact ?? null,
  )
  const viewerTargetGraph = useSpaghettiStore((state) =>
    selectViewerTargetGraphDocument(state)?.graph ?? null,
  )
  const partKeyByNodeId = useSpaghettiStore((state) => state.partKeyByNodeId)

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
    changeImpactSummary: buildChangeImpactSummaryVm(acceptedBuildImpact),
    changeImpactGroups: buildChangeImpactGroupsVm({
      acceptedBuildImpact,
      viewerTargetGraph,
      partKeyByNodeId,
    }),
    hint: buildHint(runtimeStats),
  }
}
