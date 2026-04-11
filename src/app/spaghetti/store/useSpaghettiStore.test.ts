import { afterEach, describe, expect, it, vi } from 'vitest'
import { buildDispatcher } from '../../buildDispatcher'
import { useConsoleStore } from '../../console/useConsoleStore'
import { useWorkspaceStore } from '../../workspace/useWorkspaceStore'
import {
  loadGraphDocumentFromFile,
  saveGraphDocumentToFile,
  serializeGraphDocument,
} from '../../io/graphDocumentPersistence'
import type { SpaghettiGraph } from '../schema/spaghettiTypes'
import { OUTPUT_PREVIEW_NODE_TYPE } from '../system/outputPreviewNode'
import {
  defaultViewportPosition,
  defaultViewportSize,
  selectActiveEditorViewport,
  selectCachedGraphEntryById,
  selectActiveGraphDocument,
  selectActiveGraphRuntime,
  selectGraphAcceptedDraftGeometryResultByDocumentId,
  selectGraphAcceptedGeometryResultByDocumentId,
  selectEditorViewportConsolePreviewNodeId,
  selectEditorViewportSelectedEdgeId,
  selectEditorViewportSelectedNodeId,
  selectGraphAcceptedBuildOutputsByDocumentId,
  selectGraphOutputSurfaceByDocumentId,
  selectOrderedCachedGraphEntries,
  selectGraphDocumentById,
  selectGraphByDocumentId,
  selectGraphReceiveReferencesByDocumentId,
  selectNodeMode,
  selectOrderedEditorViewports,
  selectOrderedGraphDocuments,
  selectResolvedGraphReceiveReferencesByDocumentId,
  selectSharedViewerComposition,
  selectSharedViewerCompositionGraphDocumentIds,
  selectViewerTargetGraphAcceptedAuthoritativeGeometryResult,
  selectViewerTargetGraphAcceptedBuildOutputs,
  selectViewerTargetGraphCommittedAuthoritativeGeometryResult,
  selectViewerTargetGraphCommittedDraftGeometryResult,
  selectViewerTargetGraphDocumentId,
  selectViewerTargetGraphOutputSurface,
  useSpaghettiStore,
} from './useSpaghettiStore'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  type BuildResultBundle,
  type PartArtifact,
} from '../../../shared/buildTypes'
import type { GeometryResultBundle } from '../../../shared/geometryResult'
import type { SketchFeature } from '../features/featureTypes'

const emptyGraph: SpaghettiGraph = {
  schemaVersion: 1,
  nodes: [],
  edges: [],
}

const baseplateArtifact: PartArtifact = {
  id: 'baseplate',
  label: 'Baseplate',
  kind: 'box',
  params: { width: 1, length: 2, height: 3 },
  partKeyStr: 'baseplate',
  partKey: { id: 'baseplate', instance: null },
}

const cubeArtifact: PartArtifact = {
  id: 'cube',
  label: 'Cube',
  kind: 'box',
  params: { width: 4, length: 5, height: 6 },
  partKeyStr: 'cube',
  partKey: { id: 'cube', instance: null },
}

const createAcceptedBundle = (options: {
  seq: number
  graphDocumentId: string
  buildRequestId: string
  entries: Array<{
    artifact: PartArtifact
    outputEntryId: string
    sourceNodeId: string | null
  }>
}): BuildResultBundle => ({
  buildRequestId: options.buildRequestId,
  graphDocumentId: options.graphDocumentId,
  seq: options.seq,
  resultClass: 'final',
  executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
  summary: {
    rebuiltCount: options.entries.length,
    retainedCount: 0,
    evictedCount: 0,
  },
  entries: options.entries.map((entry) => ({
    buildUnitId: entry.outputEntryId,
    outputEntryId: entry.outputEntryId,
    sourceNodeId: entry.sourceNodeId,
    status: 'rebuilt',
    resultClass: 'final',
    artifacts: [entry.artifact],
  })),
})

const createAcceptedGeometryResult = (options: {
  graphDocumentId: string
  buildRequestId: string
  partKeys: string[]
}): GeometryResultBundle => ({
  schemaVersion: 1,
  request: {
    graphDocumentId: options.graphDocumentId,
    buildRequestId: options.buildRequestId,
    partKeys: [...options.partKeys],
  },
  resultClass: 'draft',
  status: 'ok',
  bodies: {},
  meshPreview: null,
  diagnostics: [],
  trace: [],
  authoritativeHandle: null,
})

const createAcceptedAuthoritativeGeometryResult = (options: {
  graphDocumentId: string
  buildRequestId: string
  partKeys: string[]
  handleId?: string
}): GeometryResultBundle => ({
  schemaVersion: 1,
  request: {
    graphDocumentId: options.graphDocumentId,
    buildRequestId: options.buildRequestId,
    partKeys: [...options.partKeys],
  },
  resultClass: 'authoritative',
  status: 'ok',
  bodies: {},
  meshPreview: null,
  diagnostics: [],
  trace: [],
  authoritativeHandle: {
    resourceType: 'shape_set',
    handleId: options.handleId ?? `shape-set:${options.graphDocumentId}:${options.buildRequestId}`,
  },
})

const graphWithPublishedPart = (
  nodeId: string,
  nodeType: string,
  slotId: string = 's001',
): SpaghettiGraph => ({
  schemaVersion: 1,
  nodes: [
    {
      nodeId: 'node-output-preview-1',
      type: OUTPUT_PREVIEW_NODE_TYPE,
      params: {
        slots: [{ slotId }],
        nextSlotIndex: 2,
      },
    },
    {
      nodeId,
      type: nodeType,
      params: {},
    },
  ],
  edges: [
    {
      edgeId: `edge-${slotId}`,
      from: { nodeId, portId: 'solid' },
      to: { nodeId: 'node-output-preview-1', portId: `in:solid:${slotId}` },
    },
  ],
})

describe('useSpaghettiStore graph normalization', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
  })

  it('setGraph auto-creates OutputPreview singleton when missing', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const outputPreviewNodes = normalized.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )

    expect(outputPreviewNodes).toHaveLength(1)
    expect(outputPreviewNodes[0].params).toEqual({
      componentLabel: 'Published Component',
      objects: [
        { objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 },
      ],
      slots: [{ slotId: 's001' }],
      nextSlotIndex: 2,
    })
  })

  it('keeps the active GraphDocument in sync with the canonical graph bridge', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)

    const state = useSpaghettiStore.getState()
    const activeDocument = selectActiveGraphDocument(state)

    expect(state.activeGraphDocumentId).toBe(activeDocument.graphDocumentId)
    expect(state.graphDocumentOrder).toEqual([activeDocument.graphDocumentId])
    expect(state.graphDocumentsById[activeDocument.graphDocumentId]).toEqual(activeDocument)
    expect(activeDocument.graph).toEqual(state.graph)
  })

  it('boots with no open editor viewport until Browser opens one', () => {
    const state = useSpaghettiStore.getState()
    const activeDocument = selectActiveGraphDocument(state)
    const activeViewport = selectActiveEditorViewport(state)

    expect(activeViewport).toBeNull()
    expect(state.editorViewportOrder).toEqual([])
    expect(state.activeGraphDocumentId).toBe(activeDocument.graphDocumentId)
  })

  it('selectGraphByDocumentId resolves the document graph before any viewport is opened', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const state = useSpaghettiStore.getState()
    const activeDocument = selectActiveGraphDocument(state)

    expect(selectGraphByDocumentId(state, activeDocument.graphDocumentId)).toEqual(state.graph)
  })

  it('createGraphDocument adds a second graph document without replacing the active bridge', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const state = useSpaghettiStore.getState()
    expect(selectOrderedGraphDocuments(state).map((document) => document.graphDocumentId)).toEqual([
      'graph-document-1',
      secondGraphId,
    ])
    expect(selectGraphDocumentById(state, secondGraphId)?.name).toBe('Graph 2')
    expect(state.activeGraphDocumentId).toBe('graph-document-1')
  })

  it('seeds cached graph entries for live graph documents and marks in-memory graphs dirty', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const state = useSpaghettiStore.getState()
    expect(selectOrderedCachedGraphEntries(state).map((entry) => entry.cachedGraphId)).toEqual([
      'graph-document-1',
      secondGraphId,
    ])
    expect(selectCachedGraphEntryById(state, 'graph-document-1')).toMatchObject({
      cachedGraphId: 'graph-document-1',
      graphDocumentId: 'graph-document-1',
      source: 'in-memory',
      isDirty: true,
    })
    expect(selectCachedGraphEntryById(state, secondGraphId)).toMatchObject({
      cachedGraphId: secondGraphId,
      graphDocumentId: secondGraphId,
      source: 'in-memory',
      isDirty: true,
    })
  })

  it('openGraphDocumentInViewport creates and focuses a new viewport while syncing the active graph bridge', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const nextViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    const state = useSpaghettiStore.getState()
    const orderedViewports = selectOrderedEditorViewports(state)
    const activeViewport = selectActiveEditorViewport(state)

    expect(nextViewportId).not.toBeNull()
    expect(orderedViewports).toHaveLength(1)
    expect(activeViewport?.editorViewportId).toBe(nextViewportId)
    expect(activeViewport?.graphDocumentId).toBe(secondGraphId)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
    expect(state.graph).toEqual(selectGraphByDocumentId(state, secondGraphId))
  })

  it('openGraphDocumentInViewport open-or-focuses an existing viewport for the same graph', () => {
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const state = useSpaghettiStore.getState()

    expect(firstViewportId).not.toBeNull()
    expect(secondViewportId).toBe(firstViewportId)
    expect(selectOrderedEditorViewports(state)).toHaveLength(1)
    expect(selectActiveEditorViewport(state)?.editorViewportId).toBe(firstViewportId)
    expect(state.activeGraphDocumentId).toBe('graph-document-1')
  })

  it('openGraphDocumentInNewViewport creates a second viewport on the same graph document', () => {
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInNewViewport(
      'graph-document-1',
    )
    const state = useSpaghettiStore.getState()
    const orderedViewports = selectOrderedEditorViewports(state)

    expect(firstViewportId).not.toBeNull()
    expect(secondViewportId).not.toBeNull()
    expect(secondViewportId).not.toBe(firstViewportId)
    expect(orderedViewports).toHaveLength(2)
    expect(orderedViewports.map((viewport) => viewport.graphDocumentId)).toEqual([
      'graph-document-1',
      'graph-document-1',
    ])
    expect(orderedViewports[0]?.position).toEqual(defaultViewportPosition)
    expect(orderedViewports[1]?.position).toEqual({
      x: defaultViewportPosition.x + 32,
      y: defaultViewportPosition.y + 32,
    })
    expect(selectActiveEditorViewport(state)?.editorViewportId).toBe(secondViewportId)
    expect(state.activeGraphDocumentId).toBe('graph-document-1')
  })

  it('bindEditorViewportToGraphDocument rebinds the viewport and refreshes the active graph bridge', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const activeViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const activeViewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(activeViewportId).not.toBeNull()
    expect(activeViewport).not.toBeNull()

    useSpaghettiStore
      .getState()
      .bindEditorViewportToGraphDocument(activeViewport?.editorViewportId ?? '', secondGraphId)

    const state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.graphDocumentId).toBe(secondGraphId)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
    expect(state.graph).toEqual(selectGraphByDocumentId(state, secondGraphId))
  })

  it('keeps node and preview selection local to each editor viewport while mirroring the active viewport globally', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInNewViewport(secondGraphId)

    expect(firstViewportId).not.toBeNull()
    expect(secondViewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportSelectedNodeId(firstViewportId ?? '', 'node-1')
    useSpaghettiStore
      .getState()
      .setEditorViewportConsolePreviewNodeId(firstViewportId ?? '', 'node-1')
    useSpaghettiStore
      .getState()
      .setEditorViewportSelectedNodeId(secondViewportId ?? '', 'node-second-1')
    useSpaghettiStore
      .getState()
      .setEditorViewportConsolePreviewNodeId(secondViewportId ?? '', 'node-second-1')

    useSpaghettiStore.getState().setActiveEditorViewportId(firstViewportId ?? '')
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-1')
    expect(useSpaghettiStore.getState().consolePreviewNodeId).toBe('node-1')

    useSpaghettiStore.getState().setActiveEditorViewportId(secondViewportId ?? '')

    const state = useSpaghettiStore.getState()
    expect(state.selectedNodeId).toBe('node-second-1')
    expect(state.consolePreviewNodeId).toBe('node-second-1')
    expect(selectEditorViewportSelectedNodeId(state, firstViewportId ?? '')).toBe('node-1')
    expect(selectEditorViewportSelectedNodeId(state, secondViewportId ?? '')).toBe('node-second-1')
    expect(selectEditorViewportConsolePreviewNodeId(state, firstViewportId ?? '')).toBe('node-1')
    expect(selectEditorViewportConsolePreviewNodeId(state, secondViewportId ?? '')).toBe(
      'node-second-1',
    )
  })

  it('bindEditorViewportToGraphDocument clears the rebound viewport local node edge and preview selection', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')

    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportSelectedNodeId(viewportId ?? '', 'node-1')
    useSpaghettiStore.getState().setEditorViewportSelectedEdgeId(viewportId ?? '', 'edge-1')
    useSpaghettiStore.getState().setEditorViewportConsolePreviewNodeId(viewportId ?? '', 'node-1')

    useSpaghettiStore.getState().bindEditorViewportToGraphDocument(viewportId ?? '', secondGraphId)

    const state = useSpaghettiStore.getState()
    expect(selectEditorViewportSelectedNodeId(state, viewportId ?? '')).toBeNull()
    expect(selectEditorViewportSelectedEdgeId(state, viewportId ?? '')).toBeNull()
    expect(selectEditorViewportConsolePreviewNodeId(state, viewportId ?? '')).toBeNull()
    expect(state.selectedNodeId).toBeNull()
    expect(state.selectedEdgeId).toBeNull()
    expect(state.consolePreviewNodeId).toBeNull()
  })

  it('swapFocusedEditorViewportToGraphDocument rebinds only the focused viewport', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInNewViewport(
      'graph-document-1',
    )

    expect(firstViewportId).not.toBeNull()
    expect(secondViewportId).not.toBeNull()

    const reboundViewportId = useSpaghettiStore
      .getState()
      .swapFocusedEditorViewportToGraphDocument(secondGraphId)

    const state = useSpaghettiStore.getState()
    expect(reboundViewportId).toBe(secondViewportId)
    expect(state.editorViewportsById[firstViewportId ?? '']?.graphDocumentId).toBe('graph-document-1')
    expect(state.editorViewportsById[secondViewportId ?? '']?.graphDocumentId).toBe(secondGraphId)
    expect(selectActiveEditorViewport(state)?.editorViewportId).toBe(secondViewportId)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
  })

  it('viewer target follows focused viewport changes and viewport rebinding', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    expect(firstViewportId).not.toBeNull()
    expect(secondViewportId).not.toBeNull()

    expect(selectViewerTargetGraphDocumentId(useSpaghettiStore.getState())).toBe(secondGraphId)

    useSpaghettiStore.getState().setActiveEditorViewportId(firstViewportId ?? '')
    expect(selectViewerTargetGraphDocumentId(useSpaghettiStore.getState())).toBe('graph-document-1')

    useSpaghettiStore
      .getState()
      .bindEditorViewportToGraphDocument(firstViewportId ?? '', secondGraphId)

    expect(selectViewerTargetGraphDocumentId(useSpaghettiStore.getState())).toBe(secondGraphId)
  })

  it('shared viewer composition is explicitly authored by viewport actions and survives focus changes', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const duplicateFirstViewportId = useSpaghettiStore.getState().openGraphDocumentInNewViewport(
      'graph-document-1',
    )
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)

    expect(firstViewportId).not.toBeNull()
    expect(duplicateFirstViewportId).not.toBeNull()
    expect(secondViewportId).not.toBeNull()

    useSpaghettiStore
      .getState()
      .addEditorViewportGraphToSharedViewerComposition(firstViewportId ?? '')
    useSpaghettiStore
      .getState()
      .addEditorViewportGraphToSharedViewerComposition(duplicateFirstViewportId ?? '')
    useSpaghettiStore
      .getState()
      .addEditorViewportGraphToSharedViewerComposition(secondViewportId ?? '')

    expect(selectSharedViewerCompositionGraphDocumentIds(useSpaghettiStore.getState())).toEqual([
      'graph-document-1',
      secondGraphId,
    ])

    useSpaghettiStore.getState().setActiveEditorViewportId(firstViewportId ?? '')

    const state = useSpaghettiStore.getState()
    expect(selectViewerTargetGraphDocumentId(state)).toBe('graph-document-1')
    expect(selectSharedViewerCompositionGraphDocumentIds(state)).toEqual([
      'graph-document-1',
      secondGraphId,
    ])
  })

  it('removing the last shared viewer composition member clears the session', () => {
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')

    expect(firstViewportId).not.toBeNull()

    useSpaghettiStore
      .getState()
      .addEditorViewportGraphToSharedViewerComposition(firstViewportId ?? '')
    expect(selectSharedViewerComposition(useSpaghettiStore.getState())).not.toBeNull()

    useSpaghettiStore
      .getState()
      .removeEditorViewportGraphFromSharedViewerComposition(firstViewportId ?? '')

    expect(selectSharedViewerComposition(useSpaghettiStore.getState())).toBeNull()
  })

  it('swapFocusedEditorViewportToGraphDocument no-ops when no focused viewport exists', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    const reboundViewportId = useSpaghettiStore
      .getState()
      .swapFocusedEditorViewportToGraphDocument(secondGraphId)

    const state = useSpaghettiStore.getState()
    expect(reboundViewportId).toBeNull()
    expect(selectActiveEditorViewport(state)).toBeNull()
    expect(state.activeGraphDocumentId).toBe('graph-document-1')
  })

  it('stores compile/build runtime per graph document and keeps preview-prep graph-local', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-cube-1',
            type: 'Part/Cube',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    useSpaghettiStore.getState().setGraphCompileResult('graph-document-1', {
      ok: true,
      diagnostics: { errors: [], warnings: [] },
      buildInputs: {
        orderedPartKeys: ['baseplate'],
        resolvedParts: {},
      },
    })
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      pendingTargetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      pendingAffectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      buildRequestId: 'build-request-42',
      buildSeq: 42,
    })

    const state = useSpaghettiStore.getState()
    const firstRuntime = state.graphRuntimeByDocumentId['graph-document-1']
    const secondRuntime = state.graphRuntimeByDocumentId[secondGraphId]

    expect(firstRuntime.compileBuild.lastCompileResult?.ok).toBe(true)
    expect(firstRuntime.compileBuild.currentDocumentRevision).toBe(0)
    expect(firstRuntime.compileBuild.currentGraphRevision).toBe(0)
    expect(firstRuntime.compileBuild.latestIssuedGraphRevision).toBe(0)
    expect(firstRuntime.compileBuild.inFlightGraphRevision).toBe(0)
    expect(firstRuntime.compileBuild.latestAcceptedGraphRevision).toBeNull()
    expect(firstRuntime.compileBuild.pendingStatsPartKeys).toEqual(['baseplate'])
    expect(firstRuntime.compileBuild.pendingTargetBuildUnitIds).toEqual([
      'output-entry:s001:node-baseplate-1',
    ])
    expect(firstRuntime.compileBuild.pendingAffectedBuildUnitIds).toEqual([
      'output-entry:s001:node-baseplate-1',
    ])
    expect(firstRuntime.previewPreparation.buildStatsReadyPartKeys).toEqual(['baseplate'])
    expect(secondRuntime.compileBuild.lastCompileResult).toBeNull()
    expect(secondRuntime.previewPreparation.previewIntent).toBe('outputPreview')
  })

  it('marks the active cached graph entry dirty when the graph document is edited', async () => {
    const savedBlobParts: BlobPart[] = []
    const saveEnv: NonNullable<Parameters<typeof saveGraphDocumentToFile>[2]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'a') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return {
            href: '',
            download: '',
            click: () => undefined,
            remove: () => undefined,
          }
        },
        body: {
          appendChild: () => undefined,
        },
      },
      urlRef: {
        createObjectURL: (blob: Blob) => {
          savedBlobParts.push(blob)
          return 'blob:graph-document'
        },
        revokeObjectURL: () => undefined,
      },
    }

    await useSpaghettiStore.getState().saveCachedGraphEntryToFile('graph-document-1', {
      savedAt: '2026-03-10T00:00:00.000Z',
      env: saveEnv,
    })

    expect(selectCachedGraphEntryById(useSpaghettiStore.getState(), 'graph-document-1')?.isDirty).toBe(
      false,
    )

    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    })

    const state = useSpaghettiStore.getState()
    expect(savedBlobParts).toHaveLength(1)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.currentDocumentRevision).toBe(1)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.currentGraphRevision).toBe(1)
    expect(selectCachedGraphEntryById(state, 'graph-document-1')).toMatchObject({
      isDirty: true,
      lastSavedAt: '2026-03-10T00:00:00.000Z',
    })
  })

  it('keeps document revision moving for node-position edits without advancing geometry revision', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    })

    const runtimeAfterGeometryEdit =
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']
    expect(runtimeAfterGeometryEdit?.compileBuild.currentDocumentRevision).toBe(1)
    expect(runtimeAfterGeometryEdit?.compileBuild.currentGraphRevision).toBe(1)

    useSpaghettiStore.getState().setNodePos('node-baseplate-1', 123.4, 456.7)

    const state = useSpaghettiStore.getState()
    expect(state.graph.ui?.nodes?.['node-baseplate-1']).toEqual({
      x: 123,
      y: 457,
    })
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.currentDocumentRevision).toBe(
      2,
    )
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.currentGraphRevision).toBe(1)
  })

  it('acceptGraphBuildResult records the accepted graph revision even if the graph changed after the build request was staged', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      pendingTargetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      pendingAffectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      buildRequestId: 'build-request-revision',
      buildSeq: 12,
    })

    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-2',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    })

    const accepted = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-revision',
      buildSeq: 12,
    })

    const state = useSpaghettiStore.getState()
    expect(accepted).toBe(true)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.currentGraphRevision).toBe(1)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.latestAcceptedGraphRevision).toBe(0)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.latestAcceptedBuildUnitIds).toEqual([
      'output-entry:s001:node-baseplate-1',
    ])
  })

  it('keeps accepted build impact null before the first accepted build lands', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      pendingTargetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      pendingAffectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      buildRequestId: 'build-request-impact-pending',
      buildSeq: 21,
    })

    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.acceptedBuildImpact,
    ).toBeNull()
  })

  it('acceptGraphBuildResult persists accepted build impact from pending request inputs and finalized bundle truth', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_width', 'sp_featureStackIR'],
      pendingStatsPartKeys: ['baseplate'],
      pendingTargetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      pendingAffectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      buildRequestId: 'build-request-impact-accepted',
      buildSeq: 22,
    })

    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-impact-accepted',
      buildSeq: 22,
      bundle: createAcceptedBundle({
        seq: 22,
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-impact-accepted',
        entries: [
          {
            artifact: baseplateArtifact,
            outputEntryId: 'output-entry:s001:node-baseplate-1',
            sourceNodeId: 'node-baseplate-1',
          },
        ],
      }),
    })

    const runtime = useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']
    expect(runtime?.acceptedBuildImpact).toEqual({
      seq: 22,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-impact-accepted',
      changedParamIds: ['sp_width', 'sp_featureStackIR'],
      affectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      targetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      summary: runtime?.acceptedBuildBundle?.summary,
      entries: runtime?.acceptedBuildBundle?.entries.map((entry) => ({
        buildUnitId: entry.buildUnitId,
        outputEntryId: entry.outputEntryId,
        sourceNodeId: entry.sourceNodeId,
        status: entry.status,
        resultClass: entry.resultClass,
      })),
    })
    expect(runtime?.compileBuild.pendingAffectedBuildUnitIds).toEqual([])
    expect(runtime?.compileBuild.pendingTargetBuildUnitIds).toEqual([])
  })

  it('later accepted builds replace the prior accepted build impact snapshot', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      pendingTargetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      pendingAffectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      buildRequestId: 'build-request-impact-first',
      buildSeq: 23,
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-impact-first',
      buildSeq: 23,
      bundle: createAcceptedBundle({
        seq: 23,
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-impact-first',
        entries: [
          {
            artifact: baseplateArtifact,
            outputEntryId: 'output-entry:s001:node-baseplate-1',
            sourceNodeId: 'node-baseplate-1',
          },
        ],
      }),
    })

    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_height'],
      pendingStatsPartKeys: ['baseplate'],
      pendingTargetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      pendingAffectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      buildRequestId: 'build-request-impact-second',
      buildSeq: 24,
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-impact-second',
      buildSeq: 24,
      bundle: createAcceptedBundle({
        seq: 24,
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-impact-second',
        entries: [],
      }),
    })

    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.acceptedBuildImpact,
    ).toEqual({
      seq: 24,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-impact-second',
      changedParamIds: ['sp_height'],
      affectedBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      targetBuildUnitIds: ['output-entry:s001:node-baseplate-1'],
      summary: {
        rebuiltCount: 0,
        retainedCount: 0,
        evictedCount: 1,
      },
      entries: [
        {
          buildUnitId: 'output-entry:s001:node-baseplate-1',
          outputEntryId: 'output-entry:s001:node-baseplate-1',
          sourceNodeId: 'node-baseplate-1',
          status: 'evicted',
          resultClass: 'final',
        },
      ],
    })
  })

  it('saving to disk clears save state without changing accepted build freshness', async () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-save',
      buildSeq: 13,
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-save',
      buildSeq: 13,
    })

    const saveEnv: NonNullable<Parameters<typeof saveGraphDocumentToFile>[2]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'a') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return {
            href: '',
            download: '',
            click: () => undefined,
            remove: () => undefined,
          }
        },
        body: {
          appendChild: () => undefined,
        },
      },
      urlRef: {
        createObjectURL: () => 'blob:graph-document',
        revokeObjectURL: () => undefined,
      },
    }

    await useSpaghettiStore.getState().saveCachedGraphEntryToFile('graph-document-1', {
      savedAt: '2026-03-13T11:44:00.000Z',
      env: saveEnv,
    })

    const state = useSpaghettiStore.getState()
    expect(selectCachedGraphEntryById(state, 'graph-document-1')?.isDirty).toBe(false)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.currentGraphRevision).toBe(0)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.latestAcceptedGraphRevision).toBe(0)
  })

  it('loadGraphDocumentFromFile creates a clean file-load cached entry', async () => {
    const loadedDocument = {
      graphDocumentId: 'graph-document-loaded',
      name: 'Loaded Graph',
      version: 1 as const,
      graph: {
        schemaVersion: 1 as const,
        nodes: [
          {
            nodeId: 'node-loaded-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
    }
    const input = {
      type: '',
      accept: '',
      onchange: null as (() => void) | null,
      files: [
        {
          text: async () => serializeGraphDocument(loadedDocument),
        },
      ],
      click: () => {
        input.onchange?.()
      },
      remove: () => undefined,
    }
    const loadEnv: NonNullable<Parameters<typeof loadGraphDocumentFromFile>[1]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'input') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return input
        },
        body: {
          appendChild: () => undefined,
        },
      },
      urlRef: {
        createObjectURL: () => 'blob:unused',
        revokeObjectURL: () => undefined,
      },
    }

    const loadedGraphId = await useSpaghettiStore.getState().loadGraphDocumentFromFile({
      env: loadEnv,
    })

    const state = useSpaghettiStore.getState()
    expect(loadedGraphId).toBe('graph-document-loaded')
    expect(selectGraphDocumentById(state, loadedGraphId)?.name).toBe('Loaded Graph')
    expect(selectCachedGraphEntryById(state, loadedGraphId)).toMatchObject({
      cachedGraphId: loadedGraphId,
      graphDocumentId: loadedGraphId,
      source: 'file-load',
      isDirty: false,
    })
  })

  it('loadGraphDocumentIntoNewGraphFromFile clones file contents into a fresh dirty graph identity', async () => {
    const loadedDocument = {
      graphDocumentId: 'graph-document-loaded',
      name: 'Loaded Graph',
      version: 1 as const,
      graph: {
        schemaVersion: 1 as const,
        nodes: [
          {
            nodeId: 'node-loaded-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
    }
    const input = {
      type: '',
      accept: '',
      onchange: null as (() => void) | null,
      files: [
        {
          text: async () => serializeGraphDocument(loadedDocument),
        },
      ],
      click: () => {
        input.onchange?.()
      },
      remove: () => undefined,
    }
    const loadEnv: NonNullable<Parameters<typeof loadGraphDocumentFromFile>[1]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'input') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return input
        },
        body: {
          appendChild: () => undefined,
        },
      },
      urlRef: {
        createObjectURL: () => 'blob:unused',
        revokeObjectURL: () => undefined,
      },
    }

    const clonedGraphId = await useSpaghettiStore.getState().loadGraphDocumentIntoNewGraphFromFile({
      env: loadEnv,
    })

    const state = useSpaghettiStore.getState()
    expect(clonedGraphId).not.toBe('graph-document-loaded')
    expect(selectGraphDocumentById(state, clonedGraphId)?.name).toBe('Loaded Graph')
    expect(
      selectGraphDocumentById(state, clonedGraphId)?.graph.nodes.some(
        (node) => node.nodeId === 'node-loaded-1' && node.type === 'Part/Baseplate',
      ),
    ).toBe(true)
    expect(selectCachedGraphEntryById(state, clonedGraphId)).toMatchObject({
      cachedGraphId: clonedGraphId,
      graphDocumentId: clonedGraphId,
      source: 'in-memory',
      isDirty: true,
    })
    expect(state.activeGraphDocumentId).toBe(clonedGraphId)
    expect(selectActiveEditorViewport(state)).toBeNull()
  })

  it('saveFocusedEditorViewportGraphToFile saves the graph bound to the focused viewport', async () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: { widthMm: 42 },
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)

    const savedBlobs: Blob[] = []
    const saveEnv: NonNullable<Parameters<typeof saveGraphDocumentToFile>[2]> = {
      BlobCtor: Blob,
      documentRef: {
        createElement: (tagName) => {
          if (tagName !== 'a') {
            throw new Error(`Unexpected tag: ${tagName}`)
          }
          return {
            href: '',
            download: '',
            click: () => undefined,
            remove: () => undefined,
          }
        },
        body: {
          appendChild: () => undefined,
        },
      },
      urlRef: {
        createObjectURL: (blob: Blob) => {
          savedBlobs.push(blob)
          return 'blob:graph-document'
        },
        revokeObjectURL: () => undefined,
      },
    }

    await useSpaghettiStore.getState().saveFocusedEditorViewportGraphToFile({
      savedAt: '2026-03-11T00:20:00.000Z',
      env: saveEnv,
    })

    expect(savedBlobs).toHaveLength(1)
    await expect(savedBlobs[0].text()).resolves.toContain(`"graphDocumentId":"${secondGraphId}"`)
    expect(selectCachedGraphEntryById(useSpaghettiStore.getState(), secondGraphId)).toMatchObject({
      isDirty: false,
      lastSavedAt: '2026-03-11T00:20:00.000Z',
    })
  })

  it('acceptGraphBuildResult resolves the tracked graph document by build seq', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-99',
      buildSeq: 99,
    })

    const accepted = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-99',
      buildSeq: 99,
    })

    const state = useSpaghettiStore.getState()
    expect(accepted).toBe(true)
    expect(selectActiveGraphRuntime(state)?.compileBuild.lastBuildSeq).toBe(99)
    expect(state.graphDocumentIdByBuildSeq[99]).toBeUndefined()
  })

  it('acceptGraphBuildResult stores accepted build outputs per graph without cross-graph overwrite', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-cube-1',
            type: 'Part/Cube',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-11',
      buildSeq: 11,
    })
    useSpaghettiStore.getState().stageGraphBuildRequest(secondGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube'],
      pendingStatsPartKeys: ['cube'],
      buildRequestId: 'build-request-22',
      buildSeq: 22,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-11',
        buildSeq: 11,
        bundle: createAcceptedBundle({
          seq: 11,
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-11',
          entries: [
            {
              artifact: baseplateArtifact,
              outputEntryId: 'output-entry:s001:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
            },
          ],
        }),
      }),
    ).toBe(true)
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-22',
        buildSeq: 22,
        bundle: createAcceptedBundle({
          seq: 22,
          graphDocumentId: secondGraphId,
          buildRequestId: 'build-request-22',
          entries: [
            {
              artifact: cubeArtifact,
              outputEntryId: 'output-entry:s001:node-cube-1',
              sourceNodeId: 'node-cube-1',
            },
          ],
        }),
      }),
    ).toBe(true)

    const state = useSpaghettiStore.getState()
    expect(selectGraphAcceptedBuildOutputsByDocumentId(state, 'graph-document-1')).toEqual([
      baseplateArtifact,
    ])
    expect(selectGraphAcceptedBuildOutputsByDocumentId(state, secondGraphId)).toEqual([
      cubeArtifact,
    ])
    useSpaghettiStore.getState().setViewerTargetGraphDocumentId(secondGraphId)
    expect(selectViewerTargetGraphAcceptedBuildOutputs(useSpaghettiStore.getState())).toEqual([
      cubeArtifact,
    ])
  })

  it('acceptGraphBuildResult stores retained geometry results per graph without cross-graph overwrite', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-cube-1',
            type: 'Part/Cube',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )

    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-31',
      buildSeq: 31,
    })
    useSpaghettiStore.getState().stageGraphBuildRequest(secondGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube'],
      pendingStatsPartKeys: ['cube'],
      buildRequestId: 'build-request-32',
      buildSeq: 32,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-31',
        buildSeq: 31,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-31',
          partKeys: ['baseplate'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-31',
          partKeys: ['baseplate'],
        }),
      }),
    ).toBe(true)
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-32',
        buildSeq: 32,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId: secondGraphId,
          buildRequestId: 'build-request-32',
          partKeys: ['cube'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId: secondGraphId,
          buildRequestId: 'build-request-32',
          partKeys: ['cube'],
        }),
      }),
    ).toBe(true)

    const state = useSpaghettiStore.getState()
    expect(selectGraphAcceptedGeometryResultByDocumentId(state, 'graph-document-1')).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-31',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(selectGraphAcceptedDraftGeometryResultByDocumentId(state, 'graph-document-1')).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-31',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(selectGraphAcceptedGeometryResultByDocumentId(state, secondGraphId)).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId: secondGraphId,
          buildRequestId: 'build-request-32',
          partKeys: ['cube'],
        },
      }),
    )
    expect(selectGraphAcceptedDraftGeometryResultByDocumentId(state, secondGraphId)).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId: secondGraphId,
          buildRequestId: 'build-request-32',
          partKeys: ['cube'],
        },
      }),
    )
  })

  it('preserves retained geometry when a later accepted build result omits geometryResult', () => {
    const graphDocumentId = 'graph-document-1'

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-41',
      buildSeq: 41,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-41',
        buildSeq: 41,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-41',
          partKeys: ['baseplate'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-41',
          partKeys: ['baseplate'],
        }),
      }),
    ).toBe(true)

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-42',
      buildSeq: 42,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-42',
        buildSeq: 42,
        bundle: createAcceptedBundle({
          graphDocumentId,
          buildRequestId: 'build-request-42',
          seq: 42,
          entries: [
            {
              outputEntryId: 'baseplate',
              sourceNodeId: 'node-part-1',
              artifact: baseplateArtifact,
            },
          ],
        }),
      }),
    ).toBe(true)

    const state = useSpaghettiStore.getState()
    expect(selectGraphAcceptedGeometryResultByDocumentId(state, graphDocumentId)).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-41',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(
      state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedDraftGeometryResult,
    ).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-41',
          partKeys: ['baseplate'],
        },
      }),
    )
  })

  it('authoritative-only acceptance promotes the authoritative lane without clearing accepted draft truth', () => {
    const graphDocumentId = 'graph-document-1'
    const releaseSpy = vi
      .spyOn(buildDispatcher, 'releaseAuthoritativeHandles')
      .mockImplementation(() => {})

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_seed'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-51',
      buildSeq: 51,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-51',
        buildSeq: 51,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-51',
          partKeys: ['baseplate'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-51',
          partKeys: ['baseplate'],
          handleId: 'shape-set-authoritative-51',
        }),
      }),
    ).toBe(true)

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_final'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-52',
      buildSeq: 52,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-52',
        buildSeq: 52,
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-52',
          partKeys: ['baseplate'],
          handleId: 'shape-set-authoritative-52',
        }),
      }),
    ).toBe(true)

    const state = useSpaghettiStore.getState()
    expect(state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedDraftGeometryResult).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-51',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(
      state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedAuthoritativeGeometryResult,
    ).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-52',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(releaseSpy).toHaveBeenCalledWith(['shape-set-authoritative-51'])
  })

  it('draft-only acceptance preserves previously accepted authoritative truth', () => {
    const graphDocumentId = 'graph-document-1'

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_seed'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-61',
      buildSeq: 61,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-61',
        buildSeq: 61,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-61',
          partKeys: ['baseplate'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-61',
          partKeys: ['baseplate'],
          handleId: 'shape-set-authoritative-61',
        }),
      }),
    ).toBe(true)

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_preview'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-62',
      buildSeq: 62,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-62',
        buildSeq: 62,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-62',
          partKeys: ['baseplate'],
        }),
      }),
    ).toBe(true)

    const state = useSpaghettiStore.getState()
    expect(state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedDraftGeometryResult).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-62',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(
      state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedAuthoritativeGeometryResult,
    ).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-61',
          partKeys: ['baseplate'],
        },
      }),
    )
  })

  it('treats preserved authoritative truth as stale after a newer draft-only acceptance advances the current revision', () => {
    const graphDocumentId = 'graph-document-1'

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_seed'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-71',
      buildSeq: 71,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-71',
        buildSeq: 71,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-71',
          partKeys: ['baseplate'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-71',
          partKeys: ['baseplate'],
          handleId: 'shape-set-authoritative-71',
        }),
      }),
    ).toBe(true)

    useSpaghettiStore.setState((state) => ({
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        [graphDocumentId]: {
          ...state.graphRuntimeByDocumentId[graphDocumentId]!,
          compileBuild: {
            ...state.graphRuntimeByDocumentId[graphDocumentId]!.compileBuild,
            currentGraphRevision: 2,
          },
        },
      },
    }))

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_preview'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-72',
      buildSeq: 72,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-72',
        buildSeq: 72,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-72',
          partKeys: ['baseplate'],
        }),
      }),
    ).toBe(true)

    const state = useSpaghettiStore.getState()
    expect(state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedAuthoritativeGeometryResult).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-71',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedAuthoritativeGraphRevision).toBe(0)
    expect(state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedDraftGraphRevision).toBe(2)
    expect(selectGraphAcceptedGeometryResultByDocumentId(state, graphDocumentId)).toBeNull()
    expect(selectGraphAcceptedDraftGeometryResultByDocumentId(state, graphDocumentId)).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-72',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(selectViewerTargetGraphAcceptedAuthoritativeGeometryResult(state)).toBeNull()
    expect(selectViewerTargetGraphCommittedAuthoritativeGeometryResult(state)).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-71',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(selectViewerTargetGraphCommittedDraftGeometryResult(state)).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-72',
          partKeys: ['baseplate'],
        },
      }),
    )
  })

  it('derives graph-owned output surfaces per graph and keeps them independent of viewer target changes', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      graphWithPublishedPart('node-cube-1', 'Part/Cube'),
      'Graph 2',
    )

    let state = useSpaghettiStore.getState()
    expect(selectGraphOutputSurfaceByDocumentId(state, 'graph-document-1')?.entries).toMatchObject([
      {
        slotId: 's001',
        state: 'empty',
        acceptedArtifactKey: null,
      },
    ])
    expect(selectGraphOutputSurfaceByDocumentId(state, secondGraphId)?.entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          slotId: 's001',
          sourceNodeId: 'node-cube-1',
          state: 'unresolved',
          acceptedArtifactKey: null,
        }),
      ]),
    )

    useSpaghettiStore.getState().stageGraphBuildRequest(secondGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube'],
      pendingStatsPartKeys: ['cube'],
      buildRequestId: 'build-request-surface',
      buildSeq: 7,
    })
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-surface',
        buildSeq: 7,
        bundle: createAcceptedBundle({
          seq: 7,
          graphDocumentId: secondGraphId,
          buildRequestId: 'build-request-surface',
          entries: [
            {
              artifact: cubeArtifact,
              outputEntryId: 'output-entry:s001:node-cube-1',
              sourceNodeId: 'node-cube-1',
            },
          ],
        }),
      }),
    ).toBe(true)

    state = useSpaghettiStore.getState()
    expect(selectGraphOutputSurfaceByDocumentId(state, secondGraphId)).toMatchObject({
      graphDocumentId: secondGraphId,
      publishedAtBuildSeq: 7,
      surfaceVersion: 1,
      entries: expect.arrayContaining([
        expect.objectContaining({
          slotId: 's001',
          sourceNodeId: 'node-cube-1',
          state: 'resolved',
          acceptedArtifactKey: 'cube',
        }),
      ]),
    })
    const firstGraphSurface = selectGraphOutputSurfaceByDocumentId(state, 'graph-document-1')
    expect(firstGraphSurface?.entries).toMatchObject([
      {
        slotId: 's001',
        state: 'empty',
        acceptedArtifactKey: null,
      },
    ])

    useSpaghettiStore.getState().setViewerTargetGraphDocumentId(secondGraphId)
    expect(selectViewerTargetGraphOutputSurface(useSpaghettiStore.getState())?.graphDocumentId).toBe(
      secondGraphId,
    )
    expect(selectGraphOutputSurfaceByDocumentId(useSpaghettiStore.getState(), 'graph-document-1')).toEqual(
      firstGraphSurface,
    )
  })

  it('stores graph-authored receive references on the targeted graph document by explicit ids', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      graphWithPublishedPart('node-cube-1', 'Part/Cube'),
      'Graph 2',
    )

    const receiveId = useSpaghettiStore.getState().addGraphReceiveReference('graph-document-1', {
      receiveId: 'receive-1',
      sourceGraphDocumentId: secondGraphId,
      sourceOutputEntryId: 'output-entry:s001:node-cube-1',
    })

    expect(receiveId).toBe('receive-1')
    expect(selectGraphReceiveReferencesByDocumentId(useSpaghettiStore.getState(), 'graph-document-1')).toEqual(
      [
        {
          receiveId: 'receive-1',
          sourceGraphDocumentId: secondGraphId,
          sourceOutputEntryId: 'output-entry:s001:node-cube-1',
          mode: 'link',
        },
      ],
    )
    expect(selectGraphReceiveReferencesByDocumentId(useSpaghettiStore.getState(), secondGraphId)).toEqual(
      [],
    )
  })

  it('resolves linked receive references by explicit source graph and output ids', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      graphWithPublishedPart('node-cube-1', 'Part/Cube'),
      'Graph 2',
    )

    useSpaghettiStore.getState().stageGraphBuildRequest(secondGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube'],
      pendingStatsPartKeys: ['cube'],
      buildRequestId: 'build-request-receive',
      buildSeq: 31,
    })
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-receive',
        buildSeq: 31,
        bundle: createAcceptedBundle({
          seq: 31,
          graphDocumentId: secondGraphId,
          buildRequestId: 'build-request-receive',
          entries: [
            {
              artifact: cubeArtifact,
              outputEntryId: 'output-entry:s001:node-cube-1',
              sourceNodeId: 'node-cube-1',
            },
          ],
        }),
      }),
    ).toBe(true)

    useSpaghettiStore.getState().addGraphReceiveReference('graph-document-1', {
      receiveId: 'receive-1',
      sourceGraphDocumentId: secondGraphId,
      sourceOutputEntryId: 'output-entry:s001:node-cube-1',
    })

    expect(
      selectResolvedGraphReceiveReferencesByDocumentId(useSpaghettiStore.getState(), 'graph-document-1'),
    ).toEqual([
      expect.objectContaining({
        receiveId: 'receive-1',
        sourceGraphDocumentId: secondGraphId,
        sourceOutputEntryId: 'output-entry:s001:node-cube-1',
        receivingGraphDocumentId: 'graph-document-1',
        resolutionState: 'resolved',
        sourceEntry: expect.objectContaining({
          outputEntryId: 'output-entry:s001:node-cube-1',
          state: 'resolved',
        }),
      }),
    ])
  })

  it('keeps linked receive resolution independent from graph labels, viewer target, and graph order', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      graphWithPublishedPart('node-cube-1', 'Part/Cube'),
      'Same Label',
    )
    const thirdGraphId = useSpaghettiStore.getState().createGraphDocument(
      graphWithPublishedPart('node-cube-2', 'Part/Cube'),
      'Same Label',
    )

    useSpaghettiStore.getState().stageGraphBuildRequest(secondGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube_a'],
      pendingStatsPartKeys: ['cube'],
      buildRequestId: 'build-request-a',
      buildSeq: 32,
    })
    useSpaghettiStore.getState().stageGraphBuildRequest(thirdGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube_b'],
      pendingStatsPartKeys: ['cube'],
      buildRequestId: 'build-request-b',
      buildSeq: 33,
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: secondGraphId,
      buildRequestId: 'build-request-a',
      buildSeq: 32,
      bundle: createAcceptedBundle({
        seq: 32,
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-a',
        entries: [
          {
            artifact: cubeArtifact,
            outputEntryId: 'output-entry:s001:node-cube-1',
            sourceNodeId: 'node-cube-1',
          },
        ],
      }),
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: thirdGraphId,
      buildRequestId: 'build-request-b',
      buildSeq: 33,
      bundle: createAcceptedBundle({
        seq: 33,
        graphDocumentId: thirdGraphId,
        buildRequestId: 'build-request-b',
        entries: [
          {
            artifact: cubeArtifact,
            outputEntryId: 'output-entry:s001:node-cube-2',
            sourceNodeId: 'node-cube-2',
          },
        ],
      }),
    })

    useSpaghettiStore.getState().addGraphReceiveReference('graph-document-1', {
      receiveId: 'receive-1',
      sourceGraphDocumentId: thirdGraphId,
      sourceOutputEntryId: 'output-entry:s001:node-cube-2',
    })

    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    useSpaghettiStore.getState().setViewerTargetGraphDocumentId(secondGraphId)

    expect(
      selectResolvedGraphReceiveReferencesByDocumentId(useSpaghettiStore.getState(), 'graph-document-1'),
    ).toEqual([
      expect.objectContaining({
        receiveId: 'receive-1',
        sourceGraphDocumentId: thirdGraphId,
        sourceOutputEntryId: 'output-entry:s001:node-cube-2',
        resolutionState: 'resolved',
      }),
    ])
  })

  it('keeps missing linked source publications in an unresolved state and supports explicit removal', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      graphWithPublishedPart('node-cube-1', 'Part/Cube'),
      'Graph 2',
    )

    useSpaghettiStore.getState().addGraphReceiveReference('graph-document-1', {
      receiveId: 'receive-1',
      sourceGraphDocumentId: secondGraphId,
      sourceOutputEntryId: 'output-entry:s001:node-cube-1',
    })

    expect(
      selectResolvedGraphReceiveReferencesByDocumentId(useSpaghettiStore.getState(), 'graph-document-1'),
    ).toEqual([
      expect.objectContaining({
        receiveId: 'receive-1',
        resolutionState: 'unresolved',
        sourceEntry: expect.objectContaining({
          outputEntryId: 'output-entry:s001:node-cube-1',
          state: 'unresolved',
        }),
      }),
    ])

    expect(useSpaghettiStore.getState().removeGraphReceiveReference('graph-document-1', 'receive-1')).toBe(
      true,
    )
    expect(selectGraphReceiveReferencesByDocumentId(useSpaghettiStore.getState(), 'graph-document-1')).toEqual(
      [],
    )
  })

  it('acceptGraphBuildResult rejects stale writes directly at the graph runtime boundary', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-1',
      buildSeq: 1,
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-1',
      buildSeq: 1,
    })

    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_width'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-2',
      buildSeq: 2,
    })

    const accepted = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-1',
      buildSeq: 1,
    })

    const state = useSpaghettiStore.getState()
    expect(accepted).toBe(false)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.latestAcceptedBuildSeq).toBe(1)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.inFlightBuildSeq).toBe(2)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.acceptedBuildImpact).toEqual({
      seq: 1,
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-1',
      changedParamIds: ['sp_full'],
      affectedBuildUnitIds: [],
      targetBuildUnitIds: [],
      summary: {
        rebuiltCount: 0,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: [],
    })
  })

  it('acceptGraphBuildResult releases stale authoritative handles even when the result is rejected', () => {
    const releaseSpy = vi
      .spyOn(buildDispatcher, 'releaseAuthoritativeHandles')
      .mockImplementation(() => {})

    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-11',
      buildSeq: 11,
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-11',
      buildSeq: 11,
    })

    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_width'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-12',
      buildSeq: 12,
    })

    const accepted = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-11',
      buildSeq: 11,
      authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-11',
        partKeys: ['baseplate'],
        handleId: 'shape-set-stale-11',
      }),
    })

    expect(accepted).toBe(false)
    expect(releaseSpy).toHaveBeenCalledWith(['shape-set-stale-11'])
  })

  it('stale authoritative arrivals do not roll accepted draft or authoritative truth backward', () => {
    const graphDocumentId = 'graph-document-1'
    const releaseSpy = vi
      .spyOn(buildDispatcher, 'releaseAuthoritativeHandles')
      .mockImplementation(() => {})

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_seed'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-71',
      buildSeq: 71,
    })
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-71',
        buildSeq: 71,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-71',
          partKeys: ['baseplate'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-71',
          partKeys: ['baseplate'],
          handleId: 'shape-set-authoritative-71',
        }),
      }),
    ).toBe(true)

    useSpaghettiStore.getState().stageGraphBuildRequest(graphDocumentId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_newer'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-72',
      buildSeq: 72,
    })
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId,
        buildRequestId: 'build-request-72',
        buildSeq: 72,
        draftGeometryResult: createAcceptedGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-72',
          partKeys: ['baseplate'],
        }),
        authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
          graphDocumentId,
          buildRequestId: 'build-request-72',
          partKeys: ['baseplate'],
          handleId: 'shape-set-authoritative-72',
        }),
      }),
    ).toBe(true)

    const accepted = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId,
      buildRequestId: 'build-request-71',
      buildSeq: 71,
      draftGeometryResult: createAcceptedGeometryResult({
        graphDocumentId,
        buildRequestId: 'build-request-71',
        partKeys: ['baseplate'],
      }),
      authoritativeGeometryResult: createAcceptedAuthoritativeGeometryResult({
        graphDocumentId,
        buildRequestId: 'build-request-71',
        partKeys: ['baseplate'],
        handleId: 'shape-set-stale-71',
      }),
    })

    const state = useSpaghettiStore.getState()
    expect(accepted).toBe(false)
    expect(state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedDraftGeometryResult).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-72',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(
      state.graphRuntimeByDocumentId[graphDocumentId]?.acceptedAuthoritativeGeometryResult,
    ).toEqual(
      expect.objectContaining({
        request: {
          graphDocumentId,
          buildRequestId: 'build-request-72',
          partKeys: ['baseplate'],
        },
      }),
    )
    expect(releaseSpy).toHaveBeenCalledWith(['shape-set-authoritative-71'])
    expect(releaseSpy).toHaveBeenCalledWith(['shape-set-stale-71'])
  })

  it('focus changes do not rebind an in-flight graph build result', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-focus',
      buildSeq: 7,
    })

    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)

    const accepted = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-focus',
      buildSeq: 7,
    })

    const state = useSpaghettiStore.getState()
    expect(accepted).toBe(true)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.latestAcceptedBuildSeq).toBe(7)
    expect(state.graphRuntimeByDocumentId[secondGraphId]?.compileBuild.latestAcceptedBuildSeq).toBeNull()
  })

  it('viewport graph switches do not rebind in-flight graph result ownership', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
            orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      buildRequestId: 'build-request-viewport',
      buildSeq: 8,
    })

    useSpaghettiStore
      .getState()
      .bindEditorViewportToGraphDocument(viewportId ?? '', secondGraphId)

    const accepted = useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-viewport',
      buildSeq: 8,
    })

    const state = useSpaghettiStore.getState()
    expect(accepted).toBe(true)
    expect(selectActiveEditorViewport(state)?.graphDocumentId).toBe(secondGraphId)
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.latestAcceptedBuildSeq).toBe(8)
    expect(state.graphRuntimeByDocumentId[secondGraphId]?.compileBuild.latestAcceptedBuildSeq).toBeNull()
  })

  it('closeEditorViewport falls back to the highest z-order remaining viewport', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-second-1',
            type: 'Part/Baseplate',
            params: {},
          },
        ],
        edges: [],
      },
      'Graph 2',
    )
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    expect(secondViewportId).not.toBeNull()
    expect(firstViewportId).not.toBeNull()

    useSpaghettiStore.getState().setActiveEditorViewportId(firstViewportId ?? '')
    useSpaghettiStore.getState().closeEditorViewport(firstViewportId ?? '')

    const state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.editorViewportId).toBe(secondViewportId)
    expect(state.activeGraphDocumentId).toBe(secondGraphId)
  })

  it('setEditorViewportWindowMode toggles maximized back to the default floating size', () => {
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportPosition(viewportId ?? '', { x: 48, y: 72 })
    useSpaghettiStore.getState().setEditorViewportSize(viewportId ?? '', { width: 640, height: 520 })

    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'maximized')
    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'maximized')

    const viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(viewport?.windowMode).toBe('expanded')
    expect(viewport?.position).toEqual(defaultViewportPosition)
    expect(viewport?.size).toEqual(defaultViewportSize)
  })

  it('setEditorViewportWindowMode toggles split view back to the captured prior expanded state', () => {
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportPosition(viewportId ?? '', { x: 60, y: 90 })
    useSpaghettiStore.getState().setEditorViewportSize(viewportId ?? '', { width: 700, height: 540 })

    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'split view')

    let viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(viewport?.windowMode).toBe('split view')
    expect(viewport?.splitRatio).toBe(0.5)
    expect(viewport?.splitDirection).toBe('horizontal')
    expect(viewport?.splitPriority).toBe('balanced')
    expect(viewport?.restoreFromSplit).toEqual({
      windowMode: 'expanded',
      position: { x: 60, y: 90 },
      size: { width: 700, height: 540 },
    })

    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'split view')

    viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(viewport?.windowMode).toBe('expanded')
    expect(viewport?.position).toEqual({ x: 60, y: 90 })
    expect(viewport?.size).toEqual({ width: 700, height: 540 })
    expect(viewport?.restoreFromSplit).toBeNull()
  })

  it('setEditorViewportWindowMode toggles collapsed back to the captured prior split state', () => {
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'split view')
    useSpaghettiStore.getState().setEditorViewportSplitRatio(viewportId ?? '', 0.7)
    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'collapsed')

    let viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(viewport?.windowMode).toBe('collapsed')
    expect(viewport?.restoreFromCollapsed).toEqual({
      windowMode: 'split view',
      position: defaultViewportPosition,
      size: defaultViewportSize,
      splitRatio: 0.7,
    })

    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'collapsed')

    viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(viewport?.windowMode).toBe('split view')
    expect(viewport?.splitRatio).toBe(0.7)
    expect(viewport?.restoreFromCollapsed).toBeNull()
  })

  it('setEditorViewportWindowMode toggles separateWindow back to the captured prior split state', () => {
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'split view')
    useSpaghettiStore.getState().setEditorViewportSplitDockSide(viewportId ?? '', 'right')
    useSpaghettiStore.getState().setEditorViewportSplitRatio(viewportId ?? '', 0.62)
    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'separateWindow')

    let viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    let editorSurface =
      useWorkspaceStore.getState().editorSurfacePlacementById[viewportId ?? ''] ?? null

    expect(viewport?.windowMode).toBe('separateWindow')
    expect(viewport?.restoreFromSeparateWindow).toEqual({
      windowMode: 'split view',
      position: defaultViewportPosition,
      size: defaultViewportSize,
      splitRatio: 0.62,
      splitDirection: 'vertical',
      splitDockSide: 'right',
      splitPriority: 'balanced',
    })
    expect(editorSurface?.popoutState?.owner).toBe('child-window')

    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'separateWindow')

    viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    editorSurface = useWorkspaceStore.getState().editorSurfacePlacementById[viewportId ?? ''] ?? null
    expect(viewport?.windowMode).toBe('split view')
    expect(viewport?.splitDockSide).toBe('right')
    expect(viewport?.splitDirection).toBe('vertical')
    expect(viewport?.splitRatio).toBe(0.62)
    expect(viewport?.restoreFromSeparateWindow).toBeNull()
    expect(editorSurface?.popoutState?.owner).toBe('main-app')
  })

  it('stores split direction and priority per editor viewport', () => {
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportSplitDirection(viewportId ?? '', 'vertical')
    useSpaghettiStore.getState().setEditorViewportSplitDockSide(viewportId ?? '', 'left')
    useSpaghettiStore.getState().setEditorViewportSplitPriority(viewportId ?? '', 'favorSecond')

    const viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(viewport?.splitDirection).toBe('vertical')
    expect(viewport?.splitDockSide).toBe('left')
    expect(viewport?.splitPriority).toBe('favorSecond')
  })

  it('mirrors editor placement ownership into the shared workspace store', () => {
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportPosition(viewportId ?? '', { x: 60, y: 90 })
    useSpaghettiStore.getState().setEditorViewportSize(viewportId ?? '', { width: 700, height: 540 })
    useSpaghettiStore.getState().setEditorViewportSplitDirection(viewportId ?? '', 'vertical')
    useSpaghettiStore.getState().setEditorViewportSplitDockSide(viewportId ?? '', 'left')
    useSpaghettiStore.getState().setEditorViewportSplitPriority(viewportId ?? '', 'favorSecond')
    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'split view')

    const editorSurface =
      useWorkspaceStore.getState().editorSurfacePlacementById[viewportId ?? ''] ?? null

    expect(editorSurface).not.toBeNull()
    expect(editorSurface?.surfaceKind).toBe('spaghettiEditor')
    expect(editorSurface?.surfaceInstanceId).toBe(viewportId)
    expect(editorSurface?.presentationMode).toBe('tiled')
    expect(editorSurface?.windowMode).toBe('split view')
    expect(editorSurface?.position).toEqual({ x: 60, y: 90 })
    expect(editorSurface?.size).toEqual({ width: 700, height: 540 })
    expect(editorSurface?.splitDirection).toBe('vertical')
    expect(editorSurface?.splitDockSide).toBe('left')
    expect(editorSurface?.splitPriority).toBe('favorSecond')
  })

  it('mirrors editor surface graph bindings into the shared workspace store and removes them on close', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(emptyGraph, 'Graph 2')
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInNewViewport(secondGraphId)
    expect(firstViewportId).not.toBeNull()
    expect(secondViewportId).not.toBeNull()

    let binding =
      useWorkspaceStore.getState().editorSurfaceBindingById[secondViewportId ?? ''] ?? null
    expect(binding).toEqual({
      surfaceKind: 'spaghettiEditor',
      surfaceInstanceId: secondViewportId,
      graphDocumentId: secondGraphId,
    })

    useSpaghettiStore
      .getState()
      .bindEditorViewportToGraphDocument(secondViewportId ?? '', 'graph-document-1')

    binding = useWorkspaceStore.getState().editorSurfaceBindingById[secondViewportId ?? ''] ?? null
    expect(binding?.graphDocumentId).toBe('graph-document-1')

    useSpaghettiStore.getState().closeEditorViewport(secondViewportId ?? '')
    expect(useWorkspaceStore.getState().editorSurfaceBindingById[secondViewportId ?? '']).toBeUndefined()
  })

  it('only keeps one meatball editor view alive at a time', () => {
    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(emptyGraph, 'Graph 2')
    const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    const secondViewportId = useSpaghettiStore.getState().openGraphDocumentInNewViewport(secondGraphId)
    expect(firstViewportId).not.toBeNull()
    expect(secondViewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportWindowMode(firstViewportId ?? '', 'meatball editor view')
    useSpaghettiStore.getState().setEditorViewportWindowMode(secondViewportId ?? '', 'meatball editor view')

    const state = useSpaghettiStore.getState()
    expect(state.editorViewportsById[firstViewportId ?? '']?.windowMode).toBe('expanded')
    expect(state.editorViewportsById[secondViewportId ?? '']?.windowMode).toBe('meatball editor view')
  })

  it('setNodeMode updates active graph document state', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    useSpaghettiStore.getState().setNodeMode('node-baseplate-1', 'expanded')

    const state = useSpaghettiStore.getState()
    expect(selectNodeMode(state, 'node-baseplate-1')).toBe('expanded')
    expect(selectActiveGraphDocument(state).graph.ui?.nodeModesByNodeId).toEqual({
      'node-baseplate-1': 'expanded',
    })
  })

  it('setNodeMode omits default collapsed entries from stored graph state', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
      ui: {
        nodeModesByNodeId: {
          'node-baseplate-1': 'expanded',
        },
      },
    }

    useSpaghettiStore.getState().setGraph(graph)
    useSpaghettiStore.getState().setNodeMode('node-baseplate-1', 'collapsed')

    const state = useSpaghettiStore.getState()
    expect(selectNodeMode(state, 'node-baseplate-1')).toBe('collapsed')
    expect(state.graph.ui?.nodeModesByNodeId).toBeUndefined()
  })

  it('cycles the new node spawn mode through collapsed, essentials, and expanded', () => {
    expect(useSpaghettiStore.getState().newNodeSpawnMode).toBe('collapsed')

    useSpaghettiStore.getState().cycleNewNodeSpawnMode()
    expect(useSpaghettiStore.getState().newNodeSpawnMode).toBe('essentials')

    useSpaghettiStore.getState().cycleNewNodeSpawnMode()
    expect(useSpaghettiStore.getState().newNodeSpawnMode).toBe('expanded')

    useSpaghettiStore.getState().cycleNewNodeSpawnMode()
    expect(useSpaghettiStore.getState().newNodeSpawnMode).toBe('collapsed')
  })

  it('setGraph dedupes OutputPreview nodes and removes edges referencing removed duplicates', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-200',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            componentLabel: 'Published Component',
            objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Object 1' }],
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
        {
          nodeId: 'node-output-010',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            componentLabel: 'Published Component',
            objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Object 1' }],
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-remove-a',
          from: { nodeId: 'node-output-200', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in' },
        },
        {
          edgeId: 'edge-keep',
          from: { nodeId: 'node-output-010', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph

    const outputPreviewNodes = normalized.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    expect(outputPreviewNodes).toHaveLength(1)
    expect(outputPreviewNodes[0].nodeId).toBe('node-output-010')
    expect(normalized.edges.map((edge) => edge.edgeId)).toEqual(['edge-keep'])
  })

  it('applyGraphPatch functional delete attempt cannot remove OutputPreview singleton', () => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
    const beforeDelete = useSpaghettiStore.getState().graph
    const outputPreviewNode = beforeDelete.nodes.find(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    expect(outputPreviewNode).toBeDefined()

    useSpaghettiStore.getState().applyGraphPatch((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.type !== OUTPUT_PREVIEW_NODE_TYPE),
    }))

    const afterDelete = useSpaghettiStore.getState().graph
    const outputPreviewNodes = afterDelete.nodes.filter(
      (node) => node.type === OUTPUT_PREVIEW_NODE_TYPE,
    )
    expect(outputPreviewNodes).toHaveLength(1)
  })

  it('setGraph applies OutputPreview slot normalization and auto-appends trailing empty slot', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-001',
          type: OUTPUT_PREVIEW_NODE_TYPE,
          params: {
            componentLabel: 'Published Component',
            objects: [{ objectId: 'output-object:s001', slotId: 's001', label: 'Object 1' }],
            slots: [{ slotId: 's001' }],
            nextSlotIndex: 2,
          },
        },
        {
          nodeId: 'node-toehook-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-fill-output-slot-s001',
          from: { nodeId: 'node-toehook-1', portId: 'toeLoft' },
          to: { nodeId: 'node-output-001', portId: 'in:solid:s001' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const outputPreviewNode = normalized.nodes.find(
      (node) => node.nodeId === 'node-output-001',
    )

    expect(outputPreviewNode?.params).toEqual({
      componentLabel: 'Published Component',
      objects: [
        { objectId: 'output-object:s001', slotId: 's001', label: 'Object 1', orderIndex: 0 },
        { objectId: 'output-object:s002', slotId: 's002', label: 'Object 2', orderIndex: 1 },
      ],
      slots: [{ slotId: 's001' }, { slotId: 's002' }],
      nextSlotIndex: 3,
    })
  })

  it('canonicalizes legacy ToeHook anchorSpline2 input port ids to anchorSpline', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'node-toehook-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-baseplate-toehook-anchor',
          from: {
            nodeId: 'node-baseplate-1',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'node-toehook-1',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    expect(normalized.edges[0]?.to.portId).toBe('anchorSpline')
    expect(normalized.edges[0]?.from.portId).toBe('anchorSpline2')
  })

  it('canonicalizes legacy HeelKick anchorSpline2 input port ids to anchorSpline', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
        {
          nodeId: 'node-heelkick-1',
          type: 'Part/HeelKick',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-baseplate-heelkick-anchor',
          from: {
            nodeId: 'node-baseplate-1',
            portId: 'anchorSpline2',
          },
          to: {
            nodeId: 'node-heelkick-1',
            portId: 'anchorSpline2',
          },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    expect(normalized.edges[0]?.to.portId).toBe('anchorSpline')
    expect(normalized.edges[0]?.from.portId).toBe('anchorSpline2')
  })

  it('normalizes missing partSlots for part nodes to the default container contract', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.partSlots).toEqual({
      drivers: true,
      inputs: true,
      featureStack: true,
      outputs: true,
    })
  })

  it('repairs invalid partSlots shape deterministically to the default container contract', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {},
          partSlots: {
            drivers: true,
            inputs: true,
            outputs: true,
          } as unknown as SpaghettiGraph['nodes'][number]['partSlots'],
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.partSlots).toEqual({
      drivers: true,
      inputs: true,
      featureStack: true,
      outputs: true,
    })
  })

  it('does not normalize partSlots for non-part nodes', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-primitive-number-1',
          type: 'Primitive/Number',
          params: {
            value: 1,
          },
          partSlots: {
            invalid: true,
          } as unknown as SpaghettiGraph['nodes'][number]['partSlots'],
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const primitive = normalized.nodes.find((node) => node.nodeId === 'node-primitive-number-1')
    expect(primitive?.partSlots).toEqual({
      invalid: true,
    })
  })

  it('silently repairs invalid partRowOrder shape for part nodes during canonicalization', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            partRowOrder: {
              drivers: [1, 2, 3],
            },
          } as unknown as Record<string, unknown>,
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.partRowOrder).toBeUndefined()
  })

  it('does not normalize partRowOrder for non-part nodes', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-primitive-number-2',
          type: 'Primitive/Number',
          params: {
            value: 1,
            partRowOrder: {
              drivers: [1, 2, 3],
            },
          } as unknown as Record<string, unknown>,
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const primitive = normalized.nodes.find((node) => node.nodeId === 'node-primitive-number-2')
    expect(primitive?.params.partRowOrder).toEqual({
      drivers: [1, 2, 3],
    })
  })

  it('initializes offset metadata for numeric drivers when first driven', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            widthMm: 30,
            lengthMm: 200,
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-drive-width',
          from: { nodeId: 'node-source-mm', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in:drv:widthMm' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.driverOffsetByParamId).toEqual({
      widthMm: 0,
    })
    expect(baseplate?.params.driverDrivenByParamId).toEqual({
      widthMm: true,
    })
  })

  it('preserves existing numeric driver offsets while normalizing driven metadata', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-source-mm',
          type: 'Utility/IdentityNumberMm',
          params: {},
        },
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            widthMm: 30,
            lengthMm: 200,
            driverOffsetByParamId: {
              widthMm: 2.5,
            },
          },
        },
      ],
      edges: [
        {
          edgeId: 'edge-drive-width',
          from: { nodeId: 'node-source-mm', portId: 'out' },
          to: { nodeId: 'node-baseplate-1', portId: 'in:drv:widthMm' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.driverOffsetByParamId).toEqual({
      widthMm: 2.5,
    })
    expect(baseplate?.params.driverDrivenByParamId).toEqual({
      widthMm: true,
    })
  })

  it('keeps stored offset but clears driven marker when numeric driver disconnects', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            widthMm: 30,
            lengthMm: 200,
            driverOffsetByParamId: {
              widthMm: 4,
            },
            driverDrivenByParamId: {
              widthMm: true,
            },
          },
        },
      ],
      edges: [],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const baseplate = normalized.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect(baseplate?.params.driverOffsetByParamId).toEqual({
      widthMm: 4,
    })
    expect(baseplate?.params.driverDrivenByParamId).toBeUndefined()
  })

  it('does not create offset metadata for non-numeric driven drivers', () => {
    const graph: SpaghettiGraph = {
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-source-vec2',
          type: 'Primitive/Vec2',
          params: {
            x: 1,
            y: 2,
            unit: 'unitless',
          },
        },
        {
          nodeId: 'node-toehook-1',
          type: 'Part/ToeHook',
          params: {},
        },
      ],
      edges: [
        {
          edgeId: 'edge-drive-vec2',
          from: { nodeId: 'node-source-vec2', portId: 'value' },
          to: { nodeId: 'node-toehook-1', portId: 'in:drv:profileA_end' },
        },
      ],
    }

    useSpaghettiStore.getState().setGraph(graph)
    const normalized = useSpaghettiStore.getState().graph
    const toeHook = normalized.nodes.find((node) => node.nodeId === 'node-toehook-1')
    expect(toeHook?.params.driverOffsetByParamId).toBeUndefined()
    expect(toeHook?.params.driverDrivenByParamId).toBeUndefined()
  })
})

describe('useSpaghettiStore feature stack editing semantics', () => {
  afterEach(() => {
    useSpaghettiStore.getState().setGraph(emptyGraph)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
  })

  it('reorders independent features deterministically', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'sketch',
                featureId: 'feature-sketch-1',
                plane: 'XY',
                components: [],
                outputs: { profiles: [] },
                uiState: { collapsed: false },
              },
              {
                type: 'sketch',
                featureId: 'feature-sketch-2',
                plane: 'XY',
                components: [],
                outputs: { profiles: [] },
                uiState: { collapsed: false },
              },
            ],
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().moveFeatureUp('node-baseplate-1', 'feature-sketch-2')
    const baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ featureId: string }>).map((feature) => feature.featureId)).toEqual([
      'feature-sketch-2',
      'feature-sketch-1',
    ])
  })

  it('prevents dependency-breaking feature reorders at the store boundary', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'sketch',
                featureId: 'feature-sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-1',
                      profileIndex: 0,
                      area: 1,
                      loop: { segments: [], winding: 'CCW' },
                      verticesProxy: [],
                    },
                  ],
                },
                uiState: { collapsed: false },
              },
              {
                type: 'extrude',
                featureId: 'feature-extrude-1',
                inputs: {
                  profileRef: {
                    sourceFeatureId: 'feature-sketch-1',
                    profileId: 'profile-1',
                    profileIndex: 0,
                  },
                },
                params: {
                  depth: { kind: 'lit', value: 10 },
                },
                outputs: { bodyId: 'body-1' },
                uiState: { collapsed: false },
              },
            ],
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().moveFeatureUp('node-baseplate-1', 'feature-extrude-1')
    const baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ featureId: string }>).map((feature) => feature.featureId)).toEqual([
      'feature-sketch-1',
      'feature-extrude-1',
    ])
  })

  it('toggles feature enabled state deterministically', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-baseplate-1',
          type: 'Part/Baseplate',
          params: {
            featureStack: [
              {
                type: 'extrude',
                featureId: 'feature-extrude-1',
                inputs: { profileRef: null },
                params: {
                  depth: { kind: 'lit', value: 10 },
                },
                outputs: { bodyId: 'body-1' },
                uiState: { collapsed: false },
              },
            ],
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().setFeatureEnabled('node-baseplate-1', 'feature-extrude-1', false)
    useSpaghettiStore.getState().setFeatureEnabled('node-baseplate-1', 'feature-extrude-1', false)
    let baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ enabled?: boolean }>)[0]?.enabled).toBe(false)

    useSpaghettiStore.getState().setFeatureEnabled('node-baseplate-1', 'feature-extrude-1', true)
    baseplate = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-baseplate-1')
    expect((baseplate?.params.featureStack as Array<{ enabled?: boolean }>)[0]?.enabled).toBe(true)
  })
})

describe('useSpaghettiStore Geometry/Sketch editing semantics', () => {
  afterEach(() => {
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
  })

  it('appends managed sketch components and recomputes profiles for Geometry/Sketch nodes', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().appendGeometrySketchComponent('node-sketch-1', {
      rowId: 'row-1',
      componentId: 'rect-1',
      type: 'rectangle',
      a: { kind: 'lit', x: 0, y: 0 },
      b: { kind: 'lit', x: 40, y: 20 },
    })

    const sketchNode = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')
    const sketch = sketchNode?.params.sketch as {
      components: Array<{ type: string }>
      outputs: { profiles: Array<{ area: number }> }
    }

    expect(sketch.components).toHaveLength(1)
    expect(sketch.components[0]?.type).toBe('rectangle')
    expect(sketch.outputs.profiles).toHaveLength(1)
    expect(sketch.outputs.profiles[0]?.area).toBe(800)
  })

  it('tracks draw/review session state and closes plane-pick when sketch editing begins', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')

    let state = useSpaghettiStore.getState()
    expect(state.sketchPlanePickSession).toBeNull()
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
    })

    useSpaghettiStore.getState().setGeometrySketchSessionTool('circle')
    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'review')

    state = useSpaghettiStore.getState()
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'review',
      activeTool: null,
      drawStage: null,
    })
  })

  it('appends rich draw prompts when sketch draw starts, switches to PLine, and finishes', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('pline')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, null)
    useSpaghettiStore.getState().finishGeometrySketchDrawDraft()

    const promptEntries = useConsoleStore
      .getState()
      .entries.filter((entry) => entry.source === 'sketch-draw')
      .map((entry) => entry.text)

    expect(promptEntries).toEqual([
      'Sketch Draw > [Line, PLine, Rectangle, Circle, X]',
      'PLINE Specify point 1:',
      'PLINE Specify point 2:',
      'PLINE Specify point 3 or [Enter Finish]:',
      'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]',
    ])
  })

  it('collapses the active editor viewport while draw sketch is open and restores it on close', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()
    expect(selectActiveEditorViewport(useSpaghettiStore.getState())?.windowMode).toBe('expanded')

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')

    let state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('collapsed')
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      shouldRestoreViewportWindowMode: true,
      editorViewportId: viewportId,
    })

    useSpaghettiStore.getState().closeGeometrySketchSession()

    state = useSpaghettiStore.getState()
    expect(state.geometrySketchSession).toBeNull()
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('expanded')
  })

  it('keeps a separate-window editor viewport open when draw sketch starts', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()
    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'separateWindow')

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')

    const state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('separateWindow')
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      shouldRestoreViewportWindowMode: false,
      editorViewportId: viewportId,
    })
  })

  it('tracks viewer-owned Line draft points and commits a line on the second point before returning to idle', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 0, y: 0 }, 'origin')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 20, y: 10 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 20, y: 10 }, null)

    const state = useSpaghettiStore.getState()
    const sketch = state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as {
      components: Array<{ type: string; a?: { x: number; y: number }; b?: { x: number; y: number } }>
    }

    expect(sketch.components).toHaveLength(1)
    expect(sketch.components[0]).toMatchObject({
      type: 'line',
      a: { x: 0, y: 0 },
      b: { x: 20, y: 10 },
    })
    expect(state.geometrySketchSession).toMatchObject({
      activeTool: null,
      lastUsedTool: 'line',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe(
      'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]',
    )
  })

  it('tracks viewer-owned Rectangle draft points and commits a rectangle on the second point before returning to idle', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('rec')
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 2, y: 3 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 2, y: 3 }, null)
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 12, y: 15 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 12, y: 15 }, null)

    const state = useSpaghettiStore.getState()
    const sketch = state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as {
      components: Array<{ type: string; a?: { x: number; y: number }; b?: { x: number; y: number } }>
    }

    expect(sketch.components).toHaveLength(1)
    expect(sketch.components[0]).toMatchObject({
      type: 'rectangle',
      a: { x: 2, y: 3 },
      b: { x: 12, y: 15 },
    })
    expect(state.geometrySketchSession).toMatchObject({
      activeTool: null,
      lastUsedTool: 'rectangle',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe(
      'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]',
    )
  })

  it('tracks viewer-owned Circle center and radius witness points and commits a circle on the second point before returning to idle', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('cc')
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 2, y: 3 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 2, y: 3 }, null)
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 8, y: 3 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 8, y: 3 }, null)

    const state = useSpaghettiStore.getState()
    const sketch = state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as {
      components: Array<{
        type: string
        center?: { x: number; y: number }
        edge?: { x: number; y: number }
      }>
    }

    expect(sketch.components).toHaveLength(1)
    expect(sketch.components[0]).toMatchObject({
      type: 'circle',
      center: { x: 2, y: 3 },
      edge: { x: 8, y: 3 },
    })
    expect(state.geometrySketchSession).toMatchObject({
      activeTool: null,
      lastUsedTool: 'circle',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe(
      'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]',
    )
  })

  it('tracks idle sketch entity selection and deletes the selected components', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-line-1',
                  componentId: 'cmp-line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 10, y: 0 },
                },
                {
                  rowId: 'row-circle-1',
                  componentId: 'cmp-circle-1',
                  type: 'circle',
                  center: { kind: 'lit', x: 4, y: 4 },
                  edge: { kind: 'lit', x: 6, y: 4 },
                },
              ],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchHoveredComponent('row-line-1')
    useSpaghettiStore.getState().setGeometrySketchSelectedComponents(['row-line-1'])

    let state = useSpaghettiStore.getState()
    expect(state.geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      hoveredComponentId: 'row-line-1',
      selectedComponentIds: ['row-line-1'],
      selectionWindowDraft: null,
    })

    useSpaghettiStore.getState().deleteGeometrySketchSelectedComponents()

    state = useSpaghettiStore.getState()
    expect(state.geometrySketchSession).toMatchObject({
      hoveredComponentId: null,
      selectedComponentIds: [],
      selectionWindowDraft: null,
    })
    expect(
      (state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as SketchFeature)
        .components,
    ).toEqual([
      expect.objectContaining({
        rowId: 'row-circle-1',
        type: 'circle',
      }),
    ])
  })

  it('clears idle entity selection when a new draw tool is armed', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [
                {
                  rowId: 'row-line-1',
                  componentId: 'cmp-line-1',
                  type: 'line',
                  a: { kind: 'lit', x: 0, y: 0 },
                  b: { kind: 'lit', x: 10, y: 0 },
                },
              ],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchHoveredComponent('row-line-1')
    useSpaghettiStore.getState().setGeometrySketchSelectedComponents(['row-line-1'])

    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'line',
      hoveredComponentId: null,
      selectedComponentIds: [],
      selectionWindowDraft: null,
    })
  })

  it('uses enter to accept the hovered opposite corner for Rectangle', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('rectangle')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: -4, y: 1 }, null)
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 6, y: 9 }, null)

    useSpaghettiStore.getState().finishGeometrySketchDrawDraft()

    const state = useSpaghettiStore.getState()
    const sketch = state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as {
      components: Array<{ type: string; a?: { x: number; y: number }; b?: { x: number; y: number } }>
    }

    expect(sketch.components).toHaveLength(1)
    expect(sketch.components[0]).toMatchObject({
      type: 'rectangle',
      a: { x: -4, y: 1 },
      b: { x: 6, y: 9 },
    })
    expect(state.geometrySketchSession).toMatchObject({
      activeTool: null,
      lastUsedTool: 'rectangle',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
  })

  it('uses cancelGeometrySketchDrawDraft to return directly to session idle', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')

    let state = useSpaghettiStore.getState()
    expect(state.geometrySketchSession?.drawDraft?.points).toEqual([{ x: 0, y: 0 }])

    useSpaghettiStore.getState().cancelGeometrySketchDrawDraft()

    state = useSpaghettiStore.getState()
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      lastUsedTool: 'line',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('collapsed')
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe(
      'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]',
    )
  })

  it('keeps PLine as one temporary chain until finish and commits the whole chain as line segments', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('pline')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 12 }, null)

    expect(useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch).toMatchObject({
      components: [],
    })

    useSpaghettiStore.getState().finishGeometrySketchDrawDraft()

    const state = useSpaghettiStore.getState()
    const sketch = state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as {
      components: Array<{ type: string; a?: { x: number; y: number }; b?: { x: number; y: number } }>
    }

    expect(sketch.components).toHaveLength(2)
    expect(sketch.components[0]).toMatchObject({
      type: 'line',
      a: { x: 0, y: 0 },
      b: { x: 10, y: 0 },
    })
    expect(sketch.components[1]).toMatchObject({
      type: 'line',
      a: { x: 10, y: 0 },
      b: { x: 10, y: 12 },
    })
    expect(state.geometrySketchSession).toMatchObject({
      activeTool: null,
      lastUsedTool: 'pline',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
  })

  it('preserves endpoint snap targets through the shared hover and point-confirm seam', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 10, y: 0 }, 'endpoint')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, 'endpoint')

    expect(useSpaghettiStore.getState().geometrySketchSession?.drawDraft).toEqual({
      points: [{ x: 10, y: 0 }],
      hoverPoint: { x: 10, y: 0 },
      hoverSnapTarget: 'endpoint',
    })
  })

  it('supports undo on the live draft and previous to re-arm the last used draw tool', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('pl')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, null)

    useSpaghettiStore.getState().runGeometrySketchDrawCommand('undo')
    expect(useSpaghettiStore.getState().geometrySketchSession?.drawDraft?.points).toEqual([
      { x: 0, y: 0 },
    ])

    useSpaghettiStore.getState().runGeometrySketchDrawCommand('back')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: null,
      lastUsedTool: 'pline',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })

    useSpaghettiStore.getState().runGeometrySketchDrawCommand('previous')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'pline',
      lastUsedTool: 'pline',
      drawStage: 'toolSelected',
      drawDraft: {
        points: [],
        hoverPoint: null,
        hoverSnapTarget: null,
      },
    })
  })

  it('re-arms the last used draw tool when enter is pressed from idle sketch draw', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('pl')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, null)
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 10, y: 0 }, null)
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('enter')
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('enter')

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      activeTool: 'pline',
      lastUsedTool: 'pline',
      drawStage: 'toolSelected',
      drawDraft: {
        points: [],
        hoverPoint: null,
        hoverSnapTarget: null,
      },
    })
  })

  it('keeps sketch-plane draft edits temporary until confirm and restores the collapsed viewport shell', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')

    let state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('collapsed')
    expect(state.sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'pick',
      gizmoMode: 'translate',
      draftPlane: 'XY',
    })

    useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 12.5)
    useSpaghettiStore.getState().setSketchPlanePickRotationAxis('z', 45)

    const beforeCommit = useSpaghettiStore.getState().graph.nodes.find(
      (node) => node.nodeId === 'node-sketch-1',
    )?.params.sketch as {
      plane: string
      planeTransform?: { translation: { x: number }; rotationDeg: { z: number } }
    }
    expect(beforeCommit.plane).toBe('XY')
    expect(beforeCommit.planeTransform?.translation.x).toBe(0)
    expect(beforeCommit.planeTransform?.rotationDeg.z).toBe(0)

    useSpaghettiStore.getState().confirmSketchPlanePick()

    state = useSpaghettiStore.getState()
    const sketch = state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as {
      plane: string
      planeTransform?: { translation: { x: number }; rotationDeg: { z: number } }
    }
    expect(state.sketchPlanePickSession).toBeNull()
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
    })
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('collapsed')
    expect(sketch.plane).toBe('XZ')
    expect(sketch.planeTransform?.translation.x).toBe(12.5)
    expect(sketch.planeTransform?.rotationDeg.z).toBe(45)
    expect((sketch as SketchFeature).uiState.sketchPlaneTransformHistory).toEqual([
      {
        entryId: 'sketch-plane-history-1',
        point: { x: 12.5, y: 0, z: 0 },
        locked: false,
      },
    ])
  })

  it('keeps a separate-window editor viewport open during sketch-plane pick and confirm-to-draw', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()
    useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId ?? '', 'separateWindow')

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')

    let state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('separateWindow')
    expect(state.sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'pick',
      shouldRestoreViewportWindowMode: false,
      editorViewportId: viewportId,
    })

    useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XY')
    useSpaghettiStore.getState().confirmSketchPlanePick()

    state = useSpaghettiStore.getState()
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('separateWindow')
    expect(state.sketchPlanePickSession).toBeNull()
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      shouldRestoreViewportWindowMode: false,
      editorViewportId: viewportId,
    })
  })

  it('records, merges, persists, and restores sketch-plane transform history', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().runSketchPlaneCommand('xy')
    useSpaghettiStore.getState().runSketchPlaneCommand('move')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 3)
    useSpaghettiStore.getState().acceptActiveSketchPlaneTransformCommand()
    useSpaghettiStore.getState().runSketchPlaneCommand('move')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('y', 6)
    useSpaghettiStore.getState().acceptActiveSketchPlaneTransformCommand()
    useSpaghettiStore.getState().runSketchPlaneCommand('move')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('z', -5)
    useSpaghettiStore.getState().acceptActiveSketchPlaneTransformCommand()
    useSpaghettiStore.getState().runSketchPlaneCommand('move')
    useSpaghettiStore.getState().acceptActiveSketchPlaneTransformCommand()

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.transformHistory).toEqual([
      {
        entryId: 'sketch-plane-history-1',
        point: { x: 3, y: 0, z: 0 },
        locked: false,
      },
      {
        entryId: 'sketch-plane-history-2',
        point: { x: 3, y: 6, z: 0 },
        locked: false,
      },
      {
        entryId: 'sketch-plane-history-3',
        point: { x: 3, y: 6, z: -5 },
        locked: false,
      },
    ])

    useSpaghettiStore.getState().toggleSketchPlaneTransformHistoryLock('sketch-plane-history-2')
    useSpaghettiStore.getState().mergeSketchPlaneTransformHistory()
    useSpaghettiStore.getState().finishSketchPlanePick()

    const sketch = useSpaghettiStore.getState().graph.nodes.find(
      (node) => node.nodeId === 'node-sketch-1',
    )?.params.sketch as SketchFeature

    expect(sketch.uiState.sketchPlaneTransformHistory).toEqual([
      {
        entryId: 'sketch-plane-history-2',
        point: { x: 3, y: 6, z: 0 },
        locked: true,
      },
      {
        entryId: 'sketch-plane-history-3',
        point: { x: 3, y: 6, z: -5 },
        locked: false,
      },
    ])

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    expect(useSpaghettiStore.getState().sketchPlanePickSession?.transformHistory).toEqual([
      {
        entryId: 'sketch-plane-history-2',
        point: { x: 3, y: 6, z: 0 },
        locked: true,
      },
      {
        entryId: 'sketch-plane-history-3',
        point: { x: 3, y: 6, z: -5 },
        locked: false,
      },
    ])
  })

  it('appends sketch-plane transform history on gizmo drag release without duplicating unchanged drafts', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().runSketchPlaneCommand('xy')
    useSpaghettiStore.getState().runSketchPlaneCommand('move')
    useSpaghettiStore.getState().setSketchPlanePickDraftTransform({
      offsetMm: 0,
      inPlaneRotationDeg: 0,
      translation: { x: 3, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
    })
    useSpaghettiStore.getState().commitSketchPlaneTransformHistoryFromDraftRelease()

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      transformCommandOrigin: {
        translation: { x: 3, y: 0, z: 0 },
      },
      transformHistory: [
        {
          entryId: 'sketch-plane-history-1',
          point: { x: 3, y: 0, z: 0 },
          locked: false,
        },
      ],
    })

    useSpaghettiStore.getState().commitSketchPlaneTransformHistoryFromDraftRelease()

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.transformHistory).toEqual([
      {
        entryId: 'sketch-plane-history-1',
        point: { x: 3, y: 0, z: 0 },
        locked: false,
      },
    ])

    useSpaghettiStore.getState().setSketchPlanePickDraftTransform({
      offsetMm: 0,
      inPlaneRotationDeg: 0,
      translation: { x: 3, y: 6, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
    })
    useSpaghettiStore.getState().commitSketchPlaneTransformHistoryFromDraftRelease()

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      transformCommandOrigin: {
        translation: { x: 3, y: 6, z: 0 },
      },
      transformHistory: [
        {
          entryId: 'sketch-plane-history-1',
          point: { x: 3, y: 0, z: 0 },
          locked: false,
        },
        {
          entryId: 'sketch-plane-history-2',
          point: { x: 3, y: 6, z: 0 },
          locked: false,
        },
      ],
    })
  })

  it('cancels sketch-plane picks without committing the draft and restores the prior viewport shell', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().setSketchPlanePickDraftPlane('YZ')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('y', 18)
    useSpaghettiStore.getState().cancelSketchPlanePick()

    const state = useSpaghettiStore.getState()
    const sketch = state.graph.nodes.find((node) => node.nodeId === 'node-sketch-1')?.params.sketch as {
      plane: string
      planeTransform?: { translation: { y: number } }
    }
    expect(state.sketchPlanePickSession).toBeNull()
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('expanded')
    expect(sketch.plane).toBe('XY')
    expect(sketch.planeTransform?.translation.y).toBe(0)
  })

  it('replaces the whole sketch-plane draft transform without committing until confirm', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    useSpaghettiStore.getState().setSketchPlanePickDraftTransform({
      offsetMm: 0,
      inPlaneRotationDeg: 0,
      translation: { x: 16, y: -6, z: 3 },
      rotationDeg: { x: 12, y: 24, z: 48 },
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftTransform: {
        translation: { x: 16, y: -6, z: 3 },
        rotationDeg: { x: 12, y: 24, z: 48 },
      },
    })

    const beforeCommit = useSpaghettiStore.getState().graph.nodes.find(
      (node) => node.nodeId === 'node-sketch-1',
    )?.params.sketch as {
      planeTransform?: { translation: { x: number; y: number; z: number }; rotationDeg: { x: number; y: number; z: number } }
    }
    expect(beforeCommit.planeTransform?.translation).toEqual({ x: 0, y: 0, z: 0 })
    expect(beforeCommit.planeTransform?.rotationDeg).toEqual({ x: 0, y: 0, z: 0 })

    useSpaghettiStore.getState().confirmSketchPlanePick()

    const afterCommit = useSpaghettiStore.getState().graph.nodes.find(
      (node) => node.nodeId === 'node-sketch-1',
    )?.params.sketch as {
      plane: string
      planeTransform?: { translation: { x: number; y: number; z: number }; rotationDeg: { x: number; y: number; z: number } }
    }
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
    })
    expect(afterCommit.plane).toBe('XZ')
    expect(afterCommit.planeTransform?.translation).toEqual({ x: 16, y: -6, z: 3 })
    expect(afterCommit.planeTransform?.rotationDeg).toEqual({ x: 12, y: 24, z: 48 })
  })

  it('ignores confirm-to-sketch while sketch-plane move is still active', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XY')
    useSpaghettiStore.getState().runSketchPlaneCommand('move')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 9)

    useSpaghettiStore.getState().confirmSketchPlanePick()

    const state = useSpaghettiStore.getState()
    expect(state.sketchPlanePickSession).toMatchObject({
      stage: 'adjust',
      adjustScope: 'move',
      draftTransform: {
        translation: { x: 9, y: 0, z: 0 },
      },
    })
    expect(state.geometrySketchSession).toBeNull()
  })

  it('reopens plane selection from adjust without losing the current draft plane or transform', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 24.5)
    useSpaghettiStore.getState().reopenSketchPlanePickPlaneSelection()

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      stage: 'pick',
      draftPlane: 'XZ',
      draftTransform: {
        translation: { x: 24.5, y: 0, z: 0 },
      },
    })
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('Sketch Plane > [XY, XZ, YZ]')
  })

  it('uses returnActiveSketchSessionOneLevel across sketch-plane and sketch-draw session levels', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    useSpaghettiStore.getState().runSketchPlaneCommand('move')

    useSpaghettiStore.getState().returnActiveSketchSessionOneLevel()
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'root',
      draftPlane: 'XZ',
    })

    useSpaghettiStore.getState().returnActiveSketchSessionOneLevel()
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'pick',
      draftPlane: 'XZ',
    })

    useSpaghettiStore.getState().returnActiveSketchSessionOneLevel()
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toBeNull()

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')

    useSpaghettiStore.getState().returnActiveSketchSessionOneLevel()
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      lastUsedTool: 'line',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })

    useSpaghettiStore.getState().returnActiveSketchSessionOneLevel()
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
  })

  it('routes shared sketch commands through the same sketch-session verbs', () => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: {
            sketch: {
              type: 'sketch',
              featureId: 'sketch-1',
              plane: 'XY',
              planeTransform: {
                offsetMm: 0,
                translation: { x: 0, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                inPlaneRotationDeg: 0,
              },
              components: [],
              outputs: { profiles: [], diagnostics: [] },
              uiState: { collapsed: false },
            },
          },
        },
      ],
      edges: [],
    })

    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    useSpaghettiStore.getState().runSketchPlaneCommand('xz')

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'root',
      draftPlane: 'XZ',
      gizmoMode: 'translate',
    })

    useSpaghettiStore.getState().runSketchPlaneCommand('move')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'move',
      activeTransformAxis: 'free',
      transformCommandOrigin: {
        offsetMm: 0,
        translation: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
      draftPlane: 'XZ',
      gizmoMode: 'translate',
    })

    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 22)
    useSpaghettiStore.getState().runSketchPlaneCommand('move-x')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'move-axis',
      activeTransformAxis: 'x',
      transformCommandOrigin: {
        offsetMm: 0,
        translation: { x: 22, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
      draftTransform: {
        offsetMm: 0,
        translation: { x: 22, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
      draftPlane: 'XZ',
      gizmoMode: 'translate',
    })

    useSpaghettiStore.getState().runSketchPlaneCommand('back')
    useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('y', 8)
    useSpaghettiStore.getState().runSketchPlaneCommand('move-again')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'move',
      activeTransformAxis: 'free',
      transformCommandOrigin: {
        offsetMm: 0,
        translation: { x: 22, y: 8, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
      draftTransform: {
        offsetMm: 0,
        translation: { x: 22, y: 8, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
      draftPlane: 'XZ',
      gizmoMode: 'translate',
    })

    useSpaghettiStore.getState().runSketchPlaneCommand('rotate')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'rotate',
      activeTransformAxis: 'free',
      draftPlane: 'XZ',
      gizmoMode: 'rotate',
    })

    useSpaghettiStore.getState().runSketchPlaneCommand('rotate-z')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'rotate',
      activeTransformAxis: 'z',
      draftPlane: 'XZ',
      gizmoMode: 'rotate',
    })

    useSpaghettiStore.getState().runSketchPlaneCommand('back')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'root',
      draftPlane: 'XZ',
    })

    useSpaghettiStore.getState().runSketchPlaneCommand('back')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'pick',
      draftPlane: 'XZ',
    })

    useSpaghettiStore.getState().runSketchPlaneCommand('x')
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toBeNull()

    useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('pl')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: 'pline',
      drawStage: 'toolSelected',
    })

    useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 1, y: 2 }, null)
    useSpaghettiStore.getState().runGeometrySketchDrawCommand('back')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      lastUsedTool: 'pline',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })

    useSpaghettiStore.getState().runGeometrySketchDrawCommand('x')
    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
  })
})

