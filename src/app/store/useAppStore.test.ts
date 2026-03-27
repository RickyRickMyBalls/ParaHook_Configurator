import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  type BuildResult,
  type PartArtifact,
} from '../../shared/buildTypes'
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

const createBuildResult = (options: {
  seq: number
  projectFileId: string
  graphDocumentId: string
  buildRequestId: string
  artifacts: PartArtifact[]
}) =>
  ({
    type: 'build_result',
    lane: 'build',
    seq: options.seq,
    projectFileId: options.projectFileId,
    graphDocumentId: options.graphDocumentId,
    buildRequestId: options.buildRequestId,
    bundle: {
      buildRequestId: options.buildRequestId,
      graphDocumentId: options.graphDocumentId,
      seq: options.seq,
      resultClass: 'final',
      executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
      summary: {
        rebuiltCount: options.artifacts.length,
        retainedCount: 0,
        evictedCount: 0,
      },
      entries: options.artifacts.map((artifact) => ({
        buildUnitId: artifact.partKeyStr,
        outputEntryId: artifact.partKeyStr,
        sourceNodeId: null,
        status: 'rebuilt' as const,
        resultClass: 'final' as const,
        artifacts: [artifact],
      })),
    },
    changedParamIds: ['sp_full'],
  }) satisfies BuildResult

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

  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    const { useConsoleStore } = await import('../console/useConsoleStore')
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
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

  it('defaults the app into the spaghetti-era runtime path', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    expect(useAppStore.getState().selectedPartKey).toBeNull()
  })

  it('owns a first workspace-selection seam for shared target and active-surface truth', async () => {
    const {
      selectActiveWorkspaceSurface,
      selectWorkspaceSelectedTarget,
      useAppStore,
    } = await import('./useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)

    useAppStore.getState().setActiveSurface('spaghetti')
    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-1',
    })

    expect(selectActiveWorkspaceSurface(useAppStore.getState())).toBe('spaghetti')
    expect(selectWorkspaceSelectedTarget(useAppStore.getState())).toMatchObject({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-1',
    })
    expect(useConsoleStore.getState().entries.at(-1)).toMatchObject({
      layer: 'Selection',
      text: 'Active surface: spaghetti',
      source: 'spaghetti',
    })
  })

  it('clears resolved grouped content selection when the primary workspace target changes', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    useAppStore.getState().setWorkspaceResolvedContentSelection({
      rootRowId: 'assembly-root:project-file-1',
      rootKind: 'assembly',
      partKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
      groupedRowIds: ['component-1', 'object-1', 'object-2'],
    })

    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection).toEqual({
      rootRowId: 'assembly-root:project-file-1',
      rootKind: 'assembly',
      partKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
      groupedRowIds: ['component-1', 'object-1', 'object-2'],
    })

    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'reference-item',
      referenceId: 'shoe:shoe-1',
    })

    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection).toBeNull()
  })

  it('stores explicit multi-select roots and resolves unioned grouped content payloads', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.setState((state) => ({
      ...state,
      projectContent: {
        ...state.projectContent,
        assembliesById: {
          'assembly-root:project-file-1': {
            assemblyId: 'assembly-root:project-file-1',
            label: 'Assembly 1',
            childRowIds: ['component-1', 'object-3'],
          },
        },
        componentsById: {
          'component-1': {
            componentId: 'component-1',
            ownerGraphDocumentId: 'graph-document-1',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            label: 'Component 1',
            componentSourceKind: 'published-component',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: ['object-1', 'object-2'],
          },
        },
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: 'component-1',
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
          'object-2': {
            objectId: 'object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: 'component-1',
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-2',
            sourceNodeId: 'node-2',
            slotId: 'slot-b',
            label: 'Object 2',
            resolutionState: 'resolved',
          },
          'object-3': {
            objectId: 'object-3',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-3',
            sourceNodeId: 'node-3',
            slotId: 'slot-c',
            label: 'Object 3',
            resolutionState: 'resolved',
          },
        },
      },
    }))

    useAppStore.getState().setWorkspaceExplicitSelection({
      selectedTarget: {
        kind: 'object',
        objectId: 'object-3',
      },
      explicitSelectedTargets: [
        {
          kind: 'component',
          componentId: 'component-1',
        },
        {
          kind: 'object',
          objectId: 'object-3',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'object-3',
      },
    })

    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([
      {
        kind: 'component',
        componentId: 'component-1',
      },
      {
        kind: 'object',
        objectId: 'object-3',
      },
    ])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toEqual({
      kind: 'object',
      objectId: 'object-3',
    })
    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection).toEqual({
      rootRowId: 'object:object-3',
      rootKind: 'multi-select',
      partKeys: [
        'slot-a',
        'graph-document-1:slot-a',
        'slot-b',
        'graph-document-1:slot-b',
        'slot-c',
        'graph-document-1:slot-c',
      ],
      groupedRowIds: ['object-1', 'object-2'],
    })
  })

  it('resolves linked explicit object selection against the owner graph viewer key', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.setState((state) => ({
      ...state,
      projectContent: {
        ...state.projectContent,
        assembliesById: {
          'assembly-root:project-file-1': {
            assemblyId: 'assembly-root:project-file-1',
            label: 'Assembly 1',
            childRowIds: ['linked-object-1', 'linked-object-2'],
          },
        },
        componentsById: {},
        objectsById: {
          'linked-object-1': {
            objectId: 'linked-object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: null,
            objectSourceKind: 'receive-link',
            sourceGraphDocumentId: 'graph-document-2',
            sourceOutputEntryId: 'output-entry:slot-linked-a:node-linked-a',
            sourceNodeId: 'node-linked-a',
            slotId: 'slot-linked-a',
            label: 'Linked Object A',
            resolutionState: 'resolved',
          },
          'linked-object-2': {
            objectId: 'linked-object-2',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: null,
            objectSourceKind: 'receive-link',
            sourceGraphDocumentId: 'graph-document-3',
            sourceOutputEntryId: 'output-entry:slot-linked-b:node-linked-b',
            sourceNodeId: 'node-linked-b',
            slotId: 'slot-linked-b',
            label: 'Linked Object B',
            resolutionState: 'resolved',
          },
        },
      },
    }))

    useAppStore.getState().setWorkspaceExplicitSelection({
      selectedTarget: {
        kind: 'object',
        objectId: 'linked-object-2',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'linked-object-1',
        },
        {
          kind: 'object',
          objectId: 'linked-object-2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'linked-object-2',
      },
    })

    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection).toEqual({
      rootRowId: 'object:linked-object-2',
      rootKind: 'multi-select',
      partKeys: [
        'slot-linked-a',
        'graph-document-1:slot-linked-a',
        'slot-linked-b',
        'graph-document-1:slot-linked-b',
      ],
      groupedRowIds: [],
    })
  })

  it('does not publish the viewer active-surface line while sketch-plane pick is active', async () => {
    const { useAppStore } = await import('./useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    useSpaghettiStore.setState({
      sketchPlanePickSession: {
        nodeId: 'node-sketch-1',
        editorViewportId: null,
        shouldRestoreViewportWindowMode: false,
        stage: 'pick',
        liveTransformActivationNonce: 0,
        adjustScope: 'root',
        activeTransformAxis: null,
        gizmoMode: 'translate',
        draftPlane: 'XY',
        previewPlane: null,
        transformCommandOrigin: null,
        draftTransform: {
          offsetMm: 0,
          translation: { x: 0, y: 0, z: 0 },
          rotationDeg: { x: 0, y: 0, z: 0 },
          inPlaneRotationDeg: 0,
        },
        transformHistory: [
          {
            entryId: 'origin',
            point: { x: 0, y: 0, z: 0 },
            locked: false,
          },
        ],
        pendingMoveAxisOffSnapConfirmation: null,
      },
    })

    useAppStore.getState().setActiveSurface('viewer')

    expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('viewer')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Active surface: viewer'),
    ).toBe(false)
  })

  it('publishes worker errors into the console transcript', async () => {
    const { useAppStore } = await import('./useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)

    useAppStore.getState().setWorkerError('Build failed')

    expect(useAppStore.getState().workerError).toBe('Build failed')
    expect(useConsoleStore.getState().entries.at(-1)).toMatchObject({
      layer: 'Worker',
      text: 'Build failed',
      source: 'worker',
      severity: 'error',
    })
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
        sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
        graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
      }),
      ).toEqual([
        {
          rowId: 'assembly-root:project-file-1',
          kind: 'assembly',
          label: 'Assembly 1',
          meta: '',
          isVisible: true,
          visibilityPartKeys: [
            'slot-baseplate',
            'graph-document-1:slot-baseplate',
            'slot-toe-hook',
            'graph-document-1:slot-toe-hook',
          ],
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
          isVisible: true,
          visibilityPartKeys: [
            'slot-baseplate',
            'graph-document-1:slot-baseplate',
            'slot-toe-hook',
            'graph-document-1:slot-toe-hook',
          ],
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
          isVisible: true,
          visibilityPartKeys: ['slot-baseplate', 'graph-document-1:slot-baseplate'],
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
          isVisible: true,
          visibilityPartKeys: ['slot-toe-hook', 'graph-document-1:slot-toe-hook'],
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
        sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
        graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
      }),
    ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            rowId: 'assembly-root:project-file-1',
            kind: 'assembly',
            label: 'Assembly 1',
            meta: '',
            statusLabel: 'Ready',
            statusTone: 'ready',
          }),
          expect.objectContaining({
            rowId: `project-object:project-file-1:${secondGraphId}:output-object:slot-linked`,
            kind: 'object',
            label: 'Object 1',
            meta: 'Graph 2',
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
        }),
          expect.objectContaining({
            rowId: 'project-object:project-file-1:receive:graph-document-1:receive-1',
            kind: 'object',
            label: 'slot-linked',
            meta: 'Linked Object',
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
        }),
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
        sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
        graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
      }),
    ).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            rowId: 'assembly-root:project-file-1',
            kind: 'assembly',
            label: 'Assembly 1',
            meta: '',
            statusLabel: 'Unresolved',
            statusTone: 'warning',
          }),
          expect.objectContaining({
            rowId: 'project-object:project-file-1:receive:graph-document-1:receive-1',
            kind: 'object',
            label: 'output-entry:slot-missing:node-missing-1',
            meta: 'Unresolved Link',
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
        }),
      ]),
    )
  })

  it('surfaces authored geometry sketches as browser-visible sketch content rows', async () => {
    const { selectCurrentProjectContentBrowserRows, useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    useSpaghettiStore.setState((state) => ({
      graphDocumentsById: {
        ...state.graphDocumentsById,
        'graph-document-1': {
          ...state.graphDocumentsById['graph-document-1'],
          graph: {
            ...state.graphDocumentsById['graph-document-1'].graph,
            nodes: [
              {
                nodeId: 'node-sketch-1',
                type: 'Geometry/Sketch',
                params: {
                  sketch: {
                    type: 'sketch',
                    featureId: 'sketch-1',
                    plane: 'YZ',
                    components: [
                      {
                        rowId: 'row-1',
                        componentId: 'line-1',
                        type: 'line',
                        a: { kind: 'lit', x: 0, y: 0 },
                        b: { kind: 'lit', x: 20, y: 0 },
                      },
                    ],
                    outputs: {
                      profiles: [],
                    },
                    uiState: {
                      collapsed: false,
                    },
                  },
                },
              },
            ],
            edges: [],
          },
        },
      },
    }))

    expect(
      selectCurrentProjectContentBrowserRows({
        currentProject: useAppStore.getState().currentProject,
        projectContent: useAppStore.getState().projectContent,
        sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
        graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
      }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowId: 'project-sketches-root:project-file-1',
          kind: 'sketches-root',
          label: 'Sketches',
          meta: '1 sketch',
          sketchCount: 1,
        }),
        expect.objectContaining({
          rowId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
          kind: 'sketch',
          label: 'Sketch 1',
          meta: 'Graph 1 | YZ | 1 comp | 0 profiles',
          isVisible: false,
          statusLabel: 'Draft',
          ownerGraphDocumentId: 'graph-document-1',
          graphDocumentId: 'graph-document-1',
          nodeId: 'node-sketch-1',
          featureId: 'sketch-1',
          plane: 'YZ',
          componentCount: 1,
          profileCount: 0,
          diagnosticsCount: 0,
          authoringGraphDocumentId: 'graph-document-1',
          authoringNodeId: 'node-sketch-1',
        }),
      ]),
    )
  })

  it('requestSpaghettiBuild forwards explicit graph routing identity into the canonical build path', async () => {
    const { buildDispatcher } = await import('../buildDispatcher')
    const { selectCurrentProjectId, useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createPublishedCubeGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const secondGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createPublishedCubeGraph(), 'Graph 2')
    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)

    const requestBuildSpy = vi.spyOn(buildDispatcher, 'requestGraphBuild').mockReturnValue(41)

    const compileResult = useAppStore.getState().requestSpaghettiBuild()

    expect(compileResult.ok).toBe(true)
    expect(requestBuildSpy).toHaveBeenCalledWith(
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

  it('keeps requestSpaghettiBuild silent when the active graph has no published build units', async () => {
    const { buildDispatcher } = await import('../buildDispatcher')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createValidBaseplateGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const secondGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createValidBaseplateGraph(), 'Graph 2')
    useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId)

    const requestBuildSpy = vi.spyOn(buildDispatcher, 'requestGraphBuild').mockReturnValue(41)

    const compileResult = useAppStore.getState().requestSpaghettiBuild()

    expect(compileResult.ok).toBe(true)
    expect(requestBuildSpy).not.toHaveBeenCalled()
    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId[secondGraphId]?.compileBuild.inFlightBuildSeq,
    ).toBeNull()
  })

  it('cycles browser graph build policy through live, release, manual, off, and back to live', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    expect(useAppStore.getState().browserGraphBuildPolicyByGraphDocumentId['graph-document-1']).toBe(
      undefined,
    )

    useAppStore.getState().cycleBrowserGraphBuildPolicy('graph-document-1')
    expect(useAppStore.getState().browserGraphBuildPolicyByGraphDocumentId['graph-document-1']).toBe(
      'release',
    )

    useAppStore.getState().cycleBrowserGraphBuildPolicy('graph-document-1')
    expect(useAppStore.getState().browserGraphBuildPolicyByGraphDocumentId['graph-document-1']).toBe(
      'manual',
    )

    useAppStore.getState().cycleBrowserGraphBuildPolicy('graph-document-1')
    expect(useAppStore.getState().browserGraphBuildPolicyByGraphDocumentId['graph-document-1']).toBe(
      'off',
    )

    useAppStore.getState().cycleBrowserGraphBuildPolicy('graph-document-1')
    expect(useAppStore.getState().browserGraphBuildPolicyByGraphDocumentId['graph-document-1']).toBe(
      'live',
    )
  })

  it('cycles browser content build policy through live, release, manual, off, and back to live', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    expect(
      useAppStore.getState().browserContentBuildPolicyByRowId['project-component:test'],
    ).toBe(undefined)

    useAppStore.getState().cycleBrowserContentBuildPolicy('project-component:test')
    expect(
      useAppStore.getState().browserContentBuildPolicyByRowId['project-component:test'],
    ).toBe('release')

    useAppStore.getState().cycleBrowserContentBuildPolicy('project-component:test')
    expect(
      useAppStore.getState().browserContentBuildPolicyByRowId['project-component:test'],
    ).toBe('manual')

    useAppStore.getState().cycleBrowserContentBuildPolicy('project-component:test')
    expect(
      useAppStore.getState().browserContentBuildPolicyByRowId['project-component:test'],
    ).toBe('off')

    useAppStore.getState().cycleBrowserContentBuildPolicy('project-component:test')
    expect(
      useAppStore.getState().browserContentBuildPolicyByRowId['project-component:test'],
    ).toBe('live')
  })

  it('cycles browser content build policy from an inherited base policy when no authored value exists', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    useAppStore.getState().cycleBrowserContentBuildPolicy('project-component:test', 'manual')
    expect(
      useAppStore.getState().browserContentBuildPolicyByRowId['project-component:test'],
    ).toBe('off')
  })

  it('returns browser-authored policy lookups as null when unset', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    expect(useAppStore.getState().getBrowserGraphBuildPolicy('graph-document-1')).toBeNull()
    expect(useAppStore.getState().getBrowserContentBuildPolicy('project-component:test')).toBeNull()

    useAppStore.getState().setBrowserGraphBuildPolicy('graph-document-1', 'release')
    useAppStore.getState().setBrowserContentBuildPolicy('project-component:test', 'manual')

    expect(useAppStore.getState().getBrowserGraphBuildPolicy('graph-document-1')).toBe('release')
    expect(useAppStore.getState().getBrowserContentBuildPolicy('project-component:test')).toBe(
      'manual',
    )
  })

  it('auto-builds live graph revisions immediately through the browser runtime policy path', async () => {
    const { buildDispatcher } = await import('../buildDispatcher')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createPublishedCubeGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const requestBuildSpy = vi.spyOn(buildDispatcher, 'requestGraphBuild').mockReturnValue(91)

    useSpaghettiStore.getState().setGraph(createPublishedCubeGraph())

    expect(requestBuildSpy).toHaveBeenCalledTimes(1)
    expect(requestBuildSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        routingIdentity: expect.objectContaining({
          graphDocumentId: 'graph-document-1',
        }),
      }),
    )
  })

  it('queues release graph revisions until the interaction ends', async () => {
    const { buildDispatcher } = await import('../buildDispatcher')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createPublishedCubeGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const requestBuildSpy = vi.spyOn(buildDispatcher, 'requestGraphBuild').mockReturnValue(92)

    useAppStore.getState().setBrowserGraphBuildPolicy('graph-document-1', 'release')
    useAppStore.getState().beginBrowserBuildInteraction('graph-document-1')
    useSpaghettiStore.getState().setGraph(createPublishedCubeGraph())

    expect(requestBuildSpy).not.toHaveBeenCalled()
    expect(useAppStore.getState().pendingBrowserBuildGraphDocumentIds).toMatchObject({
      'graph-document-1': true,
    })

    useAppStore.getState().endBrowserBuildInteraction('graph-document-1')

    expect(requestBuildSpy).toHaveBeenCalledTimes(1)
    expect(useAppStore.getState().pendingBrowserBuildGraphDocumentIds['graph-document-1']).toBe(
      undefined,
    )
  })

  it('keeps manual graphs dirty until an explicit browser build is requested', async () => {
    const { buildDispatcher } = await import('../buildDispatcher')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createPublishedCubeGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const requestBuildSpy = vi.spyOn(buildDispatcher, 'requestGraphBuild').mockReturnValue(93)

    useAppStore.getState().setBrowserGraphBuildPolicy('graph-document-1', 'manual')
    useSpaghettiStore.getState().setGraph(createPublishedCubeGraph())

    expect(requestBuildSpy).not.toHaveBeenCalled()
    expect(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.compileBuild
        .currentGraphRevision,
    ).toBeGreaterThan(
      useSpaghettiStore.getState().graphRuntimeByDocumentId['graph-document-1']?.compileBuild
        .latestAcceptedGraphRevision ?? -1,
    )

    useAppStore.getState().requestBrowserGraphDocumentBuild('graph-document-1', {
      explicit: true,
    })

    expect(requestBuildSpy).toHaveBeenCalledTimes(1)
  })

  it('lets an independent child outrun parent off in the browser execution-policy selector', async () => {
    const {
      selectEffectiveBrowserExecutionPolicy,
      selectCurrentProjectContentBrowserRows,
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
            publishedAtBuildSeq: 7,
          }),
        },
      },
    }))

    const initialObjectRow = selectCurrentProjectContentBrowserRows({
      currentProject: useAppStore.getState().currentProject,
      projectContent: useAppStore.getState().projectContent,
      sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
      graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
      graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
    }).find((row) => row.kind === 'object' && row.ownerGraphDocumentId === 'graph-document-1')
    expect(initialObjectRow?.rowId).toBeTruthy()

    useAppStore.getState().setBrowserContentBuildPolicy(initialObjectRow!.rowId, 'live')
    useAppStore.getState().setBrowserGraphBuildPolicy('graph-document-1', 'off')
    expect(
      selectCurrentProjectContentBrowserRows({
        currentProject: useAppStore.getState().currentProject,
        projectContent: useAppStore.getState().projectContent,
        sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
        graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
      }),
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          rowId: initialObjectRow?.rowId,
          ownerGraphDocumentId: 'graph-document-1',
        }),
      ]),
    )

    expect(
      selectEffectiveBrowserExecutionPolicy(useAppStore.getState(), {
        kind: 'graph-document',
        graphDocumentId: 'graph-document-1',
      }),
    ).toBe('live')
  })

  it('suppresses off graph output from project content until the graph is re-enabled', async () => {
    const { selectCurrentProjectContentBrowserRows, useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
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
            publishedAtBuildSeq: 8,
          }),
        },
      },
    }))

    const listRows = () =>
      selectCurrentProjectContentBrowserRows({
        currentProject: useAppStore.getState().currentProject,
        projectContent: useAppStore.getState().projectContent,
        sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
        graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
      })

    expect(listRows().some((row) => row.kind === 'object' && row.ownerGraphDocumentId === 'graph-document-1')).toBe(
      true,
    )

    useAppStore.getState().setBrowserGraphBuildPolicy('graph-document-1', 'off')
    expect(listRows().some((row) => row.kind === 'object' && row.ownerGraphDocumentId === 'graph-document-1')).toBe(
      false,
    )

    useAppStore.getState().clearBrowserGraphBuildPolicy('graph-document-1')
    expect(listRows().some((row) => row.kind === 'object' && row.ownerGraphDocumentId === 'graph-document-1')).toBe(
      true,
    )
  })

  it('derives assembly, component, and object viewer visibility from part visibility', async () => {
    const { selectCurrentProjectContentBrowserRows, useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
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
            publishedAtBuildSeq: 9,
          }),
        },
      },
    }))

    const listRows = () =>
      selectCurrentProjectContentBrowserRows({
        currentProject: useAppStore.getState().currentProject,
        projectContent: useAppStore.getState().projectContent,
        partsVisibility: useAppStore.getState().partsVisibility,
        sketchVisibilityByRowId: useAppStore.getState().sketchVisibilityByRowId,
        graphRuntimeByDocumentId: useSpaghettiStore.getState().graphRuntimeByDocumentId,
        graphDocumentsById: useSpaghettiStore.getState().graphDocumentsById,
      })

    expect(listRows()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'assembly',
          isVisible: true,
          visibilityPartKeys: ['slot-baseplate', 'graph-document-1:slot-baseplate'],
        }),
        expect.objectContaining({
          kind: 'object',
          isVisible: true,
          visibilityPartKeys: ['slot-baseplate', 'graph-document-1:slot-baseplate'],
        }),
      ]),
    )

    useAppStore.getState().setPartVisibility('slot-baseplate', false)
    useAppStore.getState().setPartVisibility('graph-document-1:slot-baseplate', false)

    expect(listRows()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'assembly', isVisible: false }),
        expect.objectContaining({ kind: 'object', isVisible: false }),
      ]),
    )
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

    const result = createBuildResult({
      seq: 1,
      projectFileId: selectCurrentProjectId(useAppStore.getState()),
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-1',
      artifacts: [baseplateArtifact],
    })

    useAppStore.getState().acceptBuildResult(result)

    expect(useAppStore.getState().lastBuildSeq).toBe(1)
    expect(selectViewerTargetGraphDocumentId(useSpaghettiStore.getState())).toBe(secondGraphId)
    expect(
      selectGraphAcceptedBuildOutputsByDocumentId(useSpaghettiStore.getState(), 'graph-document-1'),
    ).toEqual(result.bundle.entries.flatMap((entry) => entry.artifacts))
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

    const initialTree = selectReferenceWorkspaceBrowserTree(useAppStore.getState())
    expect(initialTree).toMatchObject({
      rowId: 'reference-root',
      label: 'References',
      isExpanded: true,
    })
    expect(initialTree.categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
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
        }),
        expect.objectContaining({
          categoryId: 'shoes',
          label: 'Shoes',
          itemCount: 3,
          visibleItemCount: 0,
        }),
        expect.objectContaining({
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
        }),
      ]),
    )

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

  it('starts a root reference batch in deterministic browser order and resets errored targets', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.getState().setReferenceItemLoadState('footpad:pubpad-full-assembly', 'error', 'Nope')
    useAppStore.getState().setReferenceItemLoadState('shoe:shoe-1', 'loaded')

    useAppStore.getState().startReferenceLoadBatchForAll()

    const referenceWorkspace = useAppStore.getState().referenceWorkspace
    expect(referenceWorkspace.visibilityById['footpad:pubpad-full-assembly']).toBe(true)
    expect(referenceWorkspace.loadStateById['footpad:pubpad-full-assembly']).toBe('unloaded')
    expect(referenceWorkspace.errorById['footpad:pubpad-full-assembly']).toBeNull()
    expect(referenceWorkspace.referenceLoadBatch).toMatchObject({
      source: 'root-load-all',
      targetIds: [
        'footpad:pubpad-full-assembly',
        'shoe:shoe-2',
        'shoe:shoe-3',
        'hook:large',
        'hook:medium',
        'hook:small',
        'hook:xl',
      ],
      remainingIds: [
        'footpad:pubpad-full-assembly',
        'shoe:shoe-2',
        'shoe:shoe-3',
        'hook:large',
        'hook:medium',
        'hook:small',
        'hook:xl',
      ],
      completedIds: [],
    })
  })

  it('starts a category batch scoped to that category only', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    useAppStore.getState().startReferenceLoadBatchForCategory('footpads')

    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      source: 'category-load-all',
      targetIds: ['footpad:pubpad-full-assembly'],
      remainingIds: ['footpad:pubpad-full-assembly'],
      completedIds: [],
    })
  })

  it('replaces queued batch work while preserving the in-flight active item until it settles', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.getState().startReferenceLoadBatchForAll()
    const firstRequestId =
      useAppStore.getState().referenceWorkspace.referenceLoadBatch?.requestId ?? null
    expect(firstRequestId).not.toBeNull()

    useAppStore
      .getState()
      .markReferenceBatchItemStarted('footpad:pubpad-full-assembly', firstRequestId!)
    useAppStore.getState().startReferenceLoadBatchForCategory('shoes')

    const replacementBatch = useAppStore.getState().referenceWorkspace.referenceLoadBatch
    expect(replacementBatch).toMatchObject({
      source: 'category-load-all',
      activeReferenceId: 'footpad:pubpad-full-assembly',
      targetIds: ['shoe:shoe-1', 'shoe:shoe-2', 'shoe:shoe-3'],
      remainingIds: ['shoe:shoe-1', 'shoe:shoe-2', 'shoe:shoe-3'],
    })
  })

  it('removes hidden queued ids from the active batch while leaving the active item alone', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.getState().startReferenceLoadBatchForAll()
    const firstRequestId =
      useAppStore.getState().referenceWorkspace.referenceLoadBatch?.requestId ?? null
    expect(firstRequestId).not.toBeNull()

    useAppStore
      .getState()
      .markReferenceBatchItemStarted('footpad:pubpad-full-assembly', firstRequestId!)
    useAppStore.getState().setReferenceItemVisibility('shoe:shoe-1', false)
    useAppStore.getState().setReferenceItemVisibility('footpad:pubpad-full-assembly', false)

    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      activeReferenceId: 'footpad:pubpad-full-assembly',
    })
    expect(
      useAppStore.getState().referenceWorkspace.referenceLoadBatch?.remainingIds.includes('shoe:shoe-1'),
    ).toBe(false)
    expect(
      useAppStore.getState().referenceWorkspace.referenceLoadBatch?.targetIds.includes('shoe:shoe-1'),
    ).toBe(false)
    expect(
      useAppStore
        .getState()
        .referenceWorkspace.referenceLoadBatch?.targetIds.includes('footpad:pubpad-full-assembly'),
    ).toBe(true)
  })

  it('appends one console completion line when a reference batch fully completes', async () => {
    const { useAppStore } = await import('./useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)

    useAppStore.getState().startReferenceLoadBatchForCategory('footpads')
    const requestId =
      useAppStore.getState().referenceWorkspace.referenceLoadBatch?.requestId ?? null
    expect(requestId).not.toBeNull()

    useAppStore
      .getState()
      .markReferenceBatchItemStarted('footpad:pubpad-full-assembly', requestId!)
    useAppStore
      .getState()
      .markReferenceBatchItemCompleted('footpad:pubpad-full-assembly', requestId!, 'loaded')

    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toBeNull()
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Load All Complete: Footpads'),
    ).toBe(true)
  })

  it('appends changed reference transform history entries, supports lock toggle, and merges unlocked rows', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    useAppStore.getState().beginReferenceTransformEntry('translate')
    useAppStore.getState().setActiveReferenceTransformDraft({
      position: { x: 5, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    useAppStore.getState().commitActiveReferenceTransformEntry()
    useAppStore.getState().commitActiveReferenceTransformEntry()

    useAppStore.getState().beginReferenceTransformEntry('rotate')
    useAppStore.getState().setActiveReferenceTransformDraft({
      position: { x: 5, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 20, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    useAppStore.getState().commitActiveReferenceTransformEntry()

    useAppStore.getState().beginReferenceTransformEntry('translate')
    useAppStore.getState().setActiveReferenceTransformDraft({
      position: { x: 9, y: -2, z: 4 },
      rotationDeg: { x: 0, y: 20, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    useAppStore.getState().commitActiveReferenceTransformEntry()

    const entriesBeforeMerge =
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'] ?? []
    expect(entriesBeforeMerge).toHaveLength(3)
    expect(entriesBeforeMerge.map((entry) => entry.kind)).toEqual(['move', 'rotate', 'move'])
    expect(entriesBeforeMerge.every((entry) => entry.sessionOrdinal === 1)).toBe(true)
    expect(new Set(entriesBeforeMerge.map((entry) => entry.sessionId)).size).toBe(1)

    useAppStore
      .getState()
      .toggleReferenceTransformHistoryLock('shoe:shoe-1', entriesBeforeMerge[0]!.entryId)
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1']?.[0]
        ?.locked,
    ).toBe(true)

    useAppStore.getState().mergeReferenceTransformHistory('shoe:shoe-1')

    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'],
    ).toMatchObject([
      {
        sessionOrdinal: 1,
        kind: 'move',
        value: { x: 5, y: 0, z: 0 },
        locked: true,
      },
      {
        sessionOrdinal: 1,
        kind: 'move',
        value: { x: 9, y: -2, z: 4 },
        locked: false,
      },
    ])
  })

  it('tracks transform shell sessions on committed child history entries and ignores empty shells', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)

    useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    useAppStore.getState().exitReferenceTransformShell()

    useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    useAppStore.getState().beginReferenceTransformEntry('translate')
    useAppStore.getState().setActiveReferenceTransformDraft({
      position: { x: 3, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    useAppStore.getState().commitActiveReferenceTransformEntry()
    useAppStore.getState().exitReferenceTransformShell()

    useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    useAppStore.getState().beginReferenceTransformEntry('rotate')
    useAppStore.getState().setActiveReferenceTransformDraft({
      position: { x: 3, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 15, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    useAppStore.getState().commitActiveReferenceTransformEntry()

    const entries =
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'] ?? []

    expect(entries).toHaveLength(2)
    expect(entries.map((entry) => entry.sessionOrdinal)).toEqual([1, 2])
    expect(entries[0]?.sessionId).not.toBe(entries[1]?.sessionId)
  })

  it('restores the captured baseline when an active reference transform session is cancelled', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
      position: { x: 2, y: 3, z: 4 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    useAppStore.getState().beginReferenceTransformEntry('translate')
    useAppStore.getState().setActiveReferenceTransformDraft({
      position: { x: 20, y: 30, z: 40 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })

    useAppStore.getState().cancelActiveReferenceTransformEntry()

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.referenceId).toBe('shoe:shoe-1')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryOrigin).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 2, y: 3, z: 4 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
  })

  it('tracks and clears the active reference transform handle across commit and cancel', async () => {
    const { useAppStore } = await import('./useAppStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    useAppStore.getState().beginReferenceTransformEntry('translate')
    useAppStore.getState().setActiveReferenceTransformHandle({
      mode: 'translate',
      kind: 'axis',
      axis: 'y',
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.activeHandle).toMatchObject(
      {
        mode: 'translate',
        kind: 'axis',
        axis: 'y',
      },
    )

    useAppStore.getState().commitActiveReferenceTransformEntry()

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.activeHandle).toBeNull()

    useAppStore.getState().beginReferenceTransformEntry('translate')
    useAppStore.getState().setActiveReferenceTransformHandle({
      mode: 'translate',
      kind: 'axis',
      axis: 'x',
    })

    useAppStore.getState().cancelActiveReferenceTransformEntry()

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.activeHandle).toBeNull()
  })
})

