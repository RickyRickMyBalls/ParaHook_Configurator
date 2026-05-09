import type { GraphOutputSurface } from '../outputSurface'
import type { GraphPreviewPreparation } from '../previewPreparation'
import type {
  GraphDocument,
  SpaghettiGraph,
} from '../schema/spaghettiTypes'
import {
  selectGraphDocumentById,
  selectGraphReceiveReferencesByDocumentId,
  selectGraphRuntimeByDocumentId,
} from './selectGraphDocumentRuntime'
import type {
  GraphRuntimeState,
  ResolvedGraphReceiveReference,
  SharedViewerCompositionState,
  SpaghettiStoreState,
} from '../store/useSpaghettiStore'

const EMPTY_RESOLVED_GRAPH_RECEIVE_REFERENCES: ResolvedGraphReceiveReference[] = []
const EMPTY_SHARED_VIEWER_COMPOSITION_GRAPH_DOCUMENT_IDS: string[] = []

export const selectViewerTargetGraphDocumentId = (
  state: Pick<SpaghettiStoreState, 'viewerTargetGraphDocumentId'>,
): string | null => state.viewerTargetGraphDocumentId

export const selectSharedViewerComposition = (
  state: Pick<SpaghettiStoreState, 'sharedViewerComposition'>,
): SharedViewerCompositionState | null => state.sharedViewerComposition

export const selectSharedViewerCompositionGraphDocumentIds = (
  state: Pick<SpaghettiStoreState, 'sharedViewerComposition'>,
): string[] =>
  state.sharedViewerComposition?.graphDocumentIds ?? EMPTY_SHARED_VIEWER_COMPOSITION_GRAPH_DOCUMENT_IDS

export const selectIsGraphDocumentInSharedViewerComposition = (
  state: Pick<SpaghettiStoreState, 'sharedViewerComposition'>,
  graphDocumentId: string,
): boolean => selectSharedViewerCompositionGraphDocumentIds(state).includes(graphDocumentId)

export const selectViewerTargetGraphDocument = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'viewerTargetGraphDocumentId'>,
): GraphDocument | null =>
  state.viewerTargetGraphDocumentId === null
    ? null
    : selectGraphDocumentById(state, state.viewerTargetGraphDocumentId)

export const selectViewerTargetGraph = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'viewerTargetGraphDocumentId'>,
): SpaghettiGraph | null => selectViewerTargetGraphDocument(state)?.graph ?? null

export const selectViewerTargetGraphRuntime = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GraphRuntimeState | null =>
  state.viewerTargetGraphDocumentId === null
    ? null
    : selectGraphRuntimeByDocumentId(state, state.viewerTargetGraphDocumentId)

export const selectGraphPreviewPreparationByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphPreviewPreparation | null =>
  selectGraphRuntimeByDocumentId(state, graphDocumentId)?.previewPreparation ?? null

export const selectGraphOutputSurfaceByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphOutputSurface | null =>
  selectGraphRuntimeByDocumentId(state, graphDocumentId)?.outputSurface ?? null

export const selectResolvedGraphReceiveReferencesByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): ResolvedGraphReceiveReference[] => {
  const receiveReferences = selectGraphReceiveReferencesByDocumentId(state, graphDocumentId)
  if (receiveReferences.length === 0) {
    return EMPTY_RESOLVED_GRAPH_RECEIVE_REFERENCES
  }

  return receiveReferences.map((reference) => {
    const sourceEntry =
      selectGraphOutputSurfaceByDocumentId(state, reference.sourceGraphDocumentId)?.entries.find(
        (entry) => entry.outputEntryId === reference.sourceOutputEntryId,
      ) ?? null
    return {
      ...reference,
      receivingGraphDocumentId: graphDocumentId,
      sourceEntry,
      resolutionState: sourceEntry?.state === 'resolved' ? 'resolved' : 'unresolved',
    }
  })
}

export const selectViewerTargetGraphOutputSurface = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GraphOutputSurface | null =>
  selectViewerTargetGraphRuntime(state)?.outputSurface ?? null

export const selectViewerTargetGraphPreviewPreparation = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'viewerTargetGraphDocumentId'>,
): GraphPreviewPreparation | null =>
  selectViewerTargetGraphRuntime(state)?.previewPreparation ?? null
