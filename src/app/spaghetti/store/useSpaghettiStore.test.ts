import { afterEach, describe, expect, it } from 'vitest'
import { useConsoleStore } from '../../console/useConsoleStore'
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
  selectViewerTargetGraphAcceptedBuildOutputs,
  selectViewerTargetGraphDocumentId,
  selectViewerTargetGraphOutputSurface,
  useSpaghettiStore,
} from './useSpaghettiStore'
import type { PartArtifact } from '../../../shared/buildTypes'

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
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
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
        instances: { heelKickInstances: [1], toeHookInstances: [1] },
        orderedPartKeys: ['baseplate'],
        resolvedParts: {},
      },
    })
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildRequestId: 'build-request-42',
      buildSeq: 42,
    })

    const state = useSpaghettiStore.getState()
    const firstRuntime = state.graphRuntimeByDocumentId['graph-document-1']
    const secondRuntime = state.graphRuntimeByDocumentId[secondGraphId]

    expect(firstRuntime.compileBuild.lastCompileResult?.ok).toBe(true)
    expect(firstRuntime.compileBuild.currentGraphRevision).toBe(0)
    expect(firstRuntime.compileBuild.latestIssuedGraphRevision).toBe(0)
    expect(firstRuntime.compileBuild.inFlightGraphRevision).toBe(0)
    expect(firstRuntime.compileBuild.latestAcceptedGraphRevision).toBeNull()
    expect(firstRuntime.compileBuild.pendingStatsPartKeys).toEqual(['baseplate', 'assembled'])
    expect(firstRuntime.previewPreparation.buildStatsReadyPartKeys).toEqual(['baseplate', 'assembled'])
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
    expect(state.graphRuntimeByDocumentId['graph-document-1']?.compileBuild.currentGraphRevision).toBe(1)
    expect(selectCachedGraphEntryById(state, 'graph-document-1')).toMatchObject({
      isDirty: true,
      lastSavedAt: '2026-03-10T00:00:00.000Z',
    })
  })

  it('acceptGraphBuildResult records the accepted graph revision even if the graph changed after the build request was staged', () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
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
  })

  it('saving to disk clears save state without changing accepted build freshness', async () => {
    useSpaghettiStore.getState().stageGraphBuildRequest('graph-document-1', {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildRequestId: 'build-request-11',
      buildSeq: 11,
    })
    useSpaghettiStore.getState().stageGraphBuildRequest(secondGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube'],
      pendingStatsPartKeys: ['cube'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildRequestId: 'build-request-22',
      buildSeq: 22,
    })

    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-11',
        buildSeq: 11,
        buildOutputs: [baseplateArtifact],
      }),
    ).toBe(true)
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-22',
        buildSeq: 22,
        buildOutputs: [cubeArtifact],
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube'],
      pendingStatsPartKeys: ['cube'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildRequestId: 'build-request-surface',
      buildSeq: 7,
    })
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-surface',
        buildSeq: 7,
        buildOutputs: [cubeArtifact],
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube'],
      pendingStatsPartKeys: ['cube'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildRequestId: 'build-request-receive',
      buildSeq: 31,
    })
    expect(
      useSpaghettiStore.getState().acceptGraphBuildResult({
        projectFileId: 'legacy-runtime-project',
        graphDocumentId: secondGraphId,
        buildRequestId: 'build-request-receive',
        buildSeq: 31,
        buildOutputs: [cubeArtifact],
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube_a'],
      pendingStatsPartKeys: ['cube'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildRequestId: 'build-request-a',
      buildSeq: 32,
    })
    useSpaghettiStore.getState().stageGraphBuildRequest(thirdGraphId, {
      compileResult: {
        ok: true,
        diagnostics: { errors: [], warnings: [] },
        buildInputs: {
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['cube'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_cube_b'],
      pendingStatsPartKeys: ['cube'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
      buildRequestId: 'build-request-b',
      buildSeq: 33,
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: secondGraphId,
      buildRequestId: 'build-request-a',
      buildSeq: 32,
      buildOutputs: [cubeArtifact],
    })
    useSpaghettiStore.getState().acceptGraphBuildResult({
      projectFileId: 'legacy-runtime-project',
      graphDocumentId: thirdGraphId,
      buildRequestId: 'build-request-b',
      buildSeq: 33,
      buildOutputs: [cubeArtifact],
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_width'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
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
          instances: { heelKickInstances: [1], toeHookInstances: [1] },
          orderedPartKeys: ['baseplate'],
          resolvedParts: {},
        },
      },
      previousBuildInputs: null,
      pendingChangedParamIds: ['sp_full'],
      pendingStatsPartKeys: ['baseplate', 'assembled'],
      pendingInstances: { heelKickInstances: [1], toeHookInstances: [1] },
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

  it('stores split direction and priority per editor viewport', () => {
    const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    expect(viewportId).not.toBeNull()

    useSpaghettiStore.getState().setEditorViewportSplitDirection(viewportId ?? '', 'vertical')
    useSpaghettiStore.getState().setEditorViewportSplitPriority(viewportId ?? '', 'favorSecond')

    const viewport = selectActiveEditorViewport(useSpaghettiStore.getState())
    expect(viewport?.splitDirection).toBe('vertical')
    expect(viewport?.splitPriority).toBe('favorSecond')
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

  it('setNodeMode omits default essentials entries from stored graph state', () => {
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
    useSpaghettiStore.getState().setNodeMode('node-baseplate-1', 'essentials')

    const state = useSpaghettiStore.getState()
    expect(selectNodeMode(state, 'node-baseplate-1')).toBe('essentials')
    expect(state.graph.ui?.nodeModesByNodeId).toBeUndefined()
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
      'Sketch Draw > [Line, PLine, X]',
      'PLINE Specify start point:',
      'PLINE Specify point 2:',
      'PLINE Specify point 3 or [Enter Finish]:',
      'PLINE Specify start point:',
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

  it('tracks viewer-owned Line draft points and commits a line on the second point', () => {
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
    expect(state.geometrySketchSession?.drawDraft).toEqual({
      points: [],
      hoverPoint: null,
      hoverSnapTarget: null,
    })
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('LINE Specify start point:')
  })

  it('uses cancelGeometrySketchDrawDraft to clear the draft and then return to session idle', () => {
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
    expect(state.geometrySketchSession).not.toBeNull()
    expect(state.geometrySketchSession?.drawDraft).toEqual({
      points: [],
      hoverPoint: null,
      hoverSnapTarget: null,
    })
    expect(state.geometrySketchSession?.activeTool).toBe('line')
    expect(state.geometrySketchSession?.drawStage).toBe('toolSelected')

    useSpaghettiStore.getState().cancelGeometrySketchDrawDraft()

    state = useSpaghettiStore.getState()
    expect(state.geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(selectActiveEditorViewport(state)?.windowMode).toBe('collapsed')
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('Sketch Draw > [Line, PLine, X]')
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
    expect(state.geometrySketchSession?.drawDraft?.points).toEqual([])
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
      activeTool: 'line',
      drawStage: 'toolSelected',
    })

    useSpaghettiStore.getState().returnActiveSketchSessionOneLevel()
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
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
      adjustScope: 'move',
      activeTransformAxis: 'x',
      transformCommandOrigin: {
        offsetMm: 0,
        translation: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
      draftTransform: {
        offsetMm: 0,
        translation: { x: 0, y: 0, z: 0 },
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
      activeTool: 'pline',
      drawStage: 'toolSelected',
    })

    useSpaghettiStore.getState().runGeometrySketchDrawCommand('b')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })

    useSpaghettiStore.getState().runGeometrySketchDrawCommand('x')
    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
  })
})
