import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

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

  it('publishes param and selection lines from useAppStore', async () => {
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.getState().setBoxParam('width', 24)
    useAppStore.getState().selectPart('baseplate')

    const entries = useConsoleStore.getState().entries
    expect(entries.some((entry) => entry.layer === 'Params' && entry.text === 'width = 24')).toBe(true)
    expect(
      entries.some((entry) => entry.layer === 'Selection' && entry.text === 'Selected baseplate'),
    ).toBe(true)
  })

  it('publishes build lifecycle worker lines from BuildDispatcher', async () => {
    const module = await import('../buildDispatcher')
    module.buildDispatcher.dispose()
    const dispatcher = new module.BuildDispatcher()

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
      seq: 1,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      parts: [],
      changedParamIds: [],
    })

    const entries = useConsoleStore.getState().entries
    expect(entries.some((entry) => entry.text === 'Build started (graph-a)')).toBe(true)
    expect(entries.some((entry) => entry.text === 'Build complete (graph-a)')).toBe(true)

    dispatcher.dispose()
  })
})
