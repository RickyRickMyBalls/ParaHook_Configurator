import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../shared/buildTypes'
import { LEGACY_BUILD_STATS_PART_ORDER } from '../shared/buildStatsKeys'

type WorkerMessageHandler = (event: MessageEvent<unknown>) => void

class MockWorker {
  public readonly postedMessages: unknown[] = []
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

  public postMessage(message: unknown): void {
    this.postedMessages.push(message)
  }

  public dispatchMessage(message: unknown): void {
    for (const handler of this.handlers) {
      handler({ data: message } as MessageEvent<unknown>)
    }
  }

  public terminate(): void {}
}

const resetBuildStatsStore = (
  useBuildStatsStore: typeof import('./store/buildStatsStore').useBuildStatsStore,
): void => {
  useBuildStatsStore.setState({
    activeSeq: null,
    overallState: 'idle',
    partOrder: [],
    partStatsByKey: {},
    pulseNonce: 0,
    pulseKind: null,
  })
}

describe('BuildDispatcher build stats seeding', () => {
  const originalWorker = globalThis.Worker

  beforeEach(() => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
  })

  afterEach(async () => {
    try {
      const module = await import('./buildDispatcher')
      module.buildDispatcher.dispose()
    } catch {
      // Ignore cleanup failures from partially initialized modules.
    }
    globalThis.Worker = originalWorker
  })

  it('seeds spaghetti build stats rows from canonical source/build part keys', async () => {
    const module = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    module.buildDispatcher.dispose()
    resetBuildStatsStore(useBuildStatsStore)
    const dispatcher = new module.BuildDispatcher()
    dispatcher.setChangedParamIdsProvider(() => ['sp_full'])
    dispatcher.setBuildInstancesProvider(() => ({
      heelKickInstances: [1],
      toeHookInstances: [1],
    }))
    dispatcher.setBuildStatsPartKeysProvider(() => ['cube', 'assembled'])

    dispatcher.requestBuild({ width: 1, length: 2, height: 3 })

    expect(useBuildStatsStore.getState().partOrder).toEqual(['cube', 'assembled'])
    dispatcher.dispose()
  })

  it('keeps legacy build stats ordering unchanged when no spaghetti keys are provided', async () => {
    const module = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    module.buildDispatcher.dispose()
    resetBuildStatsStore(useBuildStatsStore)
    const dispatcher = new module.BuildDispatcher()

    dispatcher.requestBuild({ width: 1, length: 2, height: 3 })

    expect(useBuildStatsStore.getState().partOrder).toEqual([
      ...LEGACY_BUILD_STATS_PART_ORDER,
    ])
    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    expect(worker.postedMessages[0]).toEqual(
      expect.objectContaining({
        type: 'build',
        lane: 'build',
        executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
      }),
    )
    dispatcher.dispose()
  })

  it('posts graph-native build requests with compiled data and build-unit identity', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()

    dispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      },
      legacyPayload: { width: 1, length: 2, height: 3 },
      compiledBuildData: {
        instances: {
          heelKickInstances: [1],
          toeHookInstances: [1],
        },
        orderedPartKeys: ['cube'],
        resolvedParts: {},
        resolvedShared: {
          sp_featureStackIR: {
            schemaVersion: 1,
            parts: {
              cube: [],
            },
          },
        },
      },
      buildIdentity: {
        graphRevision: 4,
        targetBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      invalidation: {
        affectedBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      changedParamIds: ['sp_full'],
      buildStatsPartKeys: ['cube', 'assembled'],
    })

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    expect(worker.postedMessages[0]).toEqual(
      expect.objectContaining({
        type: 'build',
        lane: 'build',
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
        executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
        compiledBuildData: expect.objectContaining({
          orderedPartKeys: ['cube'],
        }),
        buildIdentity: {
          graphRevision: 4,
          targetBuildUnitIds: ['output-entry:s001:node-cube'],
        },
        invalidation: {
          affectedBuildUnitIds: ['output-entry:s001:node-cube'],
        },
      }),
    )
    dispatcher.dispose()
  })

  it('rejects a wrong-graph result and keeps the handler quiet', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const handler = vi.fn()
    dispatcher.setBuildResultHandler(handler)

    dispatcher.requestBuild(
      { width: 1, length: 2, height: 3 },
      {
        routingIdentity: {
          projectFileId: 'project-1',
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-1',
        },
      },
    )

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage({
      type: 'build_result',
      lane: 'build',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-b',
      buildRequestId: 'request-b-1',
      parts: [],
      changedParamIds: ['sp_full'],
    })

    expect(handler).not.toHaveBeenCalled()
    dispatcher.dispose()
  })

  it('accepts build results that carry graph-native mesh artifacts', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const handler = vi.fn()
    dispatcher.setBuildResultHandler(handler)

    dispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      },
      legacyPayload: { width: 1, length: 2, height: 3 },
      compiledBuildData: {
        instances: {
          heelKickInstances: [1],
          toeHookInstances: [1],
        },
        orderedPartKeys: ['extrude'],
        resolvedParts: {},
      },
      buildIdentity: {
        graphRevision: 1,
        targetBuildUnitIds: ['output-entry:s001:node-extrude'],
      },
      invalidation: {
        affectedBuildUnitIds: ['output-entry:s001:node-extrude'],
      },
      buildStatsPartKeys: ['extrude', 'assembled'],
    })

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage({
      type: 'build_result',
      lane: 'build',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      parts: [
        {
          id: 'extrude',
          label: 'Extrude',
          kind: 'mesh',
          mesh: {
            vertices: [
              0, 0, 0,
              5, 0, 0,
              0, 20, 0,
            ],
            indices: [0, 1, 2],
          },
          partKeyStr: 'extrude',
          partKey: {
            id: 'extrude',
            instance: null,
          },
        },
      ],
    })

    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
        parts: [
          expect.objectContaining({
            kind: 'mesh',
            partKeyStr: 'extrude',
          }),
        ],
      }),
    )
    dispatcher.dispose()
  })

  it('rejects stale same-graph results after a newer request is issued', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const handler = vi.fn()
    dispatcher.setBuildResultHandler(handler)

    dispatcher.requestBuild(
      { width: 1, length: 2, height: 3 },
      {
        routingIdentity: {
          projectFileId: 'project-1',
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-1',
        },
      },
    )
    dispatcher.requestBuild(
      { width: 4, length: 5, height: 6 },
      {
        routingIdentity: {
          projectFileId: 'project-1',
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-2',
        },
      },
    )

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage({
      type: 'build_result',
      lane: 'build',
      seq: 2,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-2',
      parts: [],
      changedParamIds: ['sp_width'],
    })
    worker.dispatchMessage({
      type: 'build_result',
      lane: 'build',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      parts: [],
      changedParamIds: ['sp_full'],
    })

    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({
        seq: 2,
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      }),
    )
    dispatcher.dispose()
  })

  it('keeps concurrent graph results isolated per routing ledger', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const handler = vi.fn()
    dispatcher.setBuildResultHandler(handler)

    dispatcher.requestBuild(
      { width: 1, length: 2, height: 3 },
      {
        routingIdentity: {
          projectFileId: 'project-1',
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-1',
        },
      },
    )
    dispatcher.requestBuild(
      { width: 7, length: 8, height: 9 },
      {
        routingIdentity: {
          projectFileId: 'project-1',
          graphDocumentId: 'graph-b',
          buildRequestId: 'request-b-1',
        },
      },
    )

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage({
      type: 'build_result',
      lane: 'build',
      seq: 2,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-b',
      buildRequestId: 'request-b-1',
      parts: [],
      changedParamIds: ['sp_length'],
    })
    worker.dispatchMessage({
      type: 'build_result',
      lane: 'build',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      parts: [],
      changedParamIds: ['sp_width'],
    })

    expect(handler).toHaveBeenCalledTimes(2)
    expect(handler).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        seq: 2,
        graphDocumentId: 'graph-b',
      }),
    )
    expect(handler).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        seq: 1,
        graphDocumentId: 'graph-a',
      }),
    )
    dispatcher.dispose()
  })
})
