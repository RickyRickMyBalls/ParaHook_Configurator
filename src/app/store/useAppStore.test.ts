import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BuildResult } from '../../shared/buildTypes'
import { buildGraphOutputSurface } from '../spaghetti/outputSurface'
import type { GraphPreviewPreparation } from '../spaghetti/previewPreparation'

type WorkerMessageHandler = (event: MessageEvent<unknown>) => void

class MockWorker {
  private readonly handlers = new Set<WorkerMessageHandler>()

  public addEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.add(handler as WorkerMessageHandler)
  }

  public removeEventListener(type: string, handler: EventListenerOrEventListenerObject): void {
    if (type !== 'message' || typeof handler !== 'function') {
      return
    }
    this.handlers.delete(handler as WorkerMessageHandler)
  }

  public postMessage(_message: unknown): void {}

  public terminate(): void {}
}

const baseplateArtifact = {
  id: 'baseplate',
  label: 'Baseplate',
  kind: 'box' as const,
  params: { width: 1, length: 2, height: 3 },
  partKeyStr: 'baseplate',
  partKey: { id: 'baseplate', instance: null },
}

const toeHookArtifact = {
  id: 'toeHook#1',
  label: 'Toe Hook',
  kind: 'box' as const,
  params: { width: 2, length: 3, height: 4 },
  partKeyStr: 'toeHook#1',
  partKey: { id: 'toeHook', instance: 1 },
}

const createPreviewPreparation = (
  slots: Array<{
    slotId: string
    sourceNodeId: string
    sourcePartKey: string
    status?: 'ok' | 'empty' | 'unresolved'
  }>,
): GraphPreviewPreparation => ({
  outputPreviewNodeId: 'node-output-preview-1',
  outputSlotIds: slots.map((slot) => slot.slotId),
  previewCandidateSlotIds: slots.map((slot) => slot.slotId),
  previewCandidatePartKeys: slots.map((slot) => slot.sourcePartKey),
  sourceNodeIdBySlotId: Object.fromEntries(slots.map((slot) => [slot.slotId, slot.sourceNodeId])),
  sourcePartKeyBySlotId: Object.fromEntries(
    slots.map((slot) => [slot.slotId, slot.sourcePartKey]),
  ),
  sourcePortIdBySlotId: Object.fromEntries(
    slots.map((slot) => [slot.slotId, `out:${slot.sourcePartKey}`]),
  ),
  sourcePartKeyByNodeId: Object.fromEntries(
    slots.map((slot) => [slot.sourceNodeId, slot.sourcePartKey]),
  ),
  slotStatusBySlotId: Object.fromEntries(
    slots.map((slot) => [slot.slotId, slot.status ?? 'ok']),
  ),
  buildStatsReadyPartKeys: [],
  previewIntent: 'outputPreview',
})

describe('useAppStore spaghetti compatibility wrappers', () => {
  const originalWorker = globalThis.Worker

  beforeEach(() => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
  })

  afterEach(async () => {
    try {
      const { buildDispatcher } = await import('../buildDispatcher')
      buildDispatcher.dispose()
    } catch {
      // Ignore cleanup failures from partially initialized modules.
    }
    globalThis.Worker = originalWorker
  })

  it('compileSpaghetti stores compile output for the active graph document', async () => {
    const { useAppStore } = await import('./useAppStore')
    const {
      selectGraphCompileResultByDocumentId,
      useSpaghettiStore,
    } = await import('../spaghetti/store/useSpaghettiStore')
    const { createValidBaseplateGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const secondGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createValidBaseplateGraph(), 'Graph 2')
    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)

    const compileResult = useAppStore.getState().compileSpaghetti()

    expect(compileResult.ok).toBe(true)
    expect(selectGraphCompileResultByDocumentId(useSpaghettiStore.getState(), secondGraphId)?.ok).toBe(
      true,
    )
  })

  it('owns one current project whose graph membership stays separate from viewport and viewer state', async () => {
    const {
      selectCurrentProject,
      selectCurrentProjectRootAssembly,
      selectCurrentProjectGraphDocuments,
      useAppStore,
    } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createValidBaseplateGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    expect(selectCurrentProject(useAppStore.getState())).toMatchObject({
      projectFileId: 'project-file-1',
      name: 'Project 1',
      version: 1,
      rootAssemblyId: 'assembly-root:project-file-1',
    })
    expect(selectCurrentProjectRootAssembly(useAppStore.getState())).toMatchObject({
      assemblyId: 'assembly-root:project-file-1',
      label: 'Assembly 1',
      childRowIds: [],
    })
    expect(
      selectCurrentProjectGraphDocuments(useAppStore.getState()).map((entry) => entry.graphDocumentId),
    ).toEqual(['graph-document-1'])

    const secondGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createValidBaseplateGraph(), 'Graph 2')

    expect(
      selectCurrentProjectGraphDocuments(useAppStore.getState()).map((entry) => ({
        graphDocumentId: entry.graphDocumentId,
        label: entry.label,
      })),
    ).toEqual([
      {
        graphDocumentId: 'graph-document-1',
        label: 'Graph 1',
      },
      {
        graphDocumentId: secondGraphId,
        label: 'Graph 2',
      },
    ])

    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    useSpaghettiStore.getState().setViewerTargetGraphDocumentId('graph-document-1')

    expect(
      selectCurrentProjectGraphDocuments(useAppStore.getState()).map((entry) => entry.graphDocumentId),
    ).toEqual(['graph-document-1', secondGraphId])
  })

  it('creates project-owned component records from resolved graph output entries under the root assembly', async () => {
    const {
      selectCurrentProjectRootAssembly,
      selectCurrentProjectRootComponents,
      useAppStore,
    } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
      {
        slotId: 'slot-toe-hook',
        sourceNodeId: 'node-toehook-1',
        sourcePartKey: 'toeHook#1',
      },
    ])

    useSpaghettiStore.setState((state) => ({
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          previewPreparation,
          acceptedBuildOutputs: [baseplateArtifact],
          outputSurface: buildGraphOutputSurface({
            graphDocumentId: 'graph-document-1',
            previewPreparation,
            acceptedBuildOutputs: [baseplateArtifact],
            publishedAtBuildSeq: 5,
          }),
        },
      },
    }))

    expect(selectCurrentProjectRootAssembly(useAppStore.getState())).toMatchObject({
      assemblyId: 'assembly-root:project-file-1',
      childRowIds: ['project-component:project-file-1:graph-document-1:published'],
    })
    expect(selectCurrentProjectRootComponents(useAppStore.getState())).toEqual([
      {
        componentId: 'project-component:project-file-1:graph-document-1:published',
        ownerGraphDocumentId: 'graph-document-1',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: null,
        sourceNodeId: null,
        label: 'Component 1',
        componentSourceKind: 'published-component',
        resolutionState: 'resolved',
        receiveId: null,
        childObjectIds: [
          'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
          'project-object:project-file-1:graph-document-1:output-object:slot-toe-hook',
        ],
      },
    ])

    useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
    useSpaghettiStore.getState().setViewerTargetGraphDocumentId('graph-document-1')

    expect(selectCurrentProjectRootComponents(useAppStore.getState())).toEqual([
      {
        componentId: 'project-component:project-file-1:graph-document-1:published',
        ownerGraphDocumentId: 'graph-document-1',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: null,
        sourceNodeId: null,
        label: 'Component 1',
        componentSourceKind: 'published-component',
        resolutionState: 'resolved',
        receiveId: null,
        childObjectIds: [
          'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
          'project-object:project-file-1:graph-document-1:output-object:slot-toe-hook',
        ],
      },
    ])
  })

  it('can create multiple project-owned components from multiple resolved outputs in one graph', async () => {
    const {
      selectCurrentProjectContentBrowserRows,
      selectCurrentProjectRootComponents,
      useAppStore,
    } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
      {
        slotId: 'slot-toe-hook',
        sourceNodeId: 'node-toehook-1',
        sourcePartKey: 'toeHook#1',
      },
    ])

    useSpaghettiStore.setState((state) => ({
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          previewPreparation,
          acceptedBuildOutputs: [baseplateArtifact, toeHookArtifact],
          outputSurface: buildGraphOutputSurface({
            graphDocumentId: 'graph-document-1',
            previewPreparation,
            acceptedBuildOutputs: [baseplateArtifact, toeHookArtifact],
            publishedAtBuildSeq: 9,
          }),
        },
      },
    }))

    expect(selectCurrentProjectRootComponents(useAppStore.getState())).toEqual([
      {
        componentId: 'project-component:project-file-1:graph-document-1:published',
        ownerGraphDocumentId: 'graph-document-1',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: null,
        sourceNodeId: null,
        label: 'Component 1',
        componentSourceKind: 'published-component',
        resolutionState: 'resolved',
        receiveId: null,
        childObjectIds: [
          'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
          'project-object:project-file-1:graph-document-1:output-object:slot-toe-hook',
        ],
      },
    ])
    expect(
      selectCurrentProjectContentBrowserRows({
        currentProject: useAppStore.getState().currentProject,
        projectContent: useAppStore.getState().projectContent,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
      }),
      ).toEqual([
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          statusLabel: 'Ready',
          statusTone: 'ready',
        },
        {
          rowId: 'project-component:project-file-1:graph-document-1:published',
          kind: 'component',
          label: 'Component 1',
          meta: 'Graph 1',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          statusLabel: 'Ready',
          statusTone: 'ready',
          ownerGraphDocumentId: 'graph-document-1',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: null,
        componentSourceKind: 'published-component',
        resolutionState: 'resolved',
        receiveId: null,
        childObjectCount: 2,
        slotId: null,
        sourceNodeId: null,
        highlightViewerKey: null,
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: null,
      },
        {
          rowId: 'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
          kind: 'object',
          label: 'Object 1',
          meta: '',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          statusLabel: '',
          statusTone: 'quiet',
        ownerGraphDocumentId: 'graph-document-1',
        parentComponentId: 'project-component:project-file-1:graph-document-1:published',
        objectSourceKind: 'published-object',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        resolutionState: 'resolved',
        highlightViewerKey: 'slot-baseplate',
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: 'node-baseplate-1',
      },
        {
          rowId: 'project-object:project-file-1:graph-document-1:output-object:slot-toe-hook',
          kind: 'object',
          label: 'Object 2',
          meta: '',
          buildState: 'rebuild',
          buildStateLabel: 'Rebuild',
          rebuildGraphDocumentIds: ['graph-document-1'],
          statusLabel: '',
          statusTone: 'quiet',
        ownerGraphDocumentId: 'graph-document-1',
        parentComponentId: 'project-component:project-file-1:graph-document-1:published',
        objectSourceKind: 'published-object',
        sourceGraphDocumentId: 'graph-document-1',
        sourceOutputEntryId: 'output-entry:slot-toe-hook:node-toehook-1',
        slotId: 'slot-toe-hook',
        sourceNodeId: 'node-toehook-1',
        resolutionState: 'resolved',
        highlightViewerKey: 'slot-toe-hook',
        authoringGraphDocumentId: 'graph-document-1',
        authoringNodeId: 'node-toehook-1',
      },
    ])
  })

  it('derives singleton published outputs and receive links as direct project objects', async () => {
    const {
      selectCurrentProjectContentBrowserRows,
      selectCurrentProjectRootAssembly,
      selectCurrentProjectRootComponents,
      useAppStore,
    } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [],
        edges: [],
      },
      'Graph 2',
    )

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-linked',
        sourceNodeId: 'node-baseplate-2',
        sourcePartKey: 'baseplate',
      },
    ])

    useSpaghettiStore.setState((state) => ({
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        [secondGraphId]: {
          ...state.graphRuntimeByDocumentId[secondGraphId],
          previewPreparation,
          acceptedBuildOutputs: [baseplateArtifact],
          outputSurface: buildGraphOutputSurface({
            graphDocumentId: secondGraphId,
            previewPreparation,
            acceptedBuildOutputs: [baseplateArtifact],
            publishedAtBuildSeq: 6,
          }),
        },
      },
    }))

    useSpaghettiStore.getState().addGraphReceiveReference('graph-document-1', {
      receiveId: 'receive-1',
      sourceGraphDocumentId: secondGraphId,
      sourceOutputEntryId: 'output-entry:slot-linked:node-baseplate-2',
    })

    expect(selectCurrentProjectRootAssembly(useAppStore.getState())).toMatchObject({
      childRowIds: expect.arrayContaining([
        `project-object:project-file-1:${secondGraphId}:output-object:slot-linked`,
        'project-object:project-file-1:receive:graph-document-1:receive-1',
      ]),
    })
    expect(selectCurrentProjectRootComponents(useAppStore.getState())).toEqual([])
    expect(
      selectCurrentProjectContentBrowserRows({
        currentProject: useAppStore.getState().currentProject,
        projectContent: useAppStore.getState().projectContent,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
      }),
    ).toEqual(
        expect.arrayContaining([
          {
            rowId: 'assembly-root:project-file-1',
            kind: 'assembly',
            label: 'Assembly 1',
            meta: '',
            buildState: 'rebuild',
            buildStateLabel: 'Rebuild',
            rebuildGraphDocumentIds: ['graph-document-1', secondGraphId],
            statusLabel: 'Ready',
            statusTone: 'ready',
          },
          {
            rowId: `project-object:project-file-1:${secondGraphId}:output-object:slot-linked`,
            kind: 'object',
            label: 'Object 1',
            meta: 'Graph 2',
            buildState: 'rebuild',
            buildStateLabel: 'Rebuild',
            rebuildGraphDocumentIds: [secondGraphId],
            statusLabel: '',
            statusTone: 'quiet',
          ownerGraphDocumentId: secondGraphId,
          parentComponentId: null,
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: secondGraphId,
          sourceOutputEntryId: 'output-entry:slot-linked:node-baseplate-2',
          slotId: 'slot-linked',
          sourceNodeId: 'node-baseplate-2',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-linked',
          authoringGraphDocumentId: secondGraphId,
          authoringNodeId: 'node-baseplate-2',
        },
          {
            rowId: 'project-object:project-file-1:receive:graph-document-1:receive-1',
            kind: 'object',
            label: 'slot-linked',
            meta: 'Linked Object',
            buildState: 'rebuild',
            buildStateLabel: 'Rebuild',
            rebuildGraphDocumentIds: ['graph-document-1'],
            statusLabel: '',
            statusTone: 'quiet',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'receive-link',
          sourceGraphDocumentId: secondGraphId,
          sourceOutputEntryId: 'output-entry:slot-linked:node-baseplate-2',
          slotId: 'slot-linked',
          sourceNodeId: 'node-baseplate-2',
          resolutionState: 'resolved',
          highlightViewerKey: 'slot-linked',
          authoringGraphDocumentId: secondGraphId,
          authoringNodeId: 'node-baseplate-2',
        },
      ]),
    )
  })

  it('keeps missing linked source publication visible as an unresolved receive-link object', async () => {
    const {
      selectCurrentProjectContentBrowserRows,
      selectCurrentProjectRootComponents,
      useAppStore,
    } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
      {
        schemaVersion: 1,
        nodes: [],
        edges: [],
      },
      'Graph 2',
    )

    useSpaghettiStore.getState().addGraphReceiveReference('graph-document-1', {
      receiveId: 'receive-1',
      sourceGraphDocumentId: secondGraphId,
      sourceOutputEntryId: 'output-entry:slot-missing:node-missing-1',
    })

    expect(selectCurrentProjectRootComponents(useAppStore.getState())).toEqual([])
    expect(
      selectCurrentProjectContentBrowserRows({
        currentProject: useAppStore.getState().currentProject,
        projectContent: useAppStore.getState().projectContent,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
      }),
    ).toEqual(
        expect.arrayContaining([
          {
            rowId: 'assembly-root:project-file-1',
            kind: 'assembly',
            label: 'Assembly 1',
            meta: '',
            buildState: 'rebuild',
            buildStateLabel: 'Rebuild',
            rebuildGraphDocumentIds: ['graph-document-1'],
            statusLabel: 'Unresolved',
            statusTone: 'warning',
          },
          {
            rowId: 'project-object:project-file-1:receive:graph-document-1:receive-1',
            kind: 'object',
            label: 'output-entry:slot-missing:node-missing-1',
            meta: 'Unresolved Link',
            buildState: 'rebuild',
            buildStateLabel: 'Rebuild',
            rebuildGraphDocumentIds: ['graph-document-1'],
            statusLabel: 'Unresolved',
            statusTone: 'warning',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: null,
          objectSourceKind: 'receive-link',
          sourceGraphDocumentId: secondGraphId,
          sourceOutputEntryId: 'output-entry:slot-missing:node-missing-1',
          slotId: null,
          sourceNodeId: null,
          resolutionState: 'unresolved',
          highlightViewerKey: null,
          authoringGraphDocumentId: secondGraphId,
          authoringNodeId: null,
        },
      ]),
    )
  })

  it('requestSpaghettiBuild forwards explicit graph routing identity into the canonical build path', async () => {
    const { buildDispatcher } = await import('../buildDispatcher')
    const { selectCurrentProjectId, useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createValidBaseplateGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const secondGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createValidBaseplateGraph(), 'Graph 2')
    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
    useAppStore.setState({ inputMode: 'spaghetti' })

    const requestBuildSpy = vi.spyOn(buildDispatcher, 'requestBuild').mockReturnValue(41)

    const compileResult = useAppStore.getState().requestSpaghettiBuild()

    expect(compileResult.ok).toBe(true)
    expect(requestBuildSpy).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({
        routingIdentity: expect.objectContaining({
          projectFileId: selectCurrentProjectId(useAppStore.getState()),
          graphDocumentId: secondGraphId,
          buildRequestId: expect.any(String),
        }),
      }),
    )
    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId[secondGraphId]?.compileBuild.inFlightBuildSeq,
    ).toBe(41)
  })

  it('updates current project graph membership when a graph document is loaded from file', async () => {
    const { loadGraphDocumentFromFile, serializeGraphDocument } = await import(
      '../io/graphDocumentPersistence'
    )
    const {
      selectCurrentProjectGraphDocuments,
      useAppStore,
    } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

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

    await useSpaghettiStore.getState().loadGraphDocumentFromFile({
      env: loadEnv,
    })

    expect(
      selectCurrentProjectGraphDocuments(useAppStore.getState()).map((entry) => ({
        graphDocumentId: entry.graphDocumentId,
        label: entry.label,
      })),
    ).toEqual([
      {
        graphDocumentId: 'graph-document-1',
        label: 'Graph 1',
      },
      {
        graphDocumentId: 'graph-document-loaded',
        label: 'Loaded Graph',
      },
    ])
  })

  it('acceptBuildResult stores spaghetti outputs graph-locally without overwriting app-global legacy parts', async () => {
    const { selectCurrentProjectId, useAppStore } = await import('./useAppStore')
    const {
      selectGraphAcceptedBuildOutputsByDocumentId,
      selectViewerTargetGraphDocumentId,
      useSpaghettiStore,
    } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

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

    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)
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
      buildRequestId: 'build-request-1',
      buildSeq: 1,
    })

    const result: BuildResult = {
      type: 'build_result',
      seq: 1,
      projectFileId: selectCurrentProjectId(useAppStore.getState()),
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-1',
      changedParamIds: ['sp_full'],
      parts: [
        {
          id: 'baseplate',
          label: 'Baseplate',
          kind: 'box',
          params: { width: 1, length: 2, height: 3 },
          partKeyStr: 'baseplate',
          partKey: { id: 'baseplate', instance: null },
        },
      ],
    }

    useAppStore.getState().acceptBuildResult(result)

    expect(useAppStore.getState().parts).toEqual([])
    expect(useAppStore.getState().lastBuildSeq).toBe(1)
    expect(selectViewerTargetGraphDocumentId(useSpaghettiStore.getState())).toBe(secondGraphId)
    expect(
      selectGraphAcceptedBuildOutputsByDocumentId(useSpaghettiStore.getState(), 'graph-document-1'),
    ).toEqual(result.parts)
    expect(
      selectGraphAcceptedBuildOutputsByDocumentId(useSpaghettiStore.getState(), secondGraphId),
    ).toEqual([])
  })

  it('builds the static reference workspace tree and toggles category visibility as viewer-only state', async () => {
    const {
      selectReferenceWorkspaceBrowserTree,
      useAppStore,
    } = await import('./useAppStore')
    const { resolveReferenceAssetPath } = await import('../references/referenceManifest')

    useAppStore.setState(useAppStore.getInitialState(), true)

    expect(selectReferenceWorkspaceBrowserTree(useAppStore.getState())).toMatchObject({
      rowId: 'reference-root',
      label: 'References',
      isExpanded: true,
      categories: [
        {
          categoryId: 'footpads',
          label: 'Footpads',
          itemCount: 1,
          visibleItemCount: 0,
          items: [
            expect.objectContaining({
              assetPath: resolveReferenceAssetPath(
                'ReferenceModels/footpads/XR_Footpad_PubPad_Full_Assembly.obj',
              ),
              displayTransform: {
                scale: 1,
                rotationDeg: { y: 180 },
                centerUnderPivot: true,
              },
            }),
          ],
        },
        {
          categoryId: 'shoes',
          label: 'Shoes',
          itemCount: 3,
          visibleItemCount: 0,
        },
        {
          categoryId: 'premade-foothooks',
          label: 'Premade Foothooks',
          itemCount: 4,
          visibleItemCount: 0,
          items: [
            expect.objectContaining({
              referenceId: 'hook:large',
              fileType: 'step',
              assetPath: resolveReferenceAssetPath('ReferenceModels/hooks/large.step'),
            }),
            expect.objectContaining({
              referenceId: 'hook:medium',
              fileType: 'step',
              assetPath: resolveReferenceAssetPath('ReferenceModels/hooks/medium.step'),
            }),
            expect.objectContaining({
              referenceId: 'hook:small',
              fileType: 'step',
              assetPath: resolveReferenceAssetPath('ReferenceModels/hooks/small.step'),
            }),
            expect.objectContaining({
              referenceId: 'hook:xl',
              fileType: 'step',
              assetPath: resolveReferenceAssetPath('ReferenceModels/hooks/xl.step'),
            }),
          ],
        },
        {
          categoryId: 'user-references',
          label: 'User References',
          itemCount: 0,
          visibleItemCount: 0,
        },
      ],
    })

    useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
    useAppStore.getState().toggleReferenceCategoryVisibility('shoes')

    expect(selectReferenceWorkspaceBrowserTree(useAppStore.getState())).toMatchObject({
      categories: expect.arrayContaining([
        expect.objectContaining({
          categoryId: 'shoes',
          visibleItemCount: 0,
        }),
      ]),
    })

    useAppStore.getState().toggleReferenceCategoryVisibility('shoes')

    expect(selectReferenceWorkspaceBrowserTree(useAppStore.getState())).toMatchObject({
      categories: expect.arrayContaining([
        expect.objectContaining({
          categoryId: 'shoes',
          visibleItemCount: 3,
        }),
      ]),
    })
  })

  it('adds imported references under User References, disambiguates duplicate labels, and removes them with true workspace cleanup', async () => {
    const { selectReferenceWorkspaceBrowserTree, useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    const revokeObjectURL = vi.fn()
    const originalUrl = globalThis.URL
    globalThis.URL = ({
      ...originalUrl,
      revokeObjectURL,
    } as unknown) as typeof URL

    try {
      const firstReferenceId = useAppStore.getState().addImportedReference({
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-1',
      })
      const secondReferenceId = useAppStore.getState().addImportedReference({
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-2',
      })

      const importedCategory = selectReferenceWorkspaceBrowserTree(useAppStore.getState()).categories.find(
        (category) => category.categoryId === 'user-references',
      )
      expect(importedCategory).toMatchObject({
        categoryId: 'user-references',
        label: 'User References',
        itemCount: 2,
        visibleItemCount: 2,
      })
      expect(importedCategory?.items).toEqual([
        expect.objectContaining({
          referenceId: firstReferenceId,
          sourceKind: 'imported',
          label: 'shoe.glb',
          fileType: 'glb',
          assetPath: 'blob:shoe-1',
          isVisible: true,
          loadState: 'unloaded',
        }),
        expect.objectContaining({
          referenceId: secondReferenceId,
          sourceKind: 'imported',
          label: 'shoe.glb (2)',
          fileType: 'glb',
          assetPath: 'blob:shoe-2',
          isVisible: true,
          loadState: 'unloaded',
        }),
      ])

      useAppStore.getState().setReferenceItemLoadState(firstReferenceId, 'error', 'Load failed')
      useAppStore.getState().retryReferenceItemLoad(firstReferenceId)

      expect(
        selectReferenceWorkspaceBrowserTree(useAppStore.getState()).categories.find(
          (category) => category.categoryId === 'user-references',
        )?.items,
      ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            referenceId: firstReferenceId,
            isVisible: true,
            loadState: 'unloaded',
            errorMessage: null,
          }),
        ]),
      )

      useAppStore.getState().removeImportedReference(firstReferenceId)

      expect(revokeObjectURL).toHaveBeenCalledWith('blob:shoe-1')
      const remainingImportedCategory = selectReferenceWorkspaceBrowserTree(
        useAppStore.getState(),
      ).categories.find((category) => category.categoryId === 'user-references')
      expect(remainingImportedCategory).toMatchObject({
        categoryId: 'user-references',
        itemCount: 1,
      })
      expect(remainingImportedCategory?.items).toEqual([
        expect.objectContaining({ referenceId: secondReferenceId }),
      ])
    } finally {
      globalThis.URL = originalUrl
    }
  })
})
