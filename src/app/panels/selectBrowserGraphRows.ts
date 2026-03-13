import type { GraphOutputSurface } from '../spaghetti/outputSurface'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import type {
  CachedGraphEntry,
  GraphRuntimeState,
} from '../spaghetti/store/useSpaghettiStore'

export type BrowserPublishedGraphOutputRowVm = {
  rowId: string
  outputEntryId: string
  label: string
  meta: string
  state: 'empty' | 'resolved' | 'unresolved'
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
  if (entry.state === 'resolved') {
    return entry.acceptedArtifactKey === null
      ? `Resolved | ${publishedMeta}`
      : `Resolved | ${entry.acceptedArtifactKey} | ${publishedMeta}`
  }
  if (entry.state === 'unresolved') {
    return `Unresolved | ${publishedMeta}`
  }
  return `Empty | ${publishedMeta}`
}

export const selectBrowserGraphRows = (options: {
  cachedGraphEntryOrder: string[]
  cachedGraphEntriesById: Record<string, CachedGraphEntry>
  graphDocumentsById: Record<string, GraphDocument>
  graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
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
    hasFocusedViewportByGraphDocumentId,
    openViewportCountByGraphDocumentId,
  } = options

  return cachedGraphEntryOrder
    .map((cachedGraphId) => cachedGraphEntriesById[cachedGraphId] ?? null)
    .map((entry) => {
      if (entry === null) {
        return null
      }
      const document = graphDocumentsById[entry.graphDocumentId] ?? null
      if (document === null) {
        return null
      }

      const isFocused = activeGraphDocumentId === document.graphDocumentId
      const openViewportCount =
        openViewportCountByGraphDocumentId.get(document.graphDocumentId) ?? 0
      const hasFocusedViewport =
        hasFocusedViewportByGraphDocumentId.get(document.graphDocumentId) ?? false
      const lifecycleStatus = entry.isDirty ? 'Dirty' : 'Saved'
      const runtime = graphRuntimeByDocumentId[document.graphDocumentId]
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

      const outputSurface = runtime?.outputSurface ?? null
      const publishedOutputRows = (outputSurface?.entries ?? []).map((publishedEntry) => ({
        rowId: `published-output-row:${document.graphDocumentId}:${publishedEntry.outputEntryId}`,
        outputEntryId: publishedEntry.outputEntryId,
        label: publishedEntry.label,
        meta: describePublishedOutputMeta(outputSurface, publishedEntry),
        state: publishedEntry.state,
      }))

      return {
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
        publishedOutputRows,
      } satisfies BrowserGraphRowVm
    })
    .filter((row): row is BrowserGraphRowVm => row !== null)
}
