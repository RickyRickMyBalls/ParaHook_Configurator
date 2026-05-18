import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  DEFAULT_BUILD_EXECUTION_INTENT,
  type BuildChangedInputHint,
  type BuildExecutionIntent,
} from '../shared/buildTypes'
import { createAuthoritativeExportInput } from '../shared/exportTypes'
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

const getDraftWorker = (
  dispatcher: InstanceType<(typeof import('./buildDispatcher'))['BuildDispatcher']>,
): MockWorker =>
  (dispatcher as unknown as { draftWorker: MockWorker }).draftWorker

const getAuthoritativeWorker = (
  dispatcher: InstanceType<(typeof import('./buildDispatcher'))['BuildDispatcher']>,
): MockWorker =>
  (dispatcher as unknown as { authoritativeWorker: MockWorker }).authoritativeWorker

const buildResult = (options: {
  buildRequestId: string
  graphDocumentId: string
  projectFileId: string
  seq: number
  draftGeometryResult?: GeometryResultBundle
  authoritativeGeometryResult?: GeometryResultBundle
  executionIntent?: BuildExecutionIntent
}) =>
  emitArtifacts(
    {
      seq: options.seq,
      projectFileId: options.projectFileId,
      graphDocumentId: options.graphDocumentId,
      buildRequestId: options.buildRequestId,
      executionIntent: options.executionIntent ?? DEFAULT_BUILD_EXECUTION_INTENT,
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
  topologyPreview: null,
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
    changedInputHint?: BuildChangedInputHint
    executionIntent?: BuildExecutionIntent
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
    ...(options?.changedInputHint === undefined
      ? {}
      : { changedInputHint: options.changedInputHint }),
    buildStatsPartKeys: options?.buildStatsPartKeys ?? ['cube'],
    executionIntent: options?.executionIntent,
  })

const exportInput = createAuthoritativeExportInput({
  request: {
    graphDocumentId: 'graph-a',
    buildRequestId: 'request-a-1',
    partKeys: ['cube'],
  },
  authoritativeHandle: {
    resourceType: 'shape_set',
    handleId: 'shape-set-1',
  },
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

    expect(getAuthoritativeWorker(dispatcher).postedMessages[0]).toEqual(
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

  it('forwards Worker 9 Phase 1 changed-input hints into the worker build request', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()

    requestGraphBuild(dispatcher, {
      changedInputHint: {
        kind: 'graph_local_extrude_params',
        changedNodeId: 'node-extrude-2',
        changedPartKey: 'extrude#2',
        changedFields: ['depthResolved'],
      },
    })

    expect(getAuthoritativeWorker(dispatcher).postedMessages[0]).toEqual(
      expect.objectContaining({
        changedInputHint: {
          kind: 'graph_local_extrude_params',
          changedNodeId: 'node-extrude-2',
          changedPartKey: 'extrude#2',
          changedFields: ['depthResolved'],
        },
      }),
    )
    dispatcher.dispose()
  })

  it('exposes explicit latest-request snapshots per graph target without changing execution behavior', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()

    expect(
      dispatcher.getLatestBuildRequestSnapshot({
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
      }),
    ).toBeNull()

    requestGraphBuild(dispatcher)

    expect(
      dispatcher.getLatestBuildRequestSnapshot({
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
      }),
    ).toEqual({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      latestRequestedSeq: 1,
      latestRequestedBuildRequestId: 'request-a-1',
      latestResolvedSeq: 0,
    })

    dispatcher.dispose()
  })

  it('keeps latest-request snapshots isolated per routing target', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()

    requestGraphBuild(dispatcher)
    requestGraphBuild(dispatcher, {
      graphDocumentId: 'graph-b',
      buildRequestId: 'request-b-1',
    })
    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-a-2',
    })

    expect(
      dispatcher.getLatestBuildRequestSnapshot({
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
      }),
    ).toEqual({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      latestRequestedSeq: 3,
      latestRequestedBuildRequestId: 'request-a-2',
      latestResolvedSeq: 0,
    })
    expect(
      dispatcher.getLatestBuildRequestSnapshot({
        projectFileId: 'project-1',
        graphDocumentId: 'graph-b',
      }),
    ).toEqual({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-b',
      latestRequestedSeq: 2,
      latestRequestedBuildRequestId: 'request-b-1',
      latestResolvedSeq: 0,
    })

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

    getAuthoritativeWorker(dispatcher).dispatchMessage(
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

    getAuthoritativeWorker(dispatcher).dispatchMessage(
      buildResult({
        seq: 2,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      }),
    )
    getAuthoritativeWorker(dispatcher).dispatchMessage(
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

  it('forwards explicit superseded runtime events for obsolete same-graph requests', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onBuildSuperseded = vi.fn()
    const onBuildResultSettled = vi.fn()

    dispatcher.setRuntimeHooks({
      onBuildSuperseded,
      onBuildResultSettled,
    })

    requestGraphBuild(dispatcher)
    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-a-2',
    })

    getAuthoritativeWorker(dispatcher).dispatchMessage({
      type: 'build_superseded',
      lane: 'build',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    })
    getAuthoritativeWorker(dispatcher).dispatchMessage(
      buildResult({
        seq: 2,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      }),
    )

    expect(onBuildSuperseded).toHaveBeenCalledTimes(1)
    expect(onBuildSuperseded).toHaveBeenCalledWith({
      type: 'build_superseded',
      lane: 'build',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    })
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

    getAuthoritativeWorker(dispatcher).dispatchMessage(
      buildResult({
        seq: 2,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-b',
        buildRequestId: 'request-b-1',
      }),
    )
    getAuthoritativeWorker(dispatcher).dispatchMessage(
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

    getAuthoritativeWorker(dispatcher).dispatchMessage(
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

    getAuthoritativeWorker(dispatcher).dispatchMessage(
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

    expect(getAuthoritativeWorker(dispatcher).postedMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'release_authoritative_handles',
          handleIds: ['shape-set-stale-1'],
        }),
      ]),
    )
    expect(getDraftWorker(dispatcher).postedMessages).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'release_authoritative_handles',
        }),
      ]),
    )
    dispatcher.dispose()
  })

  it('keeps draft and authoritative supersession isolated per graph target', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onBuildResult = vi.fn()

    dispatcher.setBuildResultHandler(onBuildResult)

    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-draft-1',
      executionIntent: {
        ...DEFAULT_BUILD_EXECUTION_INTENT,
        geometryTarget: 'draft_preview',
        quality: 'draft',
        outputIntent: 'transient_preview',
      },
    })
    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-auth-1',
      executionIntent: {
        ...DEFAULT_BUILD_EXECUTION_INTENT,
        geometryTarget: 'authoritative',
      },
    })
    requestGraphBuild(dispatcher, {
      buildRequestId: 'request-draft-2',
      executionIntent: {
        ...DEFAULT_BUILD_EXECUTION_INTENT,
        geometryTarget: 'draft_preview',
        quality: 'draft',
        outputIntent: 'transient_preview',
      },
    })

    getAuthoritativeWorker(dispatcher).dispatchMessage(
      buildResult({
        seq: 2,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-auth-1',
        executionIntent: {
          ...DEFAULT_BUILD_EXECUTION_INTENT,
          geometryTarget: 'authoritative',
        },
      }),
    )
    getDraftWorker(dispatcher).dispatchMessage(
      buildResult({
        seq: 1,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-draft-1',
        executionIntent: {
          ...DEFAULT_BUILD_EXECUTION_INTENT,
          geometryTarget: 'draft_preview',
          quality: 'draft',
          outputIntent: 'transient_preview',
        },
      }),
    )
    getDraftWorker(dispatcher).dispatchMessage(
      buildResult({
        seq: 3,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-draft-2',
        executionIntent: {
          ...DEFAULT_BUILD_EXECUTION_INTENT,
          geometryTarget: 'draft_preview',
          quality: 'draft',
          outputIntent: 'transient_preview',
        },
      }),
    )

    expect(onBuildResult).toHaveBeenCalledTimes(2)
    expect(onBuildResult).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        seq: 2,
        buildRequestId: 'request-auth-1',
      }),
    )
    expect(onBuildResult).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        seq: 3,
        buildRequestId: 'request-draft-2',
      }),
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

    getAuthoritativeWorker(dispatcher).dispatchMessage({
      type: 'worker_error',
      seq: 1,
      op: 'build',
      lane: 'build',
      message: 'stale build failed',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    })
    getAuthoritativeWorker(dispatcher).dispatchMessage({
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

  it('posts authoritative-worker export requests with retained B-rep input', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onExportRequestStarted = vi.fn()

    dispatcher.setRuntimeHooks({
      onExportRequestStarted,
    })

    const seq = dispatcher.requestGraphExport({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-1',
      format: 'step',
      input: exportInput,
    })

    expect(seq).toBe(1)
    expect(getAuthoritativeWorker(dispatcher).postedMessages[0]).toEqual({
      type: 'export',
      lane: 'export',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      schemaVersion: 1,
      requestId: 'export-request-1',
      format: 'step',
      input: exportInput,
    })
    expect(getDraftWorker(dispatcher).postedMessages).toEqual([])
    expect(onExportRequestStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'export',
        lane: 'export',
        requestId: 'export-request-1',
      }),
    )
    dispatcher.dispose()
  })

  it('forwards accepted export results through export handlers', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onExportResult = vi.fn()
    const onExportResultSettled = vi.fn()

    dispatcher.setExportResultHandler(onExportResult)
    dispatcher.setRuntimeHooks({
      onExportResultSettled,
    })

    dispatcher.requestGraphExport({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-1',
      format: 'step',
      input: exportInput,
    })

    const result = {
      type: 'export_result',
      lane: 'export',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-1',
      format: 'step',
      filename: 'parahook-request-a-1.step',
      dataBase64: btoa('ISO-10303-21;'),
    } as const
    getAuthoritativeWorker(dispatcher).dispatchMessage(result)

    expect(onExportResult).toHaveBeenCalledWith(result)
    expect(onExportResultSettled).toHaveBeenCalledWith(result)
    dispatcher.dispose()
  })

  it('ignores stale export results after a newer same-graph export request', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onExportResult = vi.fn()

    dispatcher.setExportResultHandler(onExportResult)

    dispatcher.requestGraphExport({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-1',
      format: 'step',
      input: exportInput,
    })
    dispatcher.requestGraphExport({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-2',
      format: 'step',
      input: exportInput,
    })

    getAuthoritativeWorker(dispatcher).dispatchMessage({
      type: 'export_result',
      lane: 'export',
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-1',
      format: 'step',
      filename: 'stale.step',
      dataBase64: btoa('stale'),
    })
    getAuthoritativeWorker(dispatcher).dispatchMessage({
      type: 'export_result',
      lane: 'export',
      seq: 2,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-2',
      format: 'step',
      filename: 'fresh.step',
      dataBase64: btoa('fresh'),
    })

    expect(onExportResult).toHaveBeenCalledTimes(1)
    expect(onExportResult).toHaveBeenCalledWith(
      expect.objectContaining({
        seq: 2,
        filename: 'fresh.step',
      }),
    )
    dispatcher.dispose()
  })

  it('forwards export worker errors without treating them as build settlement', async () => {
    const module = await import('./buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()
    const onWorkerError = vi.fn()
    const onExportError = vi.fn()
    const onBuildResultSettled = vi.fn()

    dispatcher.setWorkerErrorHandler(onWorkerError)
    dispatcher.setRuntimeHooks({
      onExportError,
      onBuildResultSettled,
    })

    dispatcher.requestGraphExport({
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-1',
      format: 'step',
      input: exportInput,
    })
    getAuthoritativeWorker(dispatcher).dispatchMessage({
      type: 'worker_error',
      seq: 1,
      op: 'export',
      lane: 'export',
      message: 'STEP writer transfer failed.',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      requestId: 'export-request-1',
    })

    expect(onWorkerError).toHaveBeenCalledWith(
      expect.objectContaining({
        op: 'export',
        message: 'STEP writer transfer failed.',
      }),
    )
    expect(onExportError).toHaveBeenCalledWith(
      expect.objectContaining({
        op: 'export',
        requestId: 'export-request-1',
      }),
    )
    expect(onBuildResultSettled).not.toHaveBeenCalled()
    dispatcher.dispose()
  })
})
