import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDefaultNodeParams } from '../spaghetti/registry/nodeRegistry'

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

describe('workspaceIntents', () => {
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

  it('activates a graph document through one shared workspace intent path', async () => {
    const { activateGraphDocumentIntent } = await import('./workspaceIntents')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { createValidBaseplateGraph } = await import('../spaghetti/dev/sampleGraph')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const secondGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createValidBaseplateGraph(), 'Graph 2')

    const result = activateGraphDocumentIntent(
      {
        app: useAppStore.getState(),
        spaghetti: useSpaghettiStore.getState(),
      },
      secondGraphId,
      {
        strategy: 'open-or-focus',
        spawnPosition: { x: 420, y: 84 },
      },
    )

    expect(result.graphDocumentId).toBe(secondGraphId)
    expect(result.editorViewportId).not.toBeNull()
    expect(useSpaghettiStore.getState().activeGraphDocumentId).toBe(secondGraphId)
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-document',
      graphDocumentId: secondGraphId,
    })
    expect(useAppStore.getState().consoleContextSyncRequest).toMatchObject({
      reason: 'target-selection',
    })
    expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('spaghetti')
    expect(useAppStore.getState().floatingShellActivationRequest?.target).toBe('spaghetti')
  })

  it('activates a graph node through the same shared workspace intent seam', async () => {
    const { activateGraphNodeIntent } = await import('./workspaceIntents')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    useSpaghettiStore.getState().setGraph({
      schemaVersion: 1,
      nodes: [
        {
          nodeId: 'node-sketch-1',
          type: 'Geometry/Sketch',
          params: getDefaultNodeParams('Geometry/Sketch'),
        },
      ],
      edges: [],
    })

    const result = activateGraphNodeIntent(
      {
        app: useAppStore.getState(),
        spaghetti: useSpaghettiStore.getState(),
      },
      'graph-document-1',
      'node-sketch-1',
      {
        strategy: 'open-or-focus',
      },
    )

    expect(result.graphDocumentId).toBe('graph-document-1')
    expect(result.nodeId).toBe('node-sketch-1')
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-sketch-1')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-sketch-1',
    })
    expect(useAppStore.getState().consoleContextSyncRequest).toMatchObject({
      reason: 'target-selection',
    })
    expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('spaghetti')
  })

  it('activates a reference item through the canonical workspace intent seam', async () => {
    const { activateReferenceItemIntent } = await import('./workspaceIntents')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const result = activateReferenceItemIntent(
      {
        app: useAppStore.getState(),
        spaghetti: useSpaghettiStore.getState(),
      },
      'shoe:shoe-1',
    )

    expect(result.referenceId).toBe('shoe:shoe-1')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'reference-item',
      referenceId: 'shoe:shoe-1',
    })
    expect(useAppStore.getState().consoleContextSyncRequest).toMatchObject({
      reason: 'target-selection',
    })
    expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('browser')
    expect(useAppStore.getState().referenceWorkspace.visibilityById['shoe:shoe-1']).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
    expect(useAppStore.getState().floatingShellActivationRequest?.target).toBe('browser')
  })

  it('can explicitly promote a reference intent into visible transform ownership', async () => {
    const { activateReferenceItemIntent } = await import('./workspaceIntents')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    activateReferenceItemIntent(
      {
        app: useAppStore.getState(),
        spaghetti: useSpaghettiStore.getState(),
      },
      'shoe:shoe-1',
      {
        ensureVisible: true,
        beginTransform: true,
      },
    )

    expect(useAppStore.getState().referenceWorkspace.visibilityById['shoe:shoe-1']).toBe(true)
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.referenceId).toBe('shoe:shoe-1')
  })

  it('activates an object target through the canonical workspace intent seam', async () => {
    const { activateObjectIntent } = await import('./workspaceIntents')
    const { useAppStore } = await import('./useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)

    const result = activateObjectIntent(
      {
        app: useAppStore.getState(),
        spaghetti: useSpaghettiStore.getState(),
      },
      'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
      {
        partKey: 'slot-baseplate',
      },
    )

    expect(result.objectId).toBe(
      'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
    )
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'object',
      objectId: 'project-object:project-file-1:graph-document-1:output-object:slot-baseplate',
    })
    expect(useAppStore.getState().consoleContextSyncRequest).toMatchObject({
      reason: 'target-selection',
    })
    expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('browser')
    expect(useAppStore.getState().selectedPartKey).toBe('slot-baseplate')
    expect(useAppStore.getState().floatingShellActivationRequest?.target).toBe('browser')
  })
})
