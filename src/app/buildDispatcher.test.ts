import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
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

  public terminate(): void {}
}

const resetBuildStatsStore = (
  useBuildStatsStore: typeof import('./store/buildStatsStore').useBuildStatsStore,
): void => {
  useBuildStatsStore.setState({
    statsExpanded: false,
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
    dispatcher.dispose()
  })
})
