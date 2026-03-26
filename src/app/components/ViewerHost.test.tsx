// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { GraphPreviewPreparation } from '../spaghetti/previewPreparation'

let viewerEnsureReferenceLoaded: ReturnType<typeof vi.fn>
let viewerSetReferenceVisible: ReturnType<typeof vi.fn>
let viewerRemoveReference: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformSession: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformOverride: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformExit: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformModeChange: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformSpaceChange: ReturnType<typeof vi.fn>
let viewerSetGizmoSnap: ReturnType<typeof vi.fn>
let viewerSetGeometrySketchOverlay: ReturnType<typeof vi.fn>
let viewerSetVisibleGeometrySketchOverlays: ReturnType<typeof vi.fn>
let viewerSetHighlightedPartKeys: ReturnType<typeof vi.fn>
let viewerSetHighlightedReferenceIds: ReturnType<typeof vi.fn>
let viewerSetSketchPlanePickOverlay: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickPlaneSelect: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickTransformCommit: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchHoverPoint: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchConfirmPoint: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchHoverComponent: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchSelectComponents: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchSelectionWindowDraftChange: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchDeleteSelection: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchFinishDraft: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchCancelDraft: ReturnType<typeof vi.fn>
let viewerSetOnWorkspaceSelectionPick: ReturnType<typeof vi.fn>

vi.mock('../viewerBridge', () => ({
  setViewer: vi.fn(),
}))

vi.mock('../../viewer/Viewer', () => ({
  Viewer: class MockViewer {
    public constructor(_container: HTMLElement) {}
    public dispose(): void {}
    public setParts(): void {}
    public setSelectedPart(): void {}
    public setHighlightedPartKeys = (...args: unknown[]) => viewerSetHighlightedPartKeys(...args)
    public setHighlightedReferenceIds = (...args: unknown[]) =>
      viewerSetHighlightedReferenceIds(...args)
    public applyViewSettings(): void {}
    public ensureReferenceLoaded = (...args: unknown[]) => viewerEnsureReferenceLoaded(...args)
    public setReferenceVisible = (...args: unknown[]) => viewerSetReferenceVisible(...args)
    public removeReference = (...args: unknown[]) => viewerRemoveReference(...args)
    public setReferenceTransformSession = (...args: unknown[]) =>
      viewerSetReferenceTransformSession(...args)
    public setReferenceTransformOverride = (...args: unknown[]) =>
      viewerSetReferenceTransformOverride(...args)
    public setOnReferenceTransformChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformChange(...args)
    public setOnReferenceTransformExit = (...args: unknown[]) =>
      viewerSetOnReferenceTransformExit(...args)
    public setOnReferenceTransformModeChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformModeChange(...args)
    public setOnReferenceTransformSpaceChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformSpaceChange(...args)
    public setGizmoSnap = (...args: unknown[]) => viewerSetGizmoSnap(...args)
    public setGeometrySketchOverlay = (...args: unknown[]) => viewerSetGeometrySketchOverlay(...args)
    public setVisibleGeometrySketchOverlays = (...args: unknown[]) =>
      viewerSetVisibleGeometrySketchOverlays(...args)
    public setOnGeometrySketchHoverPoint = (...args: unknown[]) =>
      viewerSetOnGeometrySketchHoverPoint(...args)
    public setOnGeometrySketchConfirmPoint = (...args: unknown[]) =>
      viewerSetOnGeometrySketchConfirmPoint(...args)
    public setOnGeometrySketchHoverComponent = (...args: unknown[]) =>
      viewerSetOnGeometrySketchHoverComponent(...args)
    public setOnGeometrySketchSelectComponents = (...args: unknown[]) =>
      viewerSetOnGeometrySketchSelectComponents(...args)
    public setOnGeometrySketchSelectionWindowDraftChange = (...args: unknown[]) =>
      viewerSetOnGeometrySketchSelectionWindowDraftChange(...args)
    public setOnGeometrySketchDeleteSelection = (...args: unknown[]) =>
      viewerSetOnGeometrySketchDeleteSelection(...args)
    public setOnGeometrySketchFinishDraft = (...args: unknown[]) =>
      viewerSetOnGeometrySketchFinishDraft(...args)
    public setOnGeometrySketchCancelDraft = (...args: unknown[]) =>
      viewerSetOnGeometrySketchCancelDraft(...args)
    public setOnWorkspaceSelectionPick = (...args: unknown[]) =>
      viewerSetOnWorkspaceSelectionPick(...args)
    public setSketchPlanePickOverlay = (...args: unknown[]) =>
      viewerSetSketchPlanePickOverlay(...args)
    public setOnSketchPlanePickPlaneSelect = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickPlaneSelect(...args)
    public setOnSketchPlanePickTransformChange = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickTransformChange(...args)
    public setOnSketchPlanePickTransformCommit = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickTransformCommit(...args)
  },
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

type WorkerMessageHandler = (event: MessageEvent<unknown>) => void
type WorkspaceSelectionPickPayload = {
  pick: { kind: 'part'; partKey: string } | { kind: 'reference-item'; referenceId: string } | null
  ctrlKey: boolean
}

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

const deferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
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
  slotStatusBySlotId: Object.fromEntries(slots.map((slot) => [slot.slotId, slot.status ?? 'ok'])),
  buildStatsReadyPartKeys: [],
  previewIntent: 'outputPreview',
})

const seedViewportObjectSelectionGraph = async (
  slots: Array<{
    slotId: string
    sourceNodeId: string
    sourcePartKey: string
    objectId: string
    label: string
  }>,
) => {
  const { useAppStore } = await import('../store/useAppStore')
  const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
  const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

  const previewPreparation = createPreviewPreparation(slots)
  const componentId = 'project-component:project-file-1:graph-document-1:published'

  act(() => {
    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-output-preview-1',
          type: 'System/OutputPreview',
          params: {
            slots: slots.map((slot) => ({ slotId: slot.slotId })),
            objects: slots.map((slot) => ({
              objectId: slot.objectId,
              label: slot.label,
              slotId: slot.slotId,
            })),
          },
        },
        ...slots.map((slot) => ({
          nodeId: slot.sourceNodeId,
          type: 'Baseplate',
          params: {},
        })),
      ],
      edges: slots.map((slot, index) => ({
        edgeId: `edge-${index + 1}`,
        from: { nodeId: slot.sourceNodeId, portId: 'out:solid' },
        to: { nodeId: 'node-output-preview-1', portId: `in:solid:${slot.slotId}` },
      })),
    })
    useSpaghettiStore.setState((state) => ({
      viewerTargetGraphDocumentId: 'graph-document-1',
      graphRuntimeByDocumentId: {
        ...state.graphRuntimeByDocumentId,
        'graph-document-1': {
          ...state.graphRuntimeByDocumentId['graph-document-1'],
          previewPreparation,
          acceptedPreviewBuildOutputs: slots.map((slot, index) => ({
            id: `artifact-${index + 1}`,
            kind: 'box',
            label: slot.label,
            partKeyStr: slot.sourcePartKey,
            partKey: { id: slot.sourcePartKey, instance: null },
            params: { width: 10, length: 20, height: 5 },
          })),
          outputSurface: buildGraphOutputSurface({
            graphDocumentId: 'graph-document-1',
            previewPreparation,
            acceptedBuildOutputs: slots.map((slot, index) => ({
              id: `artifact-${index + 1}`,
              kind: 'box',
              label: slot.label,
              partKeyStr: slot.sourcePartKey,
              partKey: { id: slot.sourcePartKey, instance: null },
              params: { width: 10, length: 20, height: 5 },
            })),
            publishedAtBuildSeq: 1,
          }),
        },
      },
    }))
    useAppStore.setState((state) => ({
      currentProject: {
        ...state.currentProject,
        graphDocuments: [
          {
            graphDocumentId: 'graph-document-1',
            label: 'Graph 1',
            sourceFilePath: null,
            orderIndex: 0,
          },
        ],
        rootAssemblyId: 'assembly-root:project-file-1',
      },
      projectContent: {
        assembliesById: {
          'assembly-root:project-file-1': {
            assemblyId: 'assembly-root:project-file-1',
            label: 'Assembly 1',
            childRowIds: [componentId],
          },
        },
        componentsById: {
          [componentId]: {
            componentId,
            ownerGraphDocumentId: 'graph-document-1',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: `output-entry:${slots[0]?.slotId ?? 'slot-a'}:${slots[0]?.sourceNodeId ?? 'node-1'}`,
            sourceNodeId: slots[0]?.sourceNodeId ?? 'node-1',
            label: 'Component 1',
            componentSourceKind: 'published-component',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: slots.map((slot) => slot.objectId),
          },
        },
        objectsById: Object.fromEntries(
          slots.map((slot) => [
            slot.objectId,
            {
              objectId: slot.objectId,
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: componentId,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: `output-entry:${slot.slotId}:${slot.sourceNodeId}`,
              sourceNodeId: slot.sourceNodeId,
              slotId: slot.slotId,
              label: slot.label,
              resolutionState: 'resolved',
            },
          ]),
        ),
      },
    }))
  })
}

describe('ViewerHost reference loading', () => {
  const originalWorker = globalThis.Worker
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    viewerEnsureReferenceLoaded = vi.fn()
    viewerSetReferenceVisible = vi.fn()
    viewerRemoveReference = vi.fn()
    viewerSetReferenceTransformSession = vi.fn()
    viewerSetReferenceTransformOverride = vi.fn()
    viewerSetOnReferenceTransformChange = vi.fn()
    viewerSetOnReferenceTransformExit = vi.fn()
    viewerSetOnReferenceTransformModeChange = vi.fn()
    viewerSetOnReferenceTransformSpaceChange = vi.fn()
    viewerSetGizmoSnap = vi.fn()
    viewerSetGeometrySketchOverlay = vi.fn()
    viewerSetVisibleGeometrySketchOverlays = vi.fn()
    viewerSetHighlightedPartKeys = vi.fn()
    viewerSetHighlightedReferenceIds = vi.fn()
    viewerSetSketchPlanePickOverlay = vi.fn()
    viewerSetOnSketchPlanePickPlaneSelect = vi.fn()
    viewerSetOnSketchPlanePickTransformChange = vi.fn()
    viewerSetOnSketchPlanePickTransformCommit = vi.fn()
    viewerSetOnGeometrySketchHoverPoint = vi.fn()
    viewerSetOnGeometrySketchConfirmPoint = vi.fn()
    viewerSetOnGeometrySketchHoverComponent = vi.fn()
    viewerSetOnGeometrySketchSelectComponents = vi.fn()
    viewerSetOnGeometrySketchSelectionWindowDraftChange = vi.fn()
    viewerSetOnGeometrySketchDeleteSelection = vi.fn()
    viewerSetOnGeometrySketchFinishDraft = vi.fn()
    viewerSetOnGeometrySketchCancelDraft = vi.fn()
    viewerSetOnWorkspaceSelectionPick = vi.fn()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    const { useAppStore } = await import('../store/useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    useAppStore.setState(useAppStore.getInitialState(), true)
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    try {
      const { buildDispatcher } = await import('../buildDispatcher')
      buildDispatcher.dispose()
    } catch {
      // Ignore cleanup failures from partially initialized modules.
    }
    globalThis.Worker = originalWorker
  })

  it('promotes a visible reference from loading to loaded after the async viewer load resolves', async () => {
    const load = deferred<void>()
    viewerEnsureReferenceLoaded.mockReturnValue(load.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useConsoleStore } = await import('../console/useConsoleStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('loading')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)

    await act(async () => {
      load.resolve()
      await load.promise
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('loaded')
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith('shoe:shoe-1', true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Loaded Model: Shoe 1'),
    ).toBe(true)
  })

  it('keeps a failed STEP row retryable by clearing visibility on error and loading again after the next click', async () => {
    const firstError = new Error('STEP import failed')
    viewerEnsureReferenceLoaded
      .mockRejectedValueOnce(firstError)
      .mockResolvedValueOnce(undefined)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('hook:large')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['hook:large']).toBe('error')
    expect(useAppStore.getState().referenceWorkspace.visibilityById['hook:large']).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.errorById['hook:large']).toBe('STEP import failed')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('hook:large')
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['hook:large']).toBe('loaded')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith('hook:large', true)
  })

  it('loads a reference batch one item at a time in queue order', async () => {
    const firstLoad = deferred<void>()
    const secondLoad = deferred<void>()
    viewerEnsureReferenceLoaded
      .mockImplementationOnce(() => firstLoad.promise)
      .mockImplementationOnce(() => secondLoad.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForCategory('shoes')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)
    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-1' })
    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch?.activeReferenceId).toBe(
      'shoe:shoe-1',
    )

    await act(async () => {
      await Promise.resolve()
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)

    await act(async () => {
      firstLoad.resolve()
      await firstLoad.promise
    })

    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerEnsureReferenceLoaded.mock.calls[1]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-2' })

    await act(async () => {
      secondLoad.resolve()
      await secondLoad.promise
    })
  })

  it('replaces queued batch work after the in-flight item settles without letting stale completion corrupt the new batch', async () => {
    const firstLoad = deferred<void>()
    const secondLoad = deferred<void>()
    viewerEnsureReferenceLoaded
      .mockImplementationOnce(() => firstLoad.promise)
      .mockImplementationOnce(() => secondLoad.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForAll()
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerEnsureReferenceLoaded.mock.calls[0]?.[0]).toMatchObject({
      referenceId: 'footpad:pubpad-full-assembly',
    })

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForCategory('shoes')
    })

    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      activeReferenceId: 'footpad:pubpad-full-assembly',
      targetIds: ['shoe:shoe-1', 'shoe:shoe-2', 'shoe:shoe-3'],
    })

    await act(async () => {
      firstLoad.resolve()
      await firstLoad.promise
    })

    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch?.completedIds).toEqual([])
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerEnsureReferenceLoaded.mock.calls[1]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-1' })

    await act(async () => {
      secondLoad.resolve()
      await secondLoad.promise
    })
  })

  it('advances the batch after a failed reference load and counts the failure as completed progress', async () => {
    const secondLoad = deferred<void>()
    viewerEnsureReferenceLoaded
      .mockRejectedValueOnce(new Error('Shoe 1 failed'))
      .mockImplementationOnce(() => secondLoad.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().startReferenceLoadBatchForCategory('shoes')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('error')
    expect(useAppStore.getState().referenceWorkspace.visibilityById['shoe:shoe-1']).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      failedIds: ['shoe:shoe-1'],
      activeReferenceId: 'shoe:shoe-2',
    })
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerEnsureReferenceLoaded.mock.calls[1]?.[0]).toMatchObject({ referenceId: 'shoe:shoe-2' })

    await act(async () => {
      secondLoad.resolve()
      await secondLoad.promise
    })
  })

  it('removes an imported reference object from the viewer when the workspace row is removed', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().addImportedReference({
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-1',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    const importedReferenceId =
      useAppStore.getState().referenceWorkspace.importedReferenceOrder[0] ?? null
    expect(importedReferenceId).not.toBeNull()

    act(() => {
      useAppStore.getState().removeImportedReference(importedReferenceId!)
    })

    expect(viewerRemoveReference).toHaveBeenCalledWith(importedReferenceId)
  })

  it('syncs an active reference transform session into the viewer and exits when the reference is hidden', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransform('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetReferenceTransformSession).toHaveBeenCalledWith({
      referenceId: 'shoe:shoe-1',
      mode: 'translate',
      space: 'local',
    })

    act(() => {
      useAppStore.getState().setReferenceItemVisibility('shoe:shoe-1', false)
    })

    expect(useAppStore.getState().referenceWorkspace.activeTransformReferenceId).toBeNull()
  })

  it('pushes the active reference rotate snap value into the viewer gizmo snap state', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransform('shoe:shoe-1')
      useAppStore.getState().setReferenceRotateSnapEnabled('shoe:shoe-1', true)
      useAppStore.getState().setReferenceRotateSnapValue('shoe:shoe-1', 22.5)
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetGizmoSnap).toHaveBeenCalledWith({ rotateDeg: 22.5 })
  })

  it('pushes the active geometry sketch session into the viewer overlay and clears it when closed', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
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
                plane: 'XZ',
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 25, y: 10 },
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
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'draw',
        plane: 'XZ',
        planeTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 0, y: 0, z: 0 }),
        }),
        drawStage: 'sessionIdle',
        activeTool: null,
        drawDraft: null,
        ui: expect.objectContaining({
          snapEnabled: true,
          snapDistancePx: 14,
          crosshairSize: 1,
          startPointVisible: true,
          startPointSymbolSize: 0.1,
          startPointSymbolType: 'circle',
          plinePointVisible: true,
          plinePointSymbolSize: 0.05,
          plinePointSymbolType: 'circle',
        }),
        components: expect.any(Array),
      }),
    )

    act(() => {
      useSpaghettiStore.getState().closeGeometrySketchSession()
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenLastCalledWith(null)
  })

  it('updates the viewer overlay mode and selected profile when sketch review becomes active', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
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
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: {
                        winding: 'CCW',
                        segments: [],
                      },
                      verticesProxy: [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                      ],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: {
                        winding: 'CCW',
                        segments: [],
                      },
                      verticesProxy: [
                        { x: 20, y: 0 },
                        { x: 28, y: 0 },
                        { x: 28, y: 8 },
                        { x: 20, y: 8 },
                      ],
                    },
                  ],
                },
                uiState: {
                  collapsed: false,
                  selectedProfileId: 'profile-b',
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'review')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'review',
        selectedProfileId: 'profile-b',
        profiles: expect.arrayContaining([
          expect.objectContaining({ profileId: 'profile-a' }),
          expect.objectContaining({ profileId: 'profile-b' }),
        ]),
      }),
    )
  })

  it('pushes browser-visible sketch rows into the passive viewer sketch overlay lane', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
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
                plane: 'YZ',
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
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
      })
      useAppStore.getState().setSketchVisibility(
        'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        true,
      )
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetVisibleGeometrySketchOverlays).toHaveBeenCalledWith([
      expect.objectContaining({
        overlayId: 'project-sketch:graph-document-1:node-sketch-1:sketch-1',
        plane: 'YZ',
        components: expect.any(Array),
        profiles: [],
      }),
    ])
  })

  it('pushes assembly and component content selection into the viewer highlighted-part lane', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { buildGraphOutputSurface } = await import('../spaghetti/outputSurface')

    const previewPreparation = createPreviewPreparation([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
      },
    ])

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: {
              slots: [{ slotId: 'slot-baseplate' }],
              objects: [
                {
                  objectId: 'output-object:slot-baseplate',
                  label: 'Object 1',
                  slotId: 'slot-baseplate',
                },
              ],
            },
          },
          {
            nodeId: 'node-baseplate-1',
            type: 'Baseplate',
            params: {},
          },
        ],
        edges: [
          {
            edgeId: 'edge-1',
            from: { nodeId: 'node-baseplate-1', portId: 'out:solid' },
            to: { nodeId: 'node-output-preview-1', portId: 'in:solid:slot-baseplate' },
          },
        ],
      })
      useSpaghettiStore.setState((state) => ({
        viewerTargetGraphDocumentId: 'graph-document-1',
        graphRuntimeByDocumentId: {
          ...state.graphRuntimeByDocumentId,
          'graph-document-1': {
            ...state.graphRuntimeByDocumentId['graph-document-1'],
            previewPreparation,
            acceptedPreviewBuildOutputs: [
              {
                id: 'artifact-1',
                kind: 'box',
                label: 'Baseplate',
                partKeyStr: 'baseplate',
                partKey: { id: 'baseplate', instance: null },
                params: { width: 10, length: 20, height: 5 },
              },
            ],
            outputSurface: buildGraphOutputSurface({
              graphDocumentId: 'graph-document-1',
              previewPreparation,
              acceptedBuildOutputs: [
                {
                  id: 'artifact-1',
                  kind: 'box',
                  label: 'Baseplate',
                  partKeyStr: 'baseplate',
                  partKey: { id: 'baseplate', instance: null },
                  params: { width: 10, length: 20, height: 5 },
                },
              ],
              publishedAtBuildSeq: 1,
            }),
          },
        },
      }))
      useAppStore.setState((state) => ({
        currentProject: {
          ...state.currentProject,
          graphDocuments: [
            {
              graphDocumentId: 'graph-document-1',
              label: 'Graph 1',
              sourceFilePath: null,
              orderIndex: 0,
            },
          ],
          rootAssemblyId: 'assembly-root:project-file-1',
        },
        projectContent: {
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['project-component:project-file-1:graph-document-1:published'],
            },
          },
          componentsById: {
            'project-component:project-file-1:graph-document-1:published': {
              componentId: 'project-component:project-file-1:graph-document-1:published',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              childObjectIds: ['project-object:project-file-1:graph-document-1:output-object'],
            },
          },
          objectsById: {
            'project-object:project-file-1:graph-document-1:output-object': {
              objectId: 'project-object:project-file-1:graph-document-1:output-object',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'project-component:project-file-1:graph-document-1:published',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry:slot-baseplate:node-baseplate-1',
              sourceNodeId: 'node-baseplate-1',
              slotId: 'slot-baseplate',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'assembly',
        assemblyId: 'assembly-root:project-file-1',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetHighlightedPartKeys).toHaveBeenCalledWith(
      expect.arrayContaining(['slot-baseplate']),
    )
  })

  it('routes viewport object picks into shared explicit selection and clears on empty clicks', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')
    await seedViewportObjectSelectionGraph([
      {
        slotId: 'slot-baseplate',
        sourceNodeId: 'node-baseplate-1',
        sourcePartKey: 'baseplate',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        label: 'Object 1',
      },
      {
        slotId: 'slot-cover',
        sourceNodeId: 'node-cover-1',
        sourcePartKey: 'cover',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
        label: 'Object 2',
      },
    ])

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        pick: {
          kind: 'part',
          partKey: 'graph-document-1:slot-baseplate',
        },
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'project-object:project-file-1:graph-document-1:output-object-1',
        rootKind: 'object',
        partKeys: ['graph-document-1:slot-baseplate'],
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBe('graph-document-1:slot-baseplate')
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('target-selection')

    act(() => {
      workspaceSelectionPickHandler?.({
        pick: {
          kind: 'part',
          partKey: 'graph-document-1:slot-cover',
        },
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'object:project-object:project-file-1:graph-document-1:output-object-2',
        rootKind: 'multi-select',
        partKeys: expect.arrayContaining(['graph-document-1:slot-baseplate', 'graph-document-1:slot-cover']),
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBe('graph-document-1:slot-cover')

    act(() => {
      workspaceSelectionPickHandler?.({
        pick: {
          kind: 'part',
          partKey: 'graph-document-1:slot-cover',
        },
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      explicitSelectedTargets: [
        {
          kind: 'object',
          objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
        },
      ],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-2',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: {
        rootRowId: 'project-object:project-file-1:graph-document-1:output-object-1',
        rootKind: 'object',
        partKeys: ['graph-document-1:slot-baseplate'],
        groupedRowIds: [],
      },
    })
    expect(useAppStore.getState().selectedPartKey).toBe('graph-document-1:slot-cover')

    act(() => {
      workspaceSelectionPickHandler?.({
        pick: {
          kind: 'part',
          partKey: 'graph-document-1:slot-baseplate',
        },
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: null,
      explicitSelectedTargets: [],
      selectionAnchorTarget: {
        kind: 'object',
        objectId: 'project-object:project-file-1:graph-document-1:output-object-1',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: null,
    })
    expect(useAppStore.getState().selectedPartKey).toBeNull()

    act(() => {
      workspaceSelectionPickHandler?.({
        pick: null,
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().selectedPartKey).toBeNull()
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('surface-clear')
  })

  it('routes viewport reference picks back into workspace selection', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        pick: {
          kind: 'reference-item',
          referenceId: 'shoe:shoe-1',
        },
        ctrlKey: false,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      },
      activeSurface: 'viewer',
      resolvedContentSelection: null,
    })
    expect(useAppStore.getState().selectedPartKey).toBeNull()
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('target-selection')
  })

  it('keeps unmapped viewport part picks as single part selection', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    const workspaceSelectionPickHandler = viewerSetOnWorkspaceSelectionPick.mock.calls.at(-1)?.[0] as
      | ((event: WorkspaceSelectionPickPayload) => void)
      | null

    act(() => {
      workspaceSelectionPickHandler?.({
        pick: {
          kind: 'part',
          partKey: 'unmapped-part-key',
        },
        ctrlKey: true,
      })
    })

    expect(useAppStore.getState().workspaceSelection).toMatchObject({
      selectedTarget: {
        kind: 'part',
        partKey: 'unmapped-part-key',
      },
      explicitSelectedTargets: [],
      selectionAnchorTarget: null,
      resolvedContentSelection: null,
      activeSurface: 'viewer',
    })
    expect(useAppStore.getState().selectedPartKey).toBe('unmapped-part-key')
    expect(useAppStore.getState().consoleContextSyncRequest?.reason).toBe('target-selection')
  })

  it('pushes selected references into the viewer highlight lane without starting transform ownership', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.setState((state) => ({
        ...state,
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-1',
          },
          activeSurface: 'browser',
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetHighlightedReferenceIds).toHaveBeenCalledWith(['shoe:shoe-1'])
    expect(viewerSetReferenceTransformSession).not.toHaveBeenCalledWith(
      expect.objectContaining({ referenceId: 'shoe:shoe-1' }),
    )
  })

  it('pushes explicit multi-selected references into the viewer highlight lane', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.setState((state) => ({
        ...state,
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-2',
          },
          explicitSelectedTargets: [
            {
              kind: 'reference-item',
              referenceId: 'shoe:shoe-1',
            },
            {
              kind: 'reference-item',
              referenceId: 'shoe:shoe-2',
            },
          ],
          selectionAnchorTarget: {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-2',
          },
        },
      }))
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetHighlightedReferenceIds).toHaveBeenCalledWith(['shoe:shoe-1', 'shoe:shoe-2'])
  })

  it('pushes the active sketch-plane pick session into the viewer and routes plane picks back into the store', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
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
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetSketchPlanePickOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        stage: 'pick',
        gizmoMode: 'translate',
        draftPlane: 'XY',
        draftTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 0, y: 0, z: 0 }),
        }),
      }),
    )
    expect(viewerSetOnSketchPlanePickPlaneSelect).toHaveBeenCalledWith(expect.any(Function))
    expect(viewerSetOnSketchPlanePickTransformChange).toHaveBeenCalledWith(expect.any(Function))
    expect(viewerSetOnSketchPlanePickTransformCommit).toHaveBeenCalledWith(expect.any(Function))

    const planeSelectHandler = viewerSetOnSketchPlanePickPlaneSelect.mock.calls.at(-1)?.[0] as
      | ((plane: 'XY' | 'XZ' | 'YZ') => void)
      | null

    act(() => {
      planeSelectHandler?.('YZ')
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftPlane: 'YZ',
      stage: 'adjust',
    })

    const transformChangeHandler =
      viewerSetOnSketchPlanePickTransformChange.mock.calls.at(-1)?.[0] as
        | ((transform: {
            offsetMm: number
            inPlaneRotationDeg: number
            translation: { x: number; y: number; z: number }
            rotationDeg: { x: number; y: number; z: number }
          }) => void)
        | null

    act(() => {
      transformChangeHandler?.({
        offsetMm: 0,
        inPlaneRotationDeg: 0,
        translation: { x: 12, y: -4, z: 8 },
        rotationDeg: { x: 0, y: 30, z: 45 },
      })
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftTransform: {
        translation: { x: 12, y: -4, z: 8 },
        rotationDeg: { x: 0, y: 30, z: 45 },
      },
    })

    const transformCommitHandler =
      viewerSetOnSketchPlanePickTransformCommit.mock.calls.at(-1)?.[0] as (() => void) | null

    act(() => {
      transformCommitHandler?.()
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.transformHistory).toEqual([
      {
        entryId: 'sketch-plane-history-1',
        point: { x: 12, y: -4, z: 8 },
        locked: false,
      },
    ])
  })
})
