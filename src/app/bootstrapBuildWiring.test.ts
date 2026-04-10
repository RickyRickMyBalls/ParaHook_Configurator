import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_BUILD_EXECUTION_INTENT } from '../shared/buildTypes'
import { emitArtifacts } from '../worker/pipeline/artifactEmitter'
import { RUNTIME_INSPECTOR_ARCHIVE_LIMIT } from './store/runtimeInspectorTaskStore'

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
type RuntimeInspectorTaskStore = typeof import('./store/runtimeInspectorTaskStore').useRuntimeInspectorTaskStore

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
  useRuntimeInspectorTaskStore: RuntimeInspectorTaskStore,
): void => {
  resetBuildStatsStore(useBuildStatsStore)
  useConsoleStore.setState(useConsoleStore.getInitialState(), true)
  useRuntimeInspectorTaskStore.setState({
    activeQueue: [],
    archive: [],
  })
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
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)

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
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        seq,
        graphDocumentId: 'graph-a',
        partKey: null,
        label: 'Build graph-a',
        status: 'Starting',
        state: 'queued',
      }),
    ])
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
      state: 'queued',
    })

    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        seq,
        graphDocumentId: 'graph-a',
        partKey: 'cube',
        label: 'Building cube',
        status: 'Queued',
        state: 'queued',
      }),
    ])

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
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        partKey: 'cube',
        label: 'Building cube',
        status: 'In Progress',
        progress01: 0.5,
        state: 'active',
      }),
    ])
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'cube: building')).toBe(
      true,
    )

    worker.dispatchMessage({
      type: 'build_progress',
      seq,
      lane: 'build',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      phase: 'parts',
      partKey: 'cube',
      state: 'done',
      progress01: 1,
      ms: 5,
    })

    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        partKey: 'cube',
        label: 'Building cube',
        status: 'Done',
        progress01: 1,
        state: 'done',
      }),
    ])

    worker.dispatchMessage(
      buildResult({
        seq,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )

    expect(useBuildStatsStore.getState().overallState).toBe('idle')
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        partKey: 'cube',
        state: 'done',
      }),
    ])
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Build complete (graph-a)'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Build summary (final): rebuilt 0, retained 0, evicted 0',
      ),
    ).toBe(true)
  })

  it('archives cache hits as reused work instead of leaving them in the active queue', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)

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
      type: 'build_progress',
      seq,
      lane: 'build',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      phase: 'parts',
      partKey: 'cube',
      state: 'queued',
    })
    worker.dispatchMessage({
      type: 'build_progress',
      seq,
      lane: 'build',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      phase: 'parts',
      partKey: 'cube',
      state: 'cache_hit',
      progress01: 1,
      ms: 0,
    })

    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        partKey: 'cube',
        status: 'Cache Hit',
        progress01: 1,
        state: 'reused',
      }),
    ])
  })

  it('bridges accepted worker errors into error archive state and diagnostics transcript entries', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)

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
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        graphDocumentId: 'graph-a',
        partKey: null,
        label: 'Build graph-a',
        status: 'Failed',
        detail: 'Build failed',
        state: 'error',
      }),
    ])
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.layer === 'Diagnostics' && entry.text === 'Build failed',
      ),
    ).toBe(true)
  })

  it('archives superseded work distinctly and clears only the superseded build queue state', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)

    const firstSeq = buildDispatcher.requestGraphBuild({
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

    const secondSeq = buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      },
      compiledBuildData,
      buildIdentity: {
        graphRevision: 2,
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
      type: 'build_superseded',
      lane: 'build',
      seq: firstSeq,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    })

    expect(useBuildStatsStore.getState().activeSeq).toBe(secondSeq)
    expect(useBuildStatsStore.getState().overallState).toBe('building')
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        seq: secondSeq,
        buildRequestId: 'request-a-2',
        partKey: null,
        state: 'queued',
      }),
    ])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        seq: firstSeq,
        buildRequestId: 'request-a-1',
        partKey: null,
        label: 'Build graph-a',
        status: 'Superseded',
        state: 'superseded',
      }),
    ])
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text.includes('Superseded')),
    ).toBe(false)
  })

  it('deduplicates repeated superseded cleanup for the same build identity', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)

    const firstSeq = buildDispatcher.requestGraphBuild({
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

    buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      },
      compiledBuildData,
      buildIdentity: {
        graphRevision: 2,
        targetBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      invalidation: {
        affectedBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      changedParamIds: ['sp_full'],
      buildStatsPartKeys: ['cube'],
    })

    const worker = (buildDispatcher as unknown as { worker: MockWorker }).worker
    const supersededMessage = {
      type: 'build_superseded',
      lane: 'build',
      seq: firstSeq,
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    } as const
    worker.dispatchMessage(supersededMessage)
    worker.dispatchMessage(supersededMessage)

    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        seq: firstSeq,
        buildRequestId: 'request-a-1',
        state: 'superseded',
      }),
    ])
  })

  it('replaces prior queue and archive truth when a newer accepted build starts and ignores stale lifecycle traffic', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)

    const firstSeq = buildDispatcher.requestGraphBuild({
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
      type: 'build_progress',
      seq: firstSeq,
      lane: 'build',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      phase: 'parts',
      partKey: 'cube',
      state: 'done',
      progress01: 1,
      ms: 5,
    })

    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        seq: firstSeq,
        buildRequestId: 'request-a-1',
        partKey: 'cube',
        state: 'done',
      }),
    ])

    const secondSeq = buildDispatcher.requestGraphBuild({
      routingIdentity: {
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-2',
      },
      compiledBuildData,
      buildIdentity: {
        graphRevision: 2,
        targetBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      invalidation: {
        affectedBuildUnitIds: ['output-entry:s001:node-cube'],
      },
      changedParamIds: ['sp_full'],
      buildStatsPartKeys: ['cube'],
    })

    expect(secondSeq).toBeGreaterThan(firstSeq)
    expect(useBuildStatsStore.getState().activeSeq).toBe(secondSeq)
    expect(useBuildStatsStore.getState().overallState).toBe('building')
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        seq: secondSeq,
        buildRequestId: 'request-a-2',
        partKey: null,
        label: 'Build graph-a',
        status: 'Starting',
        state: 'queued',
      }),
    ])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([])

    worker.dispatchMessage({
      type: 'build_progress',
      seq: firstSeq,
      lane: 'build',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
      phase: 'parts',
      partKey: 'stale-cube',
      state: 'error',
      message: 'Old build failed',
    })
    worker.dispatchMessage({
      type: 'worker_error',
      seq: firstSeq,
      op: 'build',
      lane: 'build',
      message: 'Old build crashed',
      projectFileId: 'project-1',
      graphDocumentId: 'graph-a',
      buildRequestId: 'request-a-1',
    })
    worker.dispatchMessage(
      buildResult({
        seq: firstSeq,
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
      }),
    )

    expect(useBuildStatsStore.getState().activeSeq).toBe(secondSeq)
    expect(useBuildStatsStore.getState().overallState).toBe('building')
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        seq: secondSeq,
        buildRequestId: 'request-a-2',
        partKey: null,
        state: 'queued',
      }),
    ])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([])
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Build complete (graph-a)'),
    ).toBe(false)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Old build crashed'),
    ).toBe(false)
  })

  it('keeps only the most recent bounded archive window when many tasks resolve', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { buildDispatcher } = await import('./buildDispatcher')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)

    const resolvedPartKeys = Array.from(
      { length: RUNTIME_INSPECTOR_ARCHIVE_LIMIT + 1 },
      (_, index) => `part-${index + 1}`,
    )

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
      buildStatsPartKeys: resolvedPartKeys,
    })

    const worker = (buildDispatcher as unknown as { worker: MockWorker }).worker
    for (const partKey of resolvedPartKeys) {
      worker.dispatchMessage({
        type: 'build_progress',
        seq,
        lane: 'build',
        projectFileId: 'project-1',
        graphDocumentId: 'graph-a',
        buildRequestId: 'request-a-1',
        phase: 'parts',
        partKey,
        state: 'done',
        progress01: 1,
        ms: 1,
      })
    }

    const archive = useRuntimeInspectorTaskStore.getState().archive
    expect(archive).toHaveLength(RUNTIME_INSPECTOR_ARCHIVE_LIMIT)
    expect(archive.map((entry) => entry.partKey)).toEqual(
      resolvedPartKeys.slice(1).reverse(),
    )
    expect(archive.some((entry) => entry.partKey === resolvedPartKeys[0])).toBe(false)
  })

  it('publishes delayed and replaced draft scheduling truth without fake worker lifecycle', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')
    const { useAppStore } = await import('./store/useAppStore')
    const { useSpaghettiStore } = await import('./spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('./workspace/useWorkspaceStore')
    const { createPublishedCubeGraph } = await import('./spaghetti/dev/sampleGraph')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)

    const graphDocumentId = useSpaghettiStore
      .getState()
      .createGraphDocument(createPublishedCubeGraph(), 'Delayed Graph')
    useSpaghettiStore.getState().openGraphDocumentInViewport(graphDocumentId)
    useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'draft')

    useAppStore.getState().requestGraphDocumentBuild(graphDocumentId, {
      browserExecutionPolicy: 'release',
    })

    expect(useBuildStatsStore.getState().overallState).toBe('idle')
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        graphDocumentId,
        label: `Draft ${graphDocumentId}`,
        status: 'Waiting for release',
        state: 'delayed',
      }),
    ])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([])

    useAppStore.getState().requestGraphDocumentBuild(graphDocumentId, {
      draftPolicyOverride: 'settle',
      geometryTargetOverride: 'draft_preview',
    })

    expect(useBuildStatsStore.getState().overallState).toBe('idle')
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        graphDocumentId,
        status: 'Waiting to settle',
        state: 'delayed',
      }),
    ])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([])
  })

  it('archives suppressed draft truth and clears delayed queue truth when release hands off to real execution', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')
    const { useAppStore } = await import('./store/useAppStore')
    const { useSpaghettiStore } = await import('./spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('./workspace/useWorkspaceStore')
    const { createPublishedCubeGraph } = await import('./spaghetti/dev/sampleGraph')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)

    const suppressedGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createPublishedCubeGraph(), 'Suppressed Graph')
    useSpaghettiStore.getState().openGraphDocumentInViewport(suppressedGraphId)
    useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'draft')
    useAppStore.getState().setBrowserGraphBuildPolicy(suppressedGraphId, 'off')

    useAppStore.getState().requestBrowserGraphDocumentBuild(suppressedGraphId)

    expect(useBuildStatsStore.getState().overallState).toBe('idle')
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        graphDocumentId: suppressedGraphId,
        status: 'Suppressed',
        state: 'suppressed',
      }),
    ])

    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)

    const releasedGraphId = useSpaghettiStore
      .getState()
      .createGraphDocument(createPublishedCubeGraph(), 'Released Graph')
    useSpaghettiStore.getState().openGraphDocumentInViewport(releasedGraphId)
    useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'draft')

    useAppStore.getState().beginBrowserBuildInteraction(releasedGraphId)
    useAppStore.getState().requestGraphDocumentBuild(releasedGraphId, {
      browserExecutionPolicy: 'release',
    })
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        graphDocumentId: releasedGraphId,
        state: 'delayed',
      }),
    ])

    useAppStore.getState().endBrowserBuildInteraction(releasedGraphId)

    expect(useBuildStatsStore.getState().overallState).toBe('building')
    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([
      expect.objectContaining({
        graphDocumentId: releasedGraphId,
        label: `Build ${releasedGraphId}`,
        status: 'Starting',
        state: 'queued',
      }),
    ])
    expect(
      useRuntimeInspectorTaskStore.getState().activeQueue.some(
        (entry) => entry.graphDocumentId === releasedGraphId && entry.state === 'delayed',
      ),
    ).toBe(false)
    expect(
      useRuntimeInspectorTaskStore.getState().archive.some(
        (entry) =>
          entry.graphDocumentId === releasedGraphId &&
          (entry.state === 'replaced' || entry.state === 'suppressed'),
      ),
    ).toBe(false)
  })

  it('keeps only one current scheduling archive outcome for repeated replacement and suppress-after-delay churn', async () => {
    const { bootstrapBuildWiring } = await import('./bootstrapBuildWiring')
    const { useBuildStatsStore } = await import('./store/buildStatsStore')
    const { useConsoleStore } = await import('./console/useConsoleStore')
    const { useRuntimeInspectorTaskStore } = await import('./store/runtimeInspectorTaskStore')
    const { useAppStore } = await import('./store/useAppStore')
    const { useSpaghettiStore } = await import('./spaghetti/store/useSpaghettiStore')
    const { useWorkspaceStore } = await import('./workspace/useWorkspaceStore')
    const { createPublishedCubeGraph } = await import('./spaghetti/dev/sampleGraph')

    bootstrapBuildWiring()
    resetStores(useBuildStatsStore, useConsoleStore, useRuntimeInspectorTaskStore)
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)

    const graphDocumentId = useSpaghettiStore
      .getState()
      .createGraphDocument(createPublishedCubeGraph(), 'Churn Graph')
    useSpaghettiStore.getState().openGraphDocumentInViewport(graphDocumentId)
    useWorkspaceStore.getState().setViewportResultMode('model-viewer-primary', 'draft')

    useAppStore.getState().requestGraphDocumentBuild(graphDocumentId, {
      draftPolicyOverride: 'release',
      geometryTargetOverride: 'draft_preview',
    })
    useAppStore.getState().requestGraphDocumentBuild(graphDocumentId, {
      draftPolicyOverride: 'settle',
      geometryTargetOverride: 'draft_preview',
    })

    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([])

    useAppStore.getState().setBrowserGraphBuildPolicy(graphDocumentId, 'off')
    useAppStore.getState().requestBrowserGraphDocumentBuild(graphDocumentId)

    expect(useRuntimeInspectorTaskStore.getState().activeQueue).toEqual([])
    expect(useRuntimeInspectorTaskStore.getState().archive).toEqual([
      expect.objectContaining({
        graphDocumentId,
        status: 'Suppressed',
        state: 'suppressed',
      }),
    ])
  })
})
