import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type {
  BuildSuperseded,
  BuildRequest,
  BuildResult,
  WorkerError,
  BuildProgress,
} from '../shared/buildTypes'
import {
  createAuthoritativeExportInput,
  type ExportWorkerResult,
} from '../shared/exportTypes'

type WorkerMessageHandler = (event: MessageEvent<unknown>) => void | Promise<void>

class MockWorkerScope {
  public readonly postedMessages: Array<
    BuildResult | WorkerError | BuildProgress | BuildSuperseded | ExportWorkerResult
  > = []
  private readonly handlers = new Set<WorkerMessageHandler>()

  public postMessage(
    message: BuildResult | WorkerError | BuildProgress | BuildSuperseded | ExportWorkerResult,
  ): void {
    this.postedMessages.push(message)
  }

  public addEventListener(
    type: 'message',
    listener: (event: MessageEvent<unknown>) => void | Promise<void>,
  ): void {
    if (type !== 'message') {
      return
    }
    this.handlers.add(listener)
  }

  public dispatchMessage(message: unknown): Promise<void> {
    return Promise.all(
      [...this.handlers].map((handler) => handler({ data: message } as MessageEvent<unknown>)),
    ).then(() => {})
  }
}

const buildRequest = (options: {
  seq: number
  graphDocumentId: string
  buildRequestId: string
}): BuildRequest => ({
  type: 'build',
  lane: 'build',
  seq: options.seq,
  projectFileId: 'project-1',
  graphDocumentId: options.graphDocumentId,
  buildRequestId: options.buildRequestId,
  executionIntent: {
    buildMode: 'final',
    quality: 'full',
    updatePolicy: 'auto',
    draftPolicy: 'live',
    authoritativePolicy: 'explicit',
    outputIntent: 'accepted_final',
    geometryTarget: 'authoritative',
  },
  compiledBuildData: {
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
    outputEntries: [],
  },
  buildIdentity: {
    graphRevision: options.seq,
    targetBuildUnitIds: ['build-unit:cube'],
  },
  invalidation: {
    affectedBuildUnitIds: ['build-unit:cube'],
  },
  changedParamIds: ['sp_full'],
})

describe('worker cooperative supersession', () => {
  const originalSelf = globalThis.self

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    globalThis.self = originalSelf
  })

  it('suppresses obsolete same-graph results when a newer request supersedes the active build', async () => {
    const workerScope = new MockWorkerScope()
    globalThis.self = workerScope as unknown as typeof globalThis.self
    let resolveFirstBuild: (() => void) | null = null

    vi.doMock('./pipeline/buildPipeline', () => {
      class BuildSupersededError extends Error {
        public constructor() {
          super('superseded')
          this.name = 'BuildSupersededError'
        }
      }

      return {
        BuildSupersededError,
        isBuildSupersededError: (error: unknown): error is Error =>
          error instanceof BuildSupersededError,
        buildPipeline: vi.fn(
          async (
            request: BuildRequest,
            _emitProgress: unknown,
            options?: { isSuperseded?: () => boolean },
          ) => {
            if (request.buildRequestId === 'request-a-1') {
              await new Promise<void>((resolve) => {
                resolveFirstBuild = resolve
              })
              if (options?.isSuperseded?.() === true) {
                throw new BuildSupersededError()
              }
            }

            return {
              type: 'build_result',
              lane: 'build',
              seq: request.seq,
              projectFileId: request.projectFileId,
              graphDocumentId: request.graphDocumentId,
              buildRequestId: request.buildRequestId,
              bundle: {
                buildRequestId: request.buildRequestId,
                graphDocumentId: request.graphDocumentId,
                seq: request.seq,
                resultClass: 'final',
                executionIntent: request.executionIntent,
                summary: {
                  rebuiltCount: 0,
                  retainedCount: 0,
                  evictedCount: 0,
                },
                entries: [],
              },
            } satisfies BuildResult
          },
        ),
      }
    })
    vi.doMock('./authoritativeGeometryStore', () => ({
      releaseAuthoritativeShapeSets: vi.fn(),
    }))

    await import('./worker')

    const firstDispatch = workerScope.dispatchMessage(
      buildRequest({
        seq: 1,
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )
    await Promise.resolve()
    await workerScope.dispatchMessage(
      buildRequest({
        seq: 2,
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      }),
    )
    const finishFirstBuild = resolveFirstBuild as (() => void) | null
    if (finishFirstBuild !== null) {
      finishFirstBuild()
    }
    await firstDispatch

    expect(workerScope.postedMessages).toHaveLength(2)
    expect(workerScope.postedMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'build_superseded',
          seq: 1,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-1',
        }),
        expect.objectContaining({
          type: 'build_result',
          seq: 2,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-2',
        }),
      ]),
    )
  })

  it('keeps concurrent builds isolated across graph targets', async () => {
    const workerScope = new MockWorkerScope()
    globalThis.self = workerScope as unknown as typeof globalThis.self
    let resolveFirstBuild: (() => void) | null = null

    vi.doMock('./pipeline/buildPipeline', () => {
      class BuildSupersededError extends Error {
        public constructor() {
          super('superseded')
          this.name = 'BuildSupersededError'
        }
      }

      return {
        BuildSupersededError,
        isBuildSupersededError: (error: unknown): error is Error =>
          error instanceof BuildSupersededError,
        buildPipeline: vi.fn(
          async (
            request: BuildRequest,
            _emitProgress: unknown,
            options?: { isSuperseded?: () => boolean },
          ) => {
            if (request.buildRequestId === 'request-a-1') {
              await new Promise<void>((resolve) => {
                resolveFirstBuild = resolve
              })
            }
            if (options?.isSuperseded?.() === true) {
              throw new BuildSupersededError()
            }
            return {
              type: 'build_result',
              lane: 'build',
              seq: request.seq,
              projectFileId: request.projectFileId,
              graphDocumentId: request.graphDocumentId,
              buildRequestId: request.buildRequestId,
              bundle: {
                buildRequestId: request.buildRequestId,
                graphDocumentId: request.graphDocumentId,
                seq: request.seq,
                resultClass: 'final',
                executionIntent: request.executionIntent,
                summary: {
                  rebuiltCount: 0,
                  retainedCount: 0,
                  evictedCount: 0,
                },
                entries: [],
              },
            } satisfies BuildResult
          },
        ),
      }
    })
    vi.doMock('./authoritativeGeometryStore', () => ({
      releaseAuthoritativeShapeSets: vi.fn(),
    }))

    await import('./worker')

    const firstDispatch = workerScope.dispatchMessage(
      buildRequest({
        seq: 1,
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )
    await Promise.resolve()
    await workerScope.dispatchMessage(
      buildRequest({
        seq: 2,
        graphDocumentId: 'graph-b',
        buildRequestId: 'request-b-1',
      }),
    )
    const finishFirstBuild = resolveFirstBuild as (() => void) | null
    if (finishFirstBuild !== null) {
      finishFirstBuild()
    }
    await firstDispatch

    expect(workerScope.postedMessages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'build_result',
          seq: 1,
          graphDocumentId: 'graph-a',
          buildRequestId: 'request-a-1',
        }),
        expect.objectContaining({
          type: 'build_result',
          seq: 2,
          graphDocumentId: 'graph-b',
          buildRequestId: 'request-b-1',
        }),
      ]),
    )
  })

  it('rejects invalid changed-input hints before the worker pipeline starts', async () => {
    const workerScope = new MockWorkerScope()
    globalThis.self = workerScope as unknown as typeof globalThis.self
    const buildPipeline = vi.fn()

    vi.doMock('./pipeline/buildPipeline', () => {
      class BuildSupersededError extends Error {
        public constructor() {
          super('superseded')
          this.name = 'BuildSupersededError'
        }
      }

      return {
        BuildSupersededError,
        isBuildSupersededError: (error: unknown): error is Error =>
          error instanceof BuildSupersededError,
        buildPipeline,
      }
    })
    vi.doMock('./authoritativeGeometryStore', () => ({
      releaseAuthoritativeShapeSets: vi.fn(),
    }))

    await import('./worker')

    await workerScope.dispatchMessage({
      ...buildRequest({
        seq: 1,
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
      changedInputHint: {
        kind: 'graph_local_extrude_params',
        changedNodeId: 'node-extrude-2',
        changedPartKey: 'extrude#2',
        changedFields: ['sp_featureStackIR'],
      },
    })

    expect(buildPipeline).not.toHaveBeenCalled()
    expect(workerScope.postedMessages).toEqual([])
  })
})

describe('worker export routing', () => {
  const originalSelf = globalThis.self

  beforeEach(() => {
    vi.resetModules()
  })

  afterEach(() => {
    globalThis.self = originalSelf
  })

  it('routes export requests through the worker export service', async () => {
    const workerScope = new MockWorkerScope()
    globalThis.self = workerScope as unknown as typeof globalThis.self
    const exportService = vi.fn().mockResolvedValue({
      requestId: 'export-request-1',
      format: 'step',
      filename: 'parahook-build-request-1.step',
      dataBase64: btoa('ISO-10303-21;'),
    })

    vi.doMock('./pipeline/exportService', () => ({
      exportService,
    }))
    vi.doMock('./pipeline/buildPipeline', () => ({
      BuildSupersededError: class BuildSupersededError extends Error {},
      isBuildSupersededError: (error: unknown): error is Error => error instanceof Error,
      buildPipeline: vi.fn(),
    }))
    vi.doMock('./authoritativeGeometryStore', () => ({
      releaseAuthoritativeShapeSets: vi.fn(),
    }))

    await import('./worker')
    const input = createAuthoritativeExportInput({
      request: {
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        partKeys: ['part-a'],
      },
      authoritativeHandle: {
        resourceType: 'shape_set',
        handleId: 'shape-set-1',
      },
    })
    await workerScope.dispatchMessage({
      type: 'export',
      lane: 'export',
      seq: 7,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-1',
      schemaVersion: 1,
      requestId: 'export-request-1',
      format: 'step',
      input,
    })

    expect(exportService).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'export',
        requestId: 'export-request-1',
        input,
      }),
    )
    expect(workerScope.postedMessages).toEqual([
      {
        type: 'export_result',
        lane: 'export',
        seq: 7,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        requestId: 'export-request-1',
        format: 'step',
        filename: 'parahook-build-request-1.step',
        dataBase64: btoa('ISO-10303-21;'),
      },
    ])
  })

  it('posts export worker errors when export writing fails', async () => {
    const workerScope = new MockWorkerScope()
    globalThis.self = workerScope as unknown as typeof globalThis.self
    const exportService = vi.fn().mockRejectedValue(new Error('STEP writer transfer failed.'))

    vi.doMock('./pipeline/exportService', () => ({
      exportService,
    }))
    vi.doMock('./pipeline/buildPipeline', () => ({
      BuildSupersededError: class BuildSupersededError extends Error {},
      isBuildSupersededError: (error: unknown): error is Error => error instanceof Error,
      buildPipeline: vi.fn(),
    }))
    vi.doMock('./authoritativeGeometryStore', () => ({
      releaseAuthoritativeShapeSets: vi.fn(),
    }))

    await import('./worker')
    await workerScope.dispatchMessage({
      type: 'export',
      lane: 'export',
      seq: 8,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-document-1',
      buildRequestId: 'build-request-1',
      schemaVersion: 1,
      requestId: 'export-request-1',
      format: 'step',
      input: createAuthoritativeExportInput({
        request: {
          graphDocumentId: 'graph-document-1',
          buildRequestId: 'build-request-1',
          partKeys: ['part-a'],
        },
        authoritativeHandle: {
          resourceType: 'shape_set',
          handleId: 'shape-set-1',
        },
      }),
    })

    expect(workerScope.postedMessages).toEqual([
      {
        type: 'worker_error',
        seq: 8,
        op: 'export',
        lane: 'export',
        message: 'STEP writer transfer failed.',
        projectFileId: 'project-1',
        graphDocumentId: 'graph-document-1',
        buildRequestId: 'build-request-1',
        requestId: 'export-request-1',
      },
    ])
  })
})
