import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../shared/buildTypes'
import type { GeometryResultBundle } from '../shared/geometryResult'
import { emitArtifacts } from '../worker/pipeline/artifactEmitter'

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

const buildResult = (options: {
  buildRequestId: string
  graphDocumentId: string
  projectFileId: string
  seq: number
  draftGeometryResult?: GeometryResultBundle
  authoritativeGeometryResult?: GeometryResultBundle
}) =>
  emitArtifacts(
    {
      seq: options.seq,
      projectFileId: options.projectFileId,
      graphDocumentId: options.graphDocumentId,
      buildRequestId: options.buildRequestId,
      executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
      draftGeometryResult: options.draftGeometryResult,
      authoritativeGeometryResult: options.authoritativeGeometryResult,
    },
    [],
    [],
  )

const buildGeometryResult = (options: {
  graphDocumentId: string
  buildRequestId: string
}): GeometryResultBundle => ({
  schemaVersion: 1,
  request: {
    graphDocumentId: options.graphDocumentId,
    buildRequestId: options.buildRequestId,
    partKeys: ['cube'],
  },
  resultClass: 'draft',
  status: 'ok',
  bodies: {},
  meshPreview: null,
  diagnostics: [],
  trace: [],
  authoritativeHandle: null,
})

const compiledBuildData = {
  orderedPartKeys: ['cube'],
  resolvedParts: {},
  resolvedShared: {
    sp_featureStackIR: {
      schemaVersion: 1 as const,
      parts: {
        cube: [],
      },
    },
  },
  outputEntries: [
    {
      buildUnitId: 'output-entry:s001:node-cube',
      outputEntryId: 'output-entry:s001:node-cube',
      sourceNodeId: 'node-cube',
      partKey: 'cube',
    },
  ],
}

const requestGraphBuild = (
  dispatcher: InstanceType<(typeof import('./buildDispatcher'))['BuildDispatcher']>,
  options?: {
    graphDocumentId?: string
    buildRequestId?: string
    buildStatsPartKeys?: string[]
  },
): number =>
  dispatcher.requestGraphBuild({
    routingIdentity: {
      projectFileId: 'project-1',
      graphDocumentId: options?.graphDocumentId ?? 'graph-a',
      buildRequestId: options?.buildRequestId ?? 'request-a-1',
    },
    compiledBuildData,
    buildIdentity: {
      graphRevision: 1,
      targetBuildUnitIds: ['output-entry:s001:node-cube'],
    },
    invalidation: {
      affectedBuildUnitIds: ['output-entry:s001:node-cube'],
    },
    changedParamIds: ['sp_full'],
    buildStatsPartKeys: options?.buildStatsPartKeys ?? ['cube'],
  })

describe('BuildDispatcher runtime hooks and routing', () => {
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

  it('emits build start hooks with seeded part keys and routing metadata', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onBuildRequestStarted = vi.fn()

    dispatcher.setRuntimeHooks({
      onBuildRequestStarted,
    })

    requestGraphBuild(dispatcher, {
      buildStatsPartKeys: ['cube'],
    })

    expect(onBuildRequestStarted).toHaveBeenCalledWith({
      seq: 1,
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      },
      executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
      buildStatsPartKeys: ['cube'],
    })
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
      compiledBuildData,
      buildIdentity: {
        graphRevision: 4,
        targetBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      invalidation: {
        affectedBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      changedParamIds: ['sp_full'],
      buildStatsPartKeys: ['cube'],
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

  it('rejects wrong-graph results and keeps result hooks quiet', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onBuildResult = vi.fn()
    const onBuildResultSettled = vi.fn()

    dispatcher.setBuildResultHandler(onBuildResult)
    dispatcher.setRuntimeHooks({
      onBuildResultSettled,
    })

    requestGraphBuild(dispatcher)

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage(
      buildResult({
        seq: 1,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-b',
        buildRequestId: 'request-b-1',
      }),
    )

    expect(onBuildResult).not.toHaveBeenCalled()
    expect(onBuildResultSettled).not.toHaveBeenCalled()
    dispatcher.dispose()
  })

  it('rejects stale same-graph results after a newer request is issued', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onBuildResult = vi.fn()
    const onBuildResultSettled = vi.fn()

    dispatcher.setBuildResultHandler(onBuildResult)
    dispatcher.setRuntimeHooks({
      onBuildResultSettled,
    })

    requestGraphBuild(dispatcher)
    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-a-2',
    })

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage(
      buildResult({
        seq: 2,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      }),
    )
    worker.dispatchMessage(
      buildResult({
        seq: 1,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )

    expect(onBuildResult).toHaveBeenCalledTimes(1)
    expect(onBuildResultSettled).toHaveBeenCalledTimes(1)
    expect(onBuildResultSettled).toHaveBeenCalledWith(
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
    const onBuildResult = vi.fn()
    const onBuildResultSettled = vi.fn()

    dispatcher.setBuildResultHandler(onBuildResult)
    dispatcher.setRuntimeHooks({
      onBuildResultSettled,
    })

    requestGraphBuild(dispatcher)
    requestGraphBuild(dispatcher, {
      graphDocumentId: 'graph-b',
      buildRequestId: 'request-b-1',
    })

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage(
      buildResult({
        seq: 2,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-b',
        buildRequestId: 'request-b-1',
      }),
    )
    worker.dispatchMessage(
      buildResult({
        seq: 1,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )

    expect(onBuildResult).toHaveBeenCalledTimes(2)
    expect(onBuildResultSettled).toHaveBeenCalledTimes(2)
    expect(onBuildResultSettled).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        seq: 2,
        graphDocumentId: 'graph-b',
      }),
    )
    expect(onBuildResultSettled).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        seq: 1,
        graphDocumentId: 'graph-a',
      }),
    )
    dispatcher.dispose()
  })

  it('forwards retained geometry results on accepted build messages', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onBuildResult = vi.fn()

    dispatcher.setBuildResultHandler(onBuildResult)
    requestGraphBuild(dispatcher)

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage(
      buildResult({
        seq: 1,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
        draftGeometryResult: buildGeometryResult({
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-1',
        }),
      }),
    )

    expect(onBuildResult).toHaveBeenCalledWith(
      expect.objectContaining({
        seq: 1,
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
        draftGeometryResult: expect.objectContaining({
          request: {
            graphDocumentId: 'graph-a',
            buildRequestId: 'request-a-1',
            partKeys: ['cube'],
          },
          resultClass: 'draft',
          status: 'ok',
        }),
      }),
    )
    dispatcher.dispose()
  })

  it('releases authoritative handles for stale build results', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()

    requestGraphBuild(dispatcher)
    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-a-2',
    })

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage(
      buildResult({
        seq: 1,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
        authoritativeGeometryResult: {
          ...buildGeometryResult({
            graphDocumentId: 'graph-a',
            buildRequestId: 'request-a-1',
          }),
          resultClass: 'authoritative',
          authoritativeHandle: {
            resourceType: 'shape_set',
            handleId: 'shape-set-stale-1',
          },
        },
      }),
    )

    expect(worker.postedMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'release_authoritative_handles',
          handleIds: ['shape-set-stale-1'],
        }),
      ]),
    )
    dispatcher.dispose()
  })

  it('only forwards worker errors for accepted messages', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onWorkerError = vi.fn()
    const onRuntimeWorkerError = vi.fn()

    dispatcher.setWorkerErrorHandler(onWorkerError)
    dispatcher.setRuntimeHooks({
      onWorkerError: onRuntimeWorkerError,
    })

    requestGraphBuild(dispatcher)
    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-a-2',
    })

    const worker = (dispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage({
      type: 'worker_error',
      seq: 1,
      op: 'build',
      lane: 'build',
      message: 'stale build failed',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    })
    worker.dispatchMessage({
      type: 'worker_error',
      seq: 2,
      op: 'build',
      lane: 'build',
      message: 'active build failed',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-2',
    })

    expect(onWorkerError).toHaveBeenCalledTimes(1)
    expect(onRuntimeWorkerError).toHaveBeenCalledTimes(1)
    expect(onRuntimeWorkerError).toHaveBeenCalledWith(
      expect.objectContaining({
        seq: 2,
        message: 'active build failed',
      }),
    )
    dispatcher.dispose()
  })
})
