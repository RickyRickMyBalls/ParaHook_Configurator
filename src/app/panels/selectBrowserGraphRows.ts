import type { GraphOutputSurface } from '../spaghetti/outputSurface'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  CachedGraphEntry,
  GraphRuntimeState,
} from '../spaghetti/store/useSpaghettiStore'
import type { BrowserBuildPolicy } from '../store/useAppStore'
import type { BrowserBuildPolicySource } from './selectBrowserTreeRows'

export type BrowserPublishedGraphOutputRowVm = {
  rowId: string
  outputEntryId: string
  slotId: string
  sourceNodeId: string
  label: string
  meta: string
  state: 'empty' | 'resolved' | 'unresolved'
  highlightViewerKey: string | null
  authoringGraphDocumentId: string
  authoringNodeId: string | null
}

export type BrowserGraphRowVm = {
  cachedGraphId: string
  graphDocumentId: string
  label: string
  meta: string
  saveState: 'saved' | 'unsaved'
  isFocused: boolean
  openViewportCount: number
  hasFocusedViewport: boolean
  buildState: 'rebuild' | 'building' | 'done'
  buildStateLabel: string
  authoredBrowserBuildPolicy: BrowserBuildPolicy | null
  effectiveBrowserBuildPolicy: BrowserBuildPolicy
  effectiveBrowserBuildPolicySource: BrowserBuildPolicySource
  effectiveBrowserBuildPolicySourceLabel: string | null
  publishedOutputRows: BrowserPublishedGraphOutputRowVm[]
}

const describePublishedOutputMeta = (
  outputSurface: GraphOutputSurface | null,
  entry: GraphOutputSurface['entries'][number],
): string => {
  const publishedMeta =
    outputSurface?.publishedAtBuildSeq === null || outputSurface === null
      ? 'Not Published'
      : `Build ${outputSurface.publishedAtBuildSeq}`
  const semanticMeta = [
    entry.resultEntryStatus,
    entry.resultClass,
    entry.acceptedArtifactKey,
  ].filter((value): value is string => typeof value === 'string' && value.length > 0)
  if (entry.state === 'resolved') {
    return semanticMeta.length === 0
      ? `Resolved | ${publishedMeta}`
      : `Resolved | ${semanticMeta.join(' | ')} | ${publishedMeta}`
  }
  if (entry.state === 'unresolved') {
    return semanticMeta.length === 0
      ? `Unresolved | ${publishedMeta}`
      : `Unresolved | ${semanticMeta.join(' | ')} | ${publishedMeta}`
  }
  return `Empty | ${publishedMeta}`
}

export const selectBrowserGraphRows = (options: {
  cachedGraphEntryOrder: string[]
  cachedGraphEntriesById: Record<string, CachedGraphEntry>
  graphDocumentsById: Record<string, GraphDocument>
  graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
  browserGraphBuildPolicyByGraphDocumentId?: Record<string, BrowserBuildPolicy>
  suppressedGraphDocumentIds?: ReadonlySet<string>
  activeGraphDocumentId: string
  openViewportCountByGraphDocumentId: ReadonlyMap<string, number>
  hasFocusedViewportByGraphDocumentId: ReadonlyMap<string, boolean>
}): BrowserGraphRowVm[] => {
  const {
    activeGraphDocumentId,
    cachedGraphEntriesById,
    cachedGraphEntryOrder,
    graphDocumentsById,
    graphRuntimeByDocumentId,
    browserGraphBuildPolicyByGraphDocumentId = {},
    suppressedGraphDocumentIds = new Set<string>(),
    hasFocusedViewportByGraphDocumentId,
    openViewportCountByGraphDocumentId,
  } = options

  return cachedGraphEntryOrder.reduce<BrowserGraphRowVm[]>((rows, cachedGraphId) => {
      const entry = cachedGraphEntriesById[cachedGraphId] ?? null
      if (entry === null) {
        return rows
      }
      const document = graphDocumentsById[entry.graphDocumentId] ?? null
      if (document === null) {
        return rows
      }

      const isFocused = activeGraphDocumentId === document.graphDocumentId
      const openViewportCount =
        openViewportCountByGraphDocumentId.get(document.graphDocumentId) ?? 0
      const hasFocusedViewport =
        hasFocusedViewportByGraphDocumentId.get(document.graphDocumentId) ?? false
      const lifecycleStatus = entry.isDirty ? 'Dirty' : 'Saved'
      const runtime = graphRuntimeByDocumentId[document.graphDocumentId]
      const authoredBrowserBuildPolicy =
        browserGraphBuildPolicyByGraphDocumentId[document.graphDocumentId] ?? null
      const currentGraphRevision = runtime?.compileBuild?.currentGraphRevision ?? 0
      const latestAcceptedGraphRevision =
        runtime?.compileBuild?.latestAcceptedGraphRevision ?? null
      const isBuilding = (runtime?.compileBuild?.inFlightBuildSeq ?? null) !== null
      const buildState =
        isBuilding
          ? 'building'
          : latestAcceptedGraphRevision !== null &&
              latestAcceptedGraphRevision === currentGraphRevision
            ? 'done'
            : 'rebuild'
      const viewportStatus =
        openViewportCount === 0
          ? 'Closed'
          : hasFocusedViewport
            ? openViewportCount === 1
              ? 'Active editor'
              : `Active editor | ${openViewportCount} editors`
            : openViewportCount === 1
              ? 'Open editor'
              : `${openViewportCount} editors`

      const outputSurface =
        suppressedGraphDocumentIds.has(document.graphDocumentId)
          ? null
          : runtime?.outputSurface ?? null
      const publishedOutputRows = (outputSurface?.entries ?? []).map((publishedEntry) => ({
        rowId: `published-output-row:${document.graphDocumentId}:${publishedEntry.outputEntryId}`,
        outputEntryId: publishedEntry.outputEntryId,
        slotId: publishedEntry.slotId,
        sourceNodeId: publishedEntry.sourceNodeId,
        label: publishedEntry.label,
        meta: describePublishedOutputMeta(outputSurface, publishedEntry),
        state: publishedEntry.state,
        highlightViewerKey: publishedEntry.slotId,
        authoringGraphDocumentId: document.graphDocumentId,
        authoringNodeId: publishedEntry.sourceNodeId.length > 0 ? publishedEntry.sourceNodeId : null,
      }))

      rows.push({
        cachedGraphId: entry.cachedGraphId,
        graphDocumentId: document.graphDocumentId,
        label: document.name,
        meta: `${lifecycleStatus} | ${viewportStatus}`,
        saveState: entry.isDirty ? 'unsaved' : 'saved',
        isFocused,
        openViewportCount,
        hasFocusedViewport,
        buildState,
        buildStateLabel:
          buildState === 'building' ? 'Building' : buildState === 'done' ? 'Done' : 'Rebuild',
        authoredBrowserBuildPolicy,
        effectiveBrowserBuildPolicy: authoredBrowserBuildPolicy ?? 'live',
        effectiveBrowserBuildPolicySource: authoredBrowserBuildPolicy === null ? 'default' : 'self',
        effectiveBrowserBuildPolicySourceLabel:
          authoredBrowserBuildPolicy === null ? null : document.name,
        publishedOutputRows,
      } satisfies BrowserGraphRowVm)
      return rows
    }, [])
}
