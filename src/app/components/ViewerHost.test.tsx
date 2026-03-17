// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let viewerEnsureReferenceLoaded: ReturnType<typeof vi.fn>
let viewerSetReferenceVisible: ReturnType<typeof vi.fn>
let viewerRemoveReference: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformSession: ReturnType<typeof vi.fn>
let viewerSetReferenceTransformOverride: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformExit: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformModeChange: ReturnType<typeof vi.fn>
let viewerSetOnReferenceTransformSpaceChange: ReturnType<typeof vi.fn>
let viewerSetGizmoSnap: ReturnType<typeof vi.fn>

vi.mock('../viewerBridge', () => ({
  setViewer: vi.fn(),
}))

vi.mock('../../viewer/Viewer', () => ({
  Viewer: class MockViewer {
    public constructor(_container: HTMLElement) {}
    public dispose(): void {}
    public setAssembled(): void {}
    public setParts(): void {}
    public setSelectedPart(): void {}
    public applyViewSettings(): void {}
    public ensureReferenceLoaded = (...args: unknown[]) => viewerEnsureReferenceLoaded(...args)
    public setReferenceVisible = (...args: unknown[]) => viewerSetReferenceVisible(...args)
    public removeReference = (...args: unknown[]) => viewerRemoveReference(...args)
    public setReferenceTransformSession = (...args: unknown[]) =>
      viewerSetReferenceTransformSession(...args)
    public setReferenceTransformOverride = (...args: unknown[]) =>
      viewerSetReferenceTransformOverride(...args)
    public setOnReferenceTransformChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformChange(...args)
    public setOnReferenceTransformExit = (...args: unknown[]) =>
      viewerSetOnReferenceTransformExit(...args)
    public setOnReferenceTransformModeChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformModeChange(...args)
    public setOnReferenceTransformSpaceChange = (...args: unknown[]) =>
      viewerSetOnReferenceTransformSpaceChange(...args)
    public setGizmoSnap = (...args: unknown[]) => viewerSetGizmoSnap(...args)
  },
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

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

const deferred = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: unknown) => void
  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })
  return { promise, resolve, reject }
}

describe('ViewerHost reference loading', () => {
  const originalWorker = globalThis.Worker
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(async () => {
    vi.resetModules()
    viewerEnsureReferenceLoaded = vi.fn()
    viewerSetReferenceVisible = vi.fn()
    viewerRemoveReference = vi.fn()
    viewerSetReferenceTransformSession = vi.fn()
    viewerSetReferenceTransformOverride = vi.fn()
    viewerSetOnReferenceTransformChange = vi.fn()
    viewerSetOnReferenceTransformExit = vi.fn()
    viewerSetOnReferenceTransformModeChange = vi.fn()
    viewerSetOnReferenceTransformSpaceChange = vi.fn()
    viewerSetGizmoSnap = vi.fn()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    try {
      const { buildDispatcher } = await import('../buildDispatcher')
      buildDispatcher.dispose()
    } catch {
      // Ignore cleanup failures from partially initialized modules.
    }
    globalThis.Worker = originalWorker
  })

  it('promotes a visible reference from loading to loaded after the async viewer load resolves', async () => {
    const load = deferred<void>()
    viewerEnsureReferenceLoaded.mockReturnValue(load.promise)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('loading')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(1)

    await act(async () => {
      load.resolve()
      await load.promise
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['shoe:shoe-1']).toBe('loaded')
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith('shoe:shoe-1', true)
  })

  it('keeps a failed STEP row retryable by clearing visibility on error and loading again after the next click', async () => {
    const firstError = new Error('STEP import failed')
    viewerEnsureReferenceLoaded
      .mockRejectedValueOnce(firstError)
      .mockResolvedValueOnce(undefined)

    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('hook:large')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['hook:large']).toBe('error')
    expect(useAppStore.getState().referenceWorkspace.visibilityById['hook:large']).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.errorById['hook:large']).toBe('STEP import failed')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('hook:large')
    })

    await act(async () => {
      await Promise.resolve()
    })

    expect(useAppStore.getState().referenceWorkspace.loadStateById['hook:large']).toBe('loaded')
    expect(viewerEnsureReferenceLoaded).toHaveBeenCalledTimes(2)
    expect(viewerSetReferenceVisible).toHaveBeenCalledWith('hook:large', true)
  })

  it('removes an imported reference object from the viewer when the workspace row is removed', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().addImportedReference({
        fileName: 'shoe.glb',
        fileType: 'glb',
        objectUrl: 'blob:shoe-1',
      })
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    const importedReferenceId =
      useAppStore.getState().referenceWorkspace.importedReferenceOrder[0] ?? null
    expect(importedReferenceId).not.toBeNull()

    act(() => {
      useAppStore.getState().removeImportedReference(importedReferenceId!)
    })

    expect(viewerRemoveReference).toHaveBeenCalledWith(importedReferenceId)
  })

  it('syncs an active reference transform session into the viewer and exits when the reference is hidden', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransform('shoe:shoe-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetReferenceTransformSession).toHaveBeenCalledWith({
      referenceId: 'shoe:shoe-1',
      mode: 'translate',
      space: 'local',
    })

    act(() => {
      useAppStore.getState().setReferenceItemVisibility('shoe:shoe-1', false)
    })

    expect(useAppStore.getState().referenceWorkspace.activeTransformReferenceId).toBeNull()
  })

  it('pushes the active reference rotate snap value into the viewer gizmo snap state', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useAppStore } = await import('../store/useAppStore')

    act(() => {
      useAppStore.getState().toggleReferenceItemVisibility('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransform('shoe:shoe-1')
      useAppStore.getState().setReferenceRotateSnapEnabled('shoe:shoe-1', true)
      useAppStore.getState().setReferenceRotateSnapValue('shoe:shoe-1', 22.5)
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetGizmoSnap).toHaveBeenCalledWith({ rotateDeg: 22.5 })
  })
})
