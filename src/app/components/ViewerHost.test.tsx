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
let viewerSetGeometrySketchOverlay: ReturnType<typeof vi.fn>
let viewerSetSketchPlanePickOverlay: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickPlaneSelect: ReturnType<typeof vi.fn>
let viewerSetOnSketchPlanePickTransformChange: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchHoverPoint: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchConfirmPoint: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchFinishDraft: ReturnType<typeof vi.fn>
let viewerSetOnGeometrySketchCancelDraft: ReturnType<typeof vi.fn>

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
    public setGeometrySketchOverlay = (...args: unknown[]) => viewerSetGeometrySketchOverlay(...args)
    public setOnGeometrySketchHoverPoint = (...args: unknown[]) =>
      viewerSetOnGeometrySketchHoverPoint(...args)
    public setOnGeometrySketchConfirmPoint = (...args: unknown[]) =>
      viewerSetOnGeometrySketchConfirmPoint(...args)
    public setOnGeometrySketchFinishDraft = (...args: unknown[]) =>
      viewerSetOnGeometrySketchFinishDraft(...args)
    public setOnGeometrySketchCancelDraft = (...args: unknown[]) =>
      viewerSetOnGeometrySketchCancelDraft(...args)
    public setSketchPlanePickOverlay = (...args: unknown[]) =>
      viewerSetSketchPlanePickOverlay(...args)
    public setOnSketchPlanePickPlaneSelect = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickPlaneSelect(...args)
    public setOnSketchPlanePickTransformChange = (...args: unknown[]) =>
      viewerSetOnSketchPlanePickTransformChange(...args)
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
    viewerSetGeometrySketchOverlay = vi.fn()
    viewerSetSketchPlanePickOverlay = vi.fn()
    viewerSetOnSketchPlanePickPlaneSelect = vi.fn()
    viewerSetOnSketchPlanePickTransformChange = vi.fn()
    viewerSetOnGeometrySketchHoverPoint = vi.fn()
    viewerSetOnGeometrySketchConfirmPoint = vi.fn()
    viewerSetOnGeometrySketchFinishDraft = vi.fn()
    viewerSetOnGeometrySketchCancelDraft = vi.fn()
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

  it('pushes the active geometry sketch session into the viewer overlay and clears it when closed', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XZ',
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 25, y: 10 },
                  },
                ],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'draw',
        plane: 'XZ',
        planeTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 0, y: 0, z: 0 }),
        }),
        drawStage: 'sessionIdle',
        activeTool: null,
        drawDraft: null,
        ui: expect.objectContaining({
          snapEnabled: true,
          snapDistancePx: 14,
          crosshairSize: 1,
          startPointVisible: true,
          startPointSymbolSize: 0.1,
          startPointSymbolType: 'circle',
          plinePointVisible: true,
          plinePointSymbolSize: 0.05,
          plinePointSymbolType: 'circle',
        }),
        components: expect.any(Array),
      }),
    )

    act(() => {
      useSpaghettiStore.getState().closeGeometrySketchSession()
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenLastCalledWith(null)
  })

  it('updates the viewer overlay mode and selected profile when sketch review becomes active', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: {
                  profiles: [
                    {
                      profileId: 'profile-a',
                      profileIndex: 0,
                      area: 100,
                      loop: {
                        winding: 'CCW',
                        segments: [],
                      },
                      verticesProxy: [
                        { x: 0, y: 0 },
                        { x: 10, y: 0 },
                        { x: 10, y: 10 },
                        { x: 0, y: 10 },
                      ],
                    },
                    {
                      profileId: 'profile-b',
                      profileIndex: 1,
                      area: 64,
                      loop: {
                        winding: 'CCW',
                        segments: [],
                      },
                      verticesProxy: [
                        { x: 20, y: 0 },
                        { x: 28, y: 0 },
                        { x: 28, y: 8 },
                        { x: 20, y: 8 },
                      ],
                    },
                  ],
                },
                uiState: {
                  collapsed: false,
                  selectedProfileId: 'profile-b',
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'review')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetGeometrySketchOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'review',
        selectedProfileId: 'profile-b',
        profiles: expect.arrayContaining([
          expect.objectContaining({ profileId: 'profile-a' }),
          expect.objectContaining({ profileId: 'profile-b' }),
        ]),
      }),
    )
  })

  it('pushes the active sketch-plane pick session into the viewer and routes plane picks back into the store', async () => {
    const { ViewerHost } = await import('./ViewerHost')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')

    act(() => {
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                planeTransform: {
                  offsetMm: 0,
                  translation: { x: 0, y: 0, z: 0 },
                  rotationDeg: { x: 0, y: 0, z: 0 },
                  inPlaneRotationDeg: 0,
                },
                components: [],
                outputs: {
                  profiles: [],
                },
                uiState: {
                  collapsed: false,
                },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewerHost />)
    })

    expect(viewerSetSketchPlanePickOverlay).toHaveBeenCalledWith(
      expect.objectContaining({
        stage: 'pick',
        gizmoMode: 'translate',
        draftPlane: 'XY',
        draftTransform: expect.objectContaining({
          translation: expect.objectContaining({ x: 0, y: 0, z: 0 }),
        }),
      }),
    )
    expect(viewerSetOnSketchPlanePickPlaneSelect).toHaveBeenCalledWith(expect.any(Function))
    expect(viewerSetOnSketchPlanePickTransformChange).toHaveBeenCalledWith(expect.any(Function))

    const planeSelectHandler = viewerSetOnSketchPlanePickPlaneSelect.mock.calls.at(-1)?.[0] as
      | ((plane: 'XY' | 'XZ' | 'YZ') => void)
      | null

    act(() => {
      planeSelectHandler?.('YZ')
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftPlane: 'YZ',
      stage: 'adjust',
    })

    const transformChangeHandler =
      viewerSetOnSketchPlanePickTransformChange.mock.calls.at(-1)?.[0] as
        | ((transform: {
            offsetMm: number
            inPlaneRotationDeg: number
            translation: { x: number; y: number; z: number }
            rotationDeg: { x: number; y: number; z: number }
          }) => void)
        | null

    act(() => {
      transformChangeHandler?.({
        offsetMm: 0,
        inPlaneRotationDeg: 0,
        translation: { x: 12, y: -4, z: 8 },
        rotationDeg: { x: 0, y: 30, z: 45 },
      })
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftTransform: {
        translation: { x: 12, y: -4, z: 8 },
        rotationDeg: { x: 0, y: 30, z: 45 },
      },
    })
  })
})
