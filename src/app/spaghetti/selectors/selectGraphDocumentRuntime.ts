import type { GraphBrowserStorageWorkingSetSnapshot } from '../store/graphBrowserStoragePersistence'
import type {
  CachedGraphEntry,
  GraphRuntimeState,
  SpaghettiStoreState,
} from '../store/useSpaghettiStore'
import type {
  GraphDocument,
  GraphReceiveReference,
  SpaghettiGraph,
} from '../schema/spaghettiTypes'

const EMPTY_GRAPH_RECEIVE_REFERENCES: GraphReceiveReference[] = []

const createFallbackGraphDocument = (graph: SpaghettiGraph): GraphDocument => ({
  graphDocumentId: 'graph-document-1',
  name: 'Graph 1',
  version: 1,
  graph,
})

export const selectActiveGraphDocument = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'activeGraphDocumentId' | 'graph'>,
): GraphDocument => {
  const activeDocument = state.graphDocumentsById[state.activeGraphDocumentId]
  if (activeDocument !== undefined) {
    return activeDocument
  }
  return createFallbackGraphDocument(state.graph)
}

export const selectGraphDocumentById = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById'>,
  graphDocumentId: string,
): GraphDocument | null => state.graphDocumentsById[graphDocumentId] ?? null

export const selectOrderedGraphDocuments = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'graphDocumentOrder'>,
): GraphDocument[] =>
  state.graphDocumentOrder
    .map((graphDocumentId) => state.graphDocumentsById[graphDocumentId] ?? null)
    .filter((document): document is GraphDocument => document !== null)

export const selectGraphBrowserStorageWorkingSetSnapshot = (
  state: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'activeGraphDocumentId'
  >,
): Pick<
  GraphBrowserStorageWorkingSetSnapshot,
  'graphDocumentsById' | 'graphDocumentOrder' | 'activeGraphDocumentId'
> => ({
  graphDocumentsById: state.graphDocumentsById,
  graphDocumentOrder: state.graphDocumentOrder,
  activeGraphDocumentId: state.activeGraphDocumentId,
})

export const selectCachedGraphEntryById = (
  state: Pick<SpaghettiStoreState, 'cachedGraphEntriesById'>,
  cachedGraphId: string,
): CachedGraphEntry | null => state.cachedGraphEntriesById[cachedGraphId] ?? null

export const selectCachedGraphEntryByDocumentId = (
  state: Pick<SpaghettiStoreState, 'cachedGraphEntriesById'>,
  graphDocumentId: string,
): CachedGraphEntry | null =>
  Object.values(state.cachedGraphEntriesById).find(
    (entry) => entry.graphDocumentId === graphDocumentId,
  ) ?? null

export const selectOrderedCachedGraphEntries = (
  state: Pick<SpaghettiStoreState, 'cachedGraphEntriesById' | 'cachedGraphEntryOrder'>,
): CachedGraphEntry[] =>
  state.cachedGraphEntryOrder
    .map((cachedGraphId) => state.cachedGraphEntriesById[cachedGraphId] ?? null)
    .filter((entry): entry is CachedGraphEntry => entry !== null)

export const selectActiveGraph = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'activeGraphDocumentId' | 'graph'>,
): SpaghettiGraph => selectActiveGraphDocument(state).graph

export const selectGraphByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById'>,
  graphDocumentId: string,
): SpaghettiGraph | null => selectGraphDocumentById(state, graphDocumentId)?.graph ?? null

export const selectGraphReceiveReferencesByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphDocumentsById'>,
  graphDocumentId: string,
): GraphReceiveReference[] =>
  selectGraphByDocumentId(state, graphDocumentId)?.receiveReferences ?? EMPTY_GRAPH_RECEIVE_REFERENCES

export const selectGraphRuntimeByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphRuntimeState | null => state.graphRuntimeByDocumentId[graphDocumentId] ?? null

export const selectActiveGraphRuntime = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'activeGraphDocumentId'>,
): GraphRuntimeState | null =>
  selectGraphRuntimeByDocumentId(state, state.activeGraphDocumentId)

export const selectGraphCompileResultByDocumentId = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId'>,
  graphDocumentId: string,
): GraphRuntimeState['compileBuild']['lastCompileResult'] =>
  selectGraphRuntimeByDocumentId(state, graphDocumentId)?.compileBuild.lastCompileResult ?? null

export const selectActiveGraphCompileResult = (
  state: Pick<SpaghettiStoreState, 'graphRuntimeByDocumentId' | 'activeGraphDocumentId'>,
): GraphRuntimeState['compileBuild']['lastCompileResult'] =>
  selectActiveGraphRuntime(state)?.compileBuild.lastCompileResult ?? null
