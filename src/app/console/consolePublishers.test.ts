import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../../shared/buildTypes'
import { emitArtifacts } from '../../worker/pipeline/artifactEmitter'

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

describe('console publishers', () => {
  const originalWorker = globalThis.Worker
  let useConsoleStore: typeof import('./useConsoleStore').useConsoleStore

  beforeEach(async () => {
    vi.resetModules()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ useConsoleStore } = await import('./useConsoleStore'))
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
  })

  afterEach(async () => {
    try {
      const { buildDispatcher } = await import('../buildDispatcher')
      buildDispatcher.dispose()
    } catch {
      // ignore partial module cleanup
    }
    globalThis.Worker = originalWorker
  })

  it('publishes selection lines from useAppStore', async () => {
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.getState().selectPart('baseplate')

    const entries = useConsoleStore.getState().entries
    expect(
      entries.some((entry) => entry.layer === 'Selection' && entry.text === 'Selected baseplate'),
    ).toBe(true)
  })

  it('publishes build lifecycle worker lines from BuildDispatcher', async () => {
    const { bootstrapBuildWiring } = await import('../bootstrapBuildWiring')
    const { buildDispatcher } = await import('../buildDispatcher')
    bootstrapBuildWiring()
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)

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
    worker.dispatchMessage(
      buildResult({
        seq,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )

    const entries = useConsoleStore.getState().entries
    expect(entries.some((entry) => entry.text === 'Build started (graph-a)')).toBe(true)
    expect(entries.some((entry) => entry.text === 'Build complete (graph-a)')).toBe(true)
    expect(
      entries.some((entry) => entry.text === 'Build summary (final): rebuilt 0, retained 0, evicted 0'),
    ).toBe(true)
  })
})
