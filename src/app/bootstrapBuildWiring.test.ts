import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../shared/buildTypes'
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
}) =>
  emitArtifacts(
    {
      seq: options.seq,
      projectFileId: options.projectFileId,
      graphDocumentId: options.graphDocumentId,
      buildRequestId: options.buildRequestId,
      executionIntent: DEFAULT_BUILD_EXECUTION_INTENT,
    },
    [],
    [],
  )

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

type BuildStatsStore = typeof import('./store/buildStatsStore').useBuildStatsStore
type ConsoleStore = typeof import('./console/useConsoleStore').useConsoleStore

const resetBuildStatsStore = (useBuildStatsStore: BuildStatsStore): void => {
  useBuildStatsStore.setState({
    activeSeq: null,
    overallState: 'idle',
    partOrder: [],
    partStatsByKey: {},
    pulseNonce: 0,
    pulseKind: null,
  })
}

const resetStores = (
  useBuildStatsStore: BuildStatsStore,
  useConsoleStore: ConsoleStore,
): void => {
  resetBuildStatsStore(useBuildStatsStore)
  useConsoleStore.setState(useConsoleStore.getInitialState(), true)
}

describe('bootstrapBuildWiring runtime hooks', () => {
  const originalWorker = globalThis.Worker

  beforeEach(() => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
  })

  afterEach(async () => {
    try {
      const { buildDispatcher } = await import('./buildDispatcher')
      buildDispatcher.dispose()
    } catch {
      // Ignore partial module cleanup.
    }
    globalThis.Worker = originalWorker
  })

  it('bridges build start, progress, and result into build stats and console state', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore)

    const seq = buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
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
      buildStatsPartKeys: ['cube'],
    })

    expect(seq).toBe(1)
    expect(useBuildStatsStore.getState().activeSeq).toBe(seq)
    expect(useBuildStatsStore.getState().overallState).toBe('building')
    expect(useBuildStatsStore.getState().partOrder).toEqual(['cube'])
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Build started (graph-a)'),
    ).toBe(true)

    const worker = (buildDispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage({
      type: 'build_progress',
      seq,
      lane: 'build',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      phase: 'parts',
      partKey: 'cube',
      state: 'building',
      progress01: 0.5,
    })

    expect(useBuildStatsStore.getState().partStatsByKey.cube).toEqual(
      expect.objectContaining({
        state: 'building',
        progress01: 0.5,
      }),
    )
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'cube: building')).toBe(
      true,
    )

    worker.dispatchMessage(
      buildResult({
        seq,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )

    expect(useBuildStatsStore.getState().overallState).toBe('idle')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Build complete (graph-a)'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Build summary (final): rebuilt 0, retained 0, evicted 0',
      ),
    ).toBe(true)
  })

  it('bridges accepted worker errors into error state and diagnostics transcript entries', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore)

    const seq = buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
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
      buildStatsPartKeys: ['cube'],
    })

    const worker = (buildDispatcher as unknown as { worker: MockWorker }).worker
    worker.dispatchMessage({
      type: 'worker_error',
      seq,
      op: 'build',
      lane: 'build',
      message: 'Build failed',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    })

    expect(useBuildStatsStore.getState().overallState).toBe('error')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.layer === 'Diagnostics' && entry.text === 'Build failed',
      ),
    ).toBe(true)
  })
})
