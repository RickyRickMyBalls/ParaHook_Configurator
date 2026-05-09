import { describe, expect, it } from 'vitest'
import type { GraphOutputSurface } from '../outputSurface'
import type { GraphPreviewPreparation } from '../previewPreparation'
import type { GraphDocument, GraphReceiveReference, SpaghettiGraph } from '../schema/spaghettiTypes'
import type {
  GraphRuntimeState,
  SharedViewerCompositionState,
  SpaghettiStoreState,
} from '../store/useSpaghettiStore'
import {
  selectGraphOutputSurfaceByDocumentId,
  selectGraphPreviewPreparationByDocumentId,
  selectIsGraphDocumentInSharedViewerComposition,
  selectResolvedGraphReceiveReferencesByDocumentId,
  selectSharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds,
  selectViewerTargetGraph,
  selectViewerTargetGraphDocument,
  selectViewerTargetGraphDocumentId,
  selectViewerTargetGraphOutputSurface,
  selectViewerTargetGraphPreviewPreparation,
  selectViewerTargetGraphRuntime,
} from './selectGraphViewerOutput'

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
    sourceOutputEntryId: 'output-2',
    mode: 'link',
  },
]

const graphDocumentOne: GraphDocument = {
  graphDocumentId: 'graph-document-1',
  name: 'Graph 1',
  version: 1,
  graph: {
    ...emptyGraph,
    receiveReferences,
  },
}

const graphDocumentTwo: GraphDocument = {
  graphDocumentId: 'graph-document-2',
  name: 'Graph 2',
  version: 1,
  graph: emptyGraph,
}

const previewPreparationOne = {
  outputPreviewNodeId: 'node-output-preview-1',
  outputSlotIds: ['s001'],
  previewCandidateSlotIds: ['s001'],
  previewCandidatePartKeys: ['part-1'],
  sourceNodeIdBySlotId: { s001: 'node-part-1' },
  sourcePartKeyBySlotId: { s001: 'part-1' },
  sourcePortIdBySlotId: { s001: 'solid' },
  sourcePartKeyByNodeId: { 'node-part-1': 'part-1' },
  slotStatusBySlotId: { s001: 'ok' },
  buildStatsReadyPartKeys: ['part-1'],
  previewIntent: 'outputPreview',
} as GraphPreviewPreparation

const previewPreparationTwo = {
  outputPreviewNodeId: 'node-output-preview-2',
  outputSlotIds: ['s002'],
  previewCandidateSlotIds: ['s002'],
  previewCandidatePartKeys: ['part-2'],
  sourceNodeIdBySlotId: { s002: 'node-part-2' },
  sourcePartKeyBySlotId: { s002: 'part-2' },
  sourcePortIdBySlotId: { s002: 'solid' },
  sourcePartKeyByNodeId: { 'node-part-2': 'part-2' },
  slotStatusBySlotId: { s002: 'ok' },
  buildStatsReadyPartKeys: ['part-2'],
  previewIntent: 'outputPreview',
} as GraphPreviewPreparation

const outputSurfaceOne: GraphOutputSurface = {
  graphDocumentId: 'graph-document-1',
  publishedAtBuildSeq: 1,
  surfaceVersion: 1,
  entries: [
    {
      outputEntryId: 'output-1',
      slotId: 's001',
      sourceNodeId: 'node-part-1',
      label: 'Object 1',
      state: 'resolved',
      acceptedArtifactKey: 'part-1',
    },
  ],
}

const outputSurfaceTwo: GraphOutputSurface = {
  graphDocumentId: 'graph-document-2',
  publishedAtBuildSeq: 2,
  surfaceVersion: 1,
  entries: [
    {
      outputEntryId: 'output-2',
      slotId: 's002',
      sourceNodeId: 'node-part-2',
      label: 'Object 2',
      state: 'resolved',
      acceptedArtifactKey: 'part-2',
    },
  ],
}

const graphRuntimeOne = {
  previewPreparation: previewPreparationOne,
  outputSurface: outputSurfaceOne,
} as unknown as GraphRuntimeState

const graphRuntimeTwo = {
  previewPreparation: previewPreparationTwo,
  outputSurface: outputSurfaceTwo,
} as unknown as GraphRuntimeState

const sharedViewerComposition: SharedViewerCompositionState = {
  compositionId: 'shared-viewer-1',
  graphDocumentIds: ['graph-document-2', 'graph-document-1'],
}

const createViewerState = (): Pick<
  SpaghettiStoreState,
  | 'graphDocumentsById'
  | 'graphRuntimeByDocumentId'
  | 'sharedViewerComposition'
  | 'viewerTargetGraphDocumentId'
> => ({
  viewerTargetGraphDocumentId: 'graph-document-2',
  sharedViewerComposition,
  graphDocumentsById: {
    [graphDocumentOne.graphDocumentId]: graphDocumentOne,
    [graphDocumentTwo.graphDocumentId]: graphDocumentTwo,
  },
  graphRuntimeByDocumentId: {
    [graphDocumentOne.graphDocumentId]: graphRuntimeOne,
    [graphDocumentTwo.graphDocumentId]: graphRuntimeTwo,
  },
})

describe('selectGraphViewerOutput', () => {
  it('resolves shared-viewer composition helpers deterministically', () => {
    const state = createViewerState()

    expect(selectSharedViewerComposition(state)).toBe(sharedViewerComposition)
    expect(selectSharedViewerCompositionGraphDocumentIds(state)).toEqual([
      'graph-document-2',
      'graph-document-1',
    ])
    expect(selectIsGraphDocumentInSharedViewerComposition(state, 'graph-document-1')).toBe(true)
    expect(selectIsGraphDocumentInSharedViewerComposition(state, 'missing-document')).toBe(false)
  })

  it('resolves viewer-target document, graph, and runtime projections', () => {
    const state = createViewerState()

    expect(selectViewerTargetGraphDocumentId(state)).toBe('graph-document-2')
    expect(selectViewerTargetGraphDocument(state)).toBe(graphDocumentTwo)
    expect(selectViewerTargetGraph(state)).toBe(graphDocumentTwo.graph)
    expect(selectViewerTargetGraphRuntime(state)).toBe(graphRuntimeTwo)
  })

  it('resolves graph-owned output surface and preview preparation reads', () => {
    const state = createViewerState()

    expect(selectGraphPreviewPreparationByDocumentId(state, 'graph-document-1')).toBe(
      previewPreparationOne,
    )
    expect(selectGraphOutputSurfaceByDocumentId(state, 'graph-document-2')).toBe(outputSurfaceTwo)
    expect(selectViewerTargetGraphPreviewPreparation(state)).toBe(previewPreparationTwo)
    expect(selectViewerTargetGraphOutputSurface(state)).toBe(outputSurfaceTwo)
  })

  it('resolves receive references against graph output surfaces by explicit source ids', () => {
    const state = createViewerState()

    expect(selectResolvedGraphReceiveReferencesByDocumentId(state, 'graph-document-1')).toEqual([
      {
        ...receiveReferences[0],
        receivingGraphDocumentId: 'graph-document-1',
        sourceEntry: outputSurfaceTwo.entries[0],
        resolutionState: 'resolved',
      },
    ])
  })

  it('returns null or empty values when viewer target and receive sources are missing', () => {
    const state = {
      viewerTargetGraphDocumentId: null,
      sharedViewerComposition: null,
      graphDocumentsById: {
        [graphDocumentOne.graphDocumentId]: graphDocumentOne,
      },
      graphRuntimeByDocumentId: {
        [graphDocumentOne.graphDocumentId]: graphRuntimeOne,
      },
    } satisfies Pick<
      SpaghettiStoreState,
      | 'graphDocumentsById'
      | 'graphRuntimeByDocumentId'
      | 'sharedViewerComposition'
      | 'viewerTargetGraphDocumentId'
    >

    expect(selectSharedViewerComposition(state)).toBeNull()
    expect(selectSharedViewerCompositionGraphDocumentIds(state)).toEqual([])
    expect(selectViewerTargetGraphDocument(state)).toBeNull()
    expect(selectViewerTargetGraph(state)).toBeNull()
    expect(selectViewerTargetGraphRuntime(state)).toBeNull()
    expect(selectViewerTargetGraphPreviewPreparation(state)).toBeNull()
    expect(selectViewerTargetGraphOutputSurface(state)).toBeNull()
    expect(selectResolvedGraphReceiveReferencesByDocumentId(state, 'missing-document')).toEqual([])
  })
})
