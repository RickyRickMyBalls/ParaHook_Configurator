import { describe, expect, it } from 'vitest'
import type { GraphDocument, GraphReceiveReference, SpaghettiGraph } from '../schema/spaghettiTypes'
import type {
  CachedGraphEntry,
  GraphRuntimeState,
  SpaghettiStoreState,
} from '../store/useSpaghettiStore'
import {
  selectActiveGraph,
  selectActiveGraphCompileResult,
  selectActiveGraphDocument,
  selectActiveGraphRuntime,
  selectCachedGraphEntryByDocumentId,
  selectCachedGraphEntryById,
  selectGraphBrowserStorageWorkingSetSnapshot,
  selectGraphByDocumentId,
  selectGraphCompileResultByDocumentId,
  selectGraphDocumentById,
  selectGraphReceiveReferencesByDocumentId,
  selectGraphRuntimeByDocumentId,
  selectOrderedCachedGraphEntries,
  selectOrderedGraphDocuments,
} from './selectGraphDocumentRuntime'

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

const receiveReferences: GraphReceiveReference[] = [
  {
    receiveId: 'receive-1',
    receiveNodeId: 'node-receive-1',
    sourceGraphDocumentId: 'graph-document-2',
    sourceOutputEntryId: 'output-1',
    mode: 'link',
  },
]

const graphOne: SpaghettiGraph = {
  ...emptyGraph,
  receiveReferences,
}

const graphTwo: SpaghettiGraph = {
  ...emptyGraph,
}

const graphDocumentOne: GraphDocument = {
  graphDocumentId: 'graph-document-1',
  name: 'Graph 1',
  version: 1,
  graph: graphOne,
}

const graphDocumentTwo: GraphDocument = {
  graphDocumentId: 'graph-document-2',
  name: 'Graph 2',
  version: 1,
  graph: graphTwo,
}

const cachedEntryOne: CachedGraphEntry = {
  cachedGraphId: 'graph-document-1',
  graphDocumentId: 'graph-document-1',
  source: 'in-memory',
  isDirty: true,
}

const cachedEntryTwo: CachedGraphEntry = {
  cachedGraphId: 'cached-graph-2',
  graphDocumentId: 'graph-document-2',
  source: 'file-load',
  isDirty: false,
}

const compileResult = {
  marker: 'compile-result',
} as unknown as GraphRuntimeState['compileBuild']['lastCompileResult']

const graphRuntimeOne = {
  compileBuild: {
    lastCompileResult: compileResult,
  },
} as unknown as GraphRuntimeState

const graphRuntimeTwo = {
  compileBuild: {
    lastCompileResult: null,
  },
} as unknown as GraphRuntimeState

const createSelectorState = (): Pick<
  SpaghettiStoreState,
  | 'activeGraphDocumentId'
  | 'cachedGraphEntriesById'
  | 'cachedGraphEntryOrder'
  | 'graph'
  | 'graphDocumentOrder'
  | 'graphDocumentsById'
  | 'graphRuntimeByDocumentId'
> => ({
  graph: emptyGraph,
  activeGraphDocumentId: 'graph-document-1',
  graphDocumentsById: {
    [graphDocumentOne.graphDocumentId]: graphDocumentOne,
    [graphDocumentTwo.graphDocumentId]: graphDocumentTwo,
  },
  graphDocumentOrder: ['graph-document-2', 'missing-document', 'graph-document-1'],
  graphRuntimeByDocumentId: {
    [graphDocumentOne.graphDocumentId]: graphRuntimeOne,
    [graphDocumentTwo.graphDocumentId]: graphRuntimeTwo,
  },
  cachedGraphEntriesById: {
    [cachedEntryOne.cachedGraphId]: cachedEntryOne,
    [cachedEntryTwo.cachedGraphId]: cachedEntryTwo,
  },
  cachedGraphEntryOrder: ['cached-graph-2', 'missing-entry', 'graph-document-1'],
})

describe('selectGraphDocumentRuntime', () => {
  it('returns the active graph document and graph when the active document exists', () => {
    const state = createSelectorState()

    expect(selectActiveGraphDocument(state)).toBe(graphDocumentOne)
    expect(selectActiveGraph(state)).toBe(graphOne)
    expect(selectGraphDocumentById(state, 'graph-document-2')).toBe(graphDocumentTwo)
    expect(selectGraphByDocumentId(state, 'graph-document-2')).toBe(graphTwo)
  })

  it('falls back to a default graph document when the active document is missing', () => {
    const state = {
      graph: emptyGraph,
      graphDocumentsById: {},
      activeGraphDocumentId: 'missing-document',
    } satisfies Pick<
      SpaghettiStoreState,
      'graph' | 'graphDocumentsById' | 'activeGraphDocumentId'
    >

    expect(selectActiveGraphDocument(state)).toEqual({
      graphDocumentId: 'graph-document-1',
      name: 'Graph 1',
      version: 1,
      graph: emptyGraph,
    })
    expect(selectActiveGraph(state)).toBe(emptyGraph)
  })

  it('orders documents and cached entries while filtering missing ids', () => {
    const state = createSelectorState()

    expect(selectOrderedGraphDocuments(state).map((document) => document.graphDocumentId)).toEqual([
      'graph-document-2',
      'graph-document-1',
    ])
    expect(selectOrderedCachedGraphEntries(state).map((entry) => entry.cachedGraphId)).toEqual([
      'cached-graph-2',
      'graph-document-1',
    ])
  })

  it('projects graph-browser snapshot, cache lookup, and receive references', () => {
    const state = createSelectorState()

    expect(selectGraphBrowserStorageWorkingSetSnapshot(state)).toEqual({
      graphDocumentsById: state.graphDocumentsById,
      graphDocumentOrder: state.graphDocumentOrder,
      activeGraphDocumentId: state.activeGraphDocumentId,
    })
    expect(selectCachedGraphEntryById(state, 'graph-document-1')).toBe(cachedEntryOne)
    expect(selectCachedGraphEntryByDocumentId(state, 'graph-document-2')).toBe(cachedEntryTwo)
    expect(selectGraphReceiveReferencesByDocumentId(state, 'graph-document-1')).toBe(
      receiveReferences,
    )
    expect(selectGraphReceiveReferencesByDocumentId(state, 'missing-document')).toEqual([])
  })

  it('resolves runtime and compile results through active and document selectors', () => {
    const state = createSelectorState()

    expect(selectGraphRuntimeByDocumentId(state, 'graph-document-1')).toBe(graphRuntimeOne)
    expect(selectActiveGraphRuntime(state)).toBe(graphRuntimeOne)
    expect(selectGraphCompileResultByDocumentId(state, 'graph-document-1')).toBe(compileResult)
    expect(selectActiveGraphCompileResult(state)).toBe(compileResult)
    expect(selectGraphRuntimeByDocumentId(state, 'missing-document')).toBeNull()
    expect(selectGraphCompileResultByDocumentId(state, 'missing-document')).toBeNull()
  })
})
