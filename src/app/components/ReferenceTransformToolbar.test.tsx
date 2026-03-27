// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const viewerFrameReference = vi.fn()
const viewerSetReferenceCameraLock = vi.fn()
const viewerSetReferenceTransformOverride = vi.fn()
const viewerCommitReferenceTransformSession = vi.fn()
const viewerCompleteReferenceTransformDrag = vi.fn()
const viewerCancelReferenceTransformDrag = vi.fn()
const viewerClearReferenceTransformHandle = vi.fn()
const viewerActivateTranslateCenterHandle = vi.fn()
const viewerActivateTranslateHandle = vi.fn()
const viewerActivateRotateCenterHandle = vi.fn()
const viewerActivateRotateHandle = vi.fn()
const viewerActivateScaleCenterHandle = vi.fn()
const viewerActivateScaleHandle = vi.fn()

vi.mock('../viewerBridge', () => ({
  getViewer: () => ({
    frameReference: viewerFrameReference,
    setReferenceCameraLock: viewerSetReferenceCameraLock,
    setReferenceTransformOverride: viewerSetReferenceTransformOverride,
    commitReferenceTransformSession: viewerCommitReferenceTransformSession,
    completeReferenceTransformDrag: viewerCompleteReferenceTransformDrag,
    cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
    clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
    activateTranslateCenterHandle: viewerActivateTranslateCenterHandle,
    activateTranslateHandle: viewerActivateTranslateHandle,
    activateRotateCenterHandle: viewerActivateRotateCenterHandle,
    activateRotateHandle: viewerActivateRotateHandle,
    activateScaleCenterHandle: viewerActivateScaleCenterHandle,
    activateScaleHandle: viewerActivateScaleHandle,
  }),
}))

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

describe('ReferenceTransformToolbar', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWorker = globalThis.Worker
  let useConsoleStore: typeof import('../console/useConsoleStore').useConsoleStore

  beforeEach(async () => {
    vi.resetModules()
    ;({ useConsoleStore } = await import('../console/useConsoleStore'))
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    viewerFrameReference.mockReset()
    viewerSetReferenceCameraLock.mockReset()
    viewerSetReferenceTransformOverride.mockReset()
    viewerCommitReferenceTransformSession.mockReset()
    viewerCompleteReferenceTransformDrag.mockReset()
    viewerCancelReferenceTransformDrag.mockReset()
    viewerClearReferenceTransformHandle.mockReset()
    viewerActivateTranslateCenterHandle.mockReset()
    viewerActivateTranslateHandle.mockReset()
    viewerActivateRotateCenterHandle.mockReset()
    viewerActivateRotateHandle.mockReset()
    viewerActivateScaleCenterHandle.mockReset()
    viewerActivateScaleHandle.mockReset()
    globalThis.Worker = MockWorker as unknown as typeof Worker
    const { useAppStore } = await import('../store/useAppStore')
    useAppStore.setState(useAppStore.getInitialState(), true)
    useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
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

  it('updates the active reference transform override from the move sliders', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const increaseXButtons = Array.from(
      container.querySelectorAll('button[aria-label="Increase X"]'),
    ) as HTMLButtonElement[]
    expect(increaseXButtons.length).toBeGreaterThan(0)

    await act(async () => {
      increaseXButtons[0]?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.draftTransform).toMatchObject(
      {
        position: { x: 1, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    )
  })

  it('highlights the active section and collapses only when the arrow is clicked', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const moveSection = container.querySelector(
      '.ReferenceTransformToolbarTransformSection',
    ) as HTMLDivElement | null
    expect(moveSection?.className).toContain('isActive')

    const rotateHeader = Array.from(
      container.querySelectorAll('.ReferenceTransformToolbarTransformSectionHeader'),
    ).find((element) => element.textContent?.includes('Rotate')) as HTMLDivElement | undefined

    expect(rotateHeader).toBeDefined()

    await act(async () => {
      rotateHeader?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('rotate')

    const rotateSection = Array.from(
      container.querySelectorAll('.ReferenceTransformToolbarTransformSection'),
    ).find((element) => element.textContent?.includes('Rotate')) as HTMLDivElement | undefined

    expect(rotateSection?.className).toContain('isActive')

    const rotateToggle = rotateSection?.querySelector(
      'button[aria-label="Collapse Rotate section"]',
    ) as HTMLButtonElement | null

    expect(rotateToggle).not.toBeNull()

    await act(async () => {
      rotateToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(rotateSection?.textContent).not.toContain('X')
    expect(
      rotateSection?.querySelector('button[aria-label="Expand Rotate section"]'),
    ).not.toBeNull()
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('rotate')
  })

  it('switches transform modes from keyboard shortcuts while the toolbar is active', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('rotate')
    expect(viewerActivateRotateCenterHandle).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('Rotate')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('scale')
    expect(viewerActivateScaleCenterHandle).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('Scale')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('translate')
    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(1)
  })

  it('shows the active transform session path and history section for the current vec3 values', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          activeReferenceTransformSession: {
            referenceId: 'shoe:shoe-1',
            sessionId: 'reference-transform-session-1',
            sessionOrdinal: 1,
            mode: 'translate',
            space: 'local',
            shellActive: true,
            entryActive: false,
            activeHandle: null,
            draftTransform: {
              position: { x: 12.5, y: -7, z: 42 },
              rotationDeg: { x: 15, y: 0, z: -30 },
              scale: { x: 1.1, y: 1, z: 0.95 },
            },
            entryOrigin: null,
          },
          transformOverrideById: {
            ...state.referenceWorkspace.transformOverrideById,
            'shoe:shoe-1': {
              position: { x: 12.5, y: -7, z: 42 },
              rotationDeg: { x: 15, y: 0, z: -30 },
              scale: { x: 1.1, y: 1, z: 0.95 },
            },
          },
        },
      }))
      root?.render(<ReferenceTransformToolbar />)
    })

    expect(container.textContent).toContain(
      'Select > Reference > Shoe 1 > Transform > Move > Vec3 [12.5, -7.0, 42.0]',
    )
    expect(container.textContent).toContain('Transform History')
    expect(container.textContent).toContain('Origin')
    const historySection = container.querySelector(
      '[aria-label="Reference transform history"]',
    ) as HTMLDivElement | null
    const valuesSection = container.querySelector(
      '[aria-label="Reference transform values"]',
    ) as HTMLDivElement | null
    expect(historySection).not.toBeNull()
    expect(valuesSection).not.toBeNull()
    expect(historySection).not.toBeNull()
    expect(valuesSection).not.toBeNull()
    expect(
      historySection!.compareDocumentPosition(valuesSection!),
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('rotate')
    })

    expect(container.textContent).toContain(
      'Select > Reference > Shoe 1 > Transform > Rotate > Vec3 [15.0, 0.0, -30.0]',
    )
  })

  it('does not treat raw x y z keys as immediate move-axis shortcuts now that console owns axis prompts', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('translate')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }))
    })

    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(1)
    expect(viewerActivateTranslateHandle).not.toHaveBeenCalled()
  })

  it('does not treat raw x y z keys as immediate axis shortcuts when a transform mode is already active', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.getState().beginReferenceTransformEntry('translate')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', bubbles: true }))
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }))
    })

    expect(viewerActivateTranslateHandle).not.toHaveBeenCalled()
    expect(viewerActivateRotateHandle).not.toHaveBeenCalled()
    expect(viewerActivateScaleHandle).not.toHaveBeenCalled()
  })

  it('does not treat raw x y z keys as immediate rotate or scale shortcuts while those modes are active', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('rotate')
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }))
    })
    expect(viewerActivateRotateHandle).not.toHaveBeenCalled()

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('scale')
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', bubbles: true }))
    })
    expect(viewerActivateScaleHandle).not.toHaveBeenCalled()
  })

  it('keeps the live draft when switching modes and commits through Enter', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })

    await act(async () => {
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 12, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 12, y: 0, z: 0 },
    })
    expect(viewerCancelReferenceTransformDrag).not.toHaveBeenCalled()

    await act(async () => {
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 33, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })
    expect(viewerCommitReferenceTransformSession).toHaveBeenCalledTimes(1)

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      rotationDeg: { x: 0, y: 33, z: 0 },
    })
  })

  it('cancels the active transform session on Escape and restores the baseline', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 9, y: 2, z: -3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.draftTransform).toMatchObject({
      position: { x: 0, y: 0, z: 0 },
    })
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalled()
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.referenceId).toBe('shoe:shoe-1')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(false)
  })

  it('returns to the reference transform shell on Escape when no keyboard transform is pending', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.referenceId).toBe('shoe:shoe-1')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
  })

  it('re-arms move when m is pressed a second time without clearing the live draft', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })

    const moveSection = container.querySelector(
      '.ReferenceTransformToolbarTransformSection',
    ) as HTMLDivElement | null
    expect(moveSection?.className).toContain('isActive')

    await act(async () => {
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 18, y: -4, z: 7 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 18, y: -4, z: 7 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(2)
    expect(viewerCancelReferenceTransformDrag).not.toHaveBeenCalled()
    expect(viewerClearReferenceTransformHandle).not.toHaveBeenCalled()
    expect(moveSection?.className).toContain('isActive')
  })

  it('re-arms rotate and scale when r or s is pressed again without clearing the live draft', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const sections = Array.from(
      container.querySelectorAll('.ReferenceTransformToolbarTransformSection'),
    ) as HTMLDivElement[]
    const rotateSection = sections.find((element) => element.textContent?.includes('Rotate')) ?? null
    const scaleSection = sections.find((element) => element.textContent?.includes('Scale')) ?? null

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })
    expect(rotateSection?.className).toContain('isActive')

    await act(async () => {
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 27, y: 9, z: -11 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      rotationDeg: { x: 27, y: 9, z: -11 },
    })
    expect(viewerActivateRotateCenterHandle).toHaveBeenCalledTimes(2)
    expect(viewerCancelReferenceTransformDrag).not.toHaveBeenCalled()
    expect(viewerClearReferenceTransformHandle).not.toHaveBeenCalled()
    expect(rotateSection?.className).toContain('isActive')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })
    expect(scaleSection?.className).toContain('isActive')

    await act(async () => {
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1.7, y: 0.8, z: 1.3 },
      })
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      scale: { x: 1.7, y: 0.8, z: 1.3 },
    })
    expect(viewerActivateScaleCenterHandle).toHaveBeenCalledTimes(2)
    expect(scaleSection?.className).toContain('isActive')
  })

  it('highlights all xyz rows for the active mode hotkey and lets console prompts narrow that highlight later', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const getChannelBox = (channel: string) =>
      container?.querySelector(`[data-channel="${channel}"]`) as HTMLDivElement | null

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })
    expect(getChannelBox('move-x')?.className).toContain('isHighlighted')
    expect(getChannelBox('move-y')?.className).toContain('isHighlighted')
    expect(getChannelBox('move-z')?.className).toContain('isHighlighted')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    })
    expect(getChannelBox('move-x')?.className).toContain('isHighlighted')
    expect(getChannelBox('move-y')?.className).toContain('isHighlighted')
    expect(getChannelBox('move-z')?.className).toContain('isHighlighted')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }))
    })
    expect(getChannelBox('rotate-z')?.className).toContain('isHighlighted')
    expect(getChannelBox('rotate-x')?.className).toContain('isHighlighted')
    expect(getChannelBox('rotate-y')?.className).toContain('isHighlighted')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })
    expect(getChannelBox('scale-x')?.className).toContain('isHighlighted')
    expect(getChannelBox('scale-y')?.className).toContain('isHighlighted')
    expect(getChannelBox('scale-z')?.className).toContain('isHighlighted')
  })

  it('highlights only the prompted axis row when the console opens Move X', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
      useConsoleStore.getState().setConsolePromptSession({
        kind: 'reference-transform.axis',
        breadcrumb: ['Select', 'References', 'Shoes', 'Shoe 1', 'Transform', 'Move', 'Move X'],
        label: 'Select > References > Shoes > Shoe 1 > Transform > Move > Move X',
        prefill: '0',
        returnSession: useConsoleStore.getState().stagedNavigationSession!,
        mode: 'translate',
        axis: 'x',
      })
    })

    const getChannelBox = (channel: string) =>
      container?.querySelector(`[data-channel="${channel}"]`) as HTMLDivElement | null

    expect(getChannelBox('move-x')?.className).toContain('isHighlighted')
    expect(getChannelBox('move-y')?.className).not.toContain('isHighlighted')
    expect(getChannelBox('move-z')?.className).not.toContain('isHighlighted')
    expect(getChannelBox('rotate-x')?.className).not.toContain('isHighlighted')
    expect(getChannelBox('scale-x')?.className).not.toContain('isHighlighted')
  })

  it('highlights the shared active-handle axis row when the gizmo selects Move Y', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('translate')
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'axis',
        axis: 'y',
      })
      root?.render(<ReferenceTransformToolbar />)
    })

    const getChannelBox = (channel: string) =>
      container?.querySelector(`[data-channel="${channel}"]`) as HTMLDivElement | null

    expect(getChannelBox('move-x')?.className).not.toContain('isHighlighted')
    expect(getChannelBox('move-y')?.className).toContain('isHighlighted')
    expect(getChannelBox('move-z')?.className).not.toContain('isHighlighted')
  })

  it('does not highlight an individual row when the gizmo selects the translate center handle', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('translate')
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'center',
      })
      root?.render(<ReferenceTransformToolbar />)
    })

    const highlightedRows = Array.from(
      container?.querySelectorAll('.ReferenceTransformToolbarChannelBox.isHighlighted') ?? [],
    )

    expect(highlightedRows).toHaveLength(0)
  })

  it('locks all three scale axes together when scale lock is enabled', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const lockButton = container.querySelector(
      'button[aria-label="Lock scale axes"]',
    ) as HTMLButtonElement | null
    expect(lockButton).not.toBeNull()

    await act(async () => {
      lockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const increaseXButtons = Array.from(
      container.querySelectorAll('button[aria-label="Increase X"]'),
    ) as HTMLButtonElement[]
    expect(increaseXButtons.length).toBeGreaterThanOrEqual(3)

    await act(async () => {
      increaseXButtons[2]?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.draftTransform).toMatchObject(
      {
        scale: { x: 1.01, y: 1.01, z: 1.01 },
      },
    )
  })

  it('enters clamp edit mode and shows clamp handles for the sliders', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const clampButton = Array.from(container.querySelectorAll('button')).find((button) =>
      button.textContent?.includes('Edit Clamp'),
    ) as HTMLButtonElement | undefined

    expect(clampButton).toBeDefined()

    await act(async () => {
      clampButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Done Clamp')
    expect(
      container.querySelector('button[aria-label="Adjust minimum X clamp"]'),
    ).not.toBeNull()
    expect(
      container.querySelector('button[aria-label="Adjust maximum X clamp"]'),
    ).not.toBeNull()
  })

  it('frames the active reference from the header zoom button', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const frameButton = container.querySelector(
      'button[aria-label="Zoom to reference object"]',
    ) as HTMLButtonElement | null

    expect(frameButton).not.toBeNull()

    await act(async () => {
      frameButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameReference).toHaveBeenCalledWith('shoe:shoe-1')
  })

  it('uses the shared overlay tool-panel shell with title meta, drag, and 8 resize handles', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const toolPanel = container.querySelector('.ViewportOverlayToolPanel.ReferenceTransformToolbar') as HTMLDivElement | null
    const titleBar = container.querySelector('.ViewportOverlayToolPanelTitleBar') as HTMLDivElement | null
    const titleMeta = container.querySelector('.ViewportOverlayToolPanelTitleMeta') as HTMLDivElement | null
    const resizeHandles = container.querySelectorAll('.ViewportOverlayToolPanelResizeHandle')
    const southEastHandle = container.querySelector(
      '.ViewportOverlayToolPanelResizeHandle--se',
    ) as HTMLDivElement | null

    expect(toolPanel).not.toBeNull()
    expect(titleBar).not.toBeNull()
    expect(titleMeta?.textContent).toContain('Shoe 1')
    expect(resizeHandles).toHaveLength(8)
    expect(southEastHandle).not.toBeNull()
    expect(toolPanel?.style.width).toBe('300px')
    expect(toolPanel?.style.left).toBe(`${window.innerWidth - 300 - 12}px`)

    if (toolPanel !== null) {
      Object.defineProperty(toolPanel, 'offsetWidth', {
        configurable: true,
        get: () => 300,
      })
      Object.defineProperty(toolPanel, 'offsetHeight', {
        configurable: true,
        get: () => 360,
      })
    }

    const initialLeft = Number.parseInt(toolPanel?.style.left ?? '0', 10)
    const initialTop = Number.parseInt(toolPanel?.style.top ?? '0', 10)

    await act(async () => {
      titleBar?.dispatchEvent(
        new MouseEvent('mousedown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 100,
          clientY: 120,
        }),
      )
      window.dispatchEvent(
        new MouseEvent('mousemove', {
          clientX: 132,
          clientY: 148,
        }),
      )
      window.dispatchEvent(new MouseEvent('mouseup'))
    })

    expect(toolPanel?.style.left).toBe(`${initialLeft}px`)
    expect(toolPanel?.style.top).toBe(`${initialTop + 28}px`)

    await act(async () => {
      southEastHandle?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          pointerId: 9,
          button: 0,
          clientX: 300,
          clientY: 360,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 9,
          clientX: 336,
          clientY: 404,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', { pointerId: 9 }))
    })

    expect(toolPanel?.style.width).toBe('336px')
    expect(toolPanel?.style.height).toBe('404px')
  })

  it('toggles the keyboard shortcuts help from the header info button', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const infoButton = container.querySelector(
      'button[aria-label="Toggle keyboard shortcuts help"]',
    ) as HTMLButtonElement | null
    expect(infoButton).not.toBeNull()
    expect(container.textContent).not.toContain('Keyboard Shortcuts')

    await act(async () => {
      infoButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('Keyboard Shortcuts')
    expect(container.textContent).toContain('M then X / Y / Z')

    await act(async () => {
      infoButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).not.toContain('Keyboard Shortcuts')
  })

  it('toggles camera lock for the active reference from the header lock button', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const lockButton = container.querySelector(
      'button[aria-label="Lock camera to reference object"]',
    ) as HTMLButtonElement | null

    expect(lockButton).not.toBeNull()

    await act(async () => {
      lockButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(viewerSetReferenceCameraLock).toHaveBeenCalledWith('shoe:shoe-1')
    expect(viewerFrameReference).not.toHaveBeenCalled()
  })

  it('shows rotate snap controls and updates the reference snap state', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const snapToggle = container.querySelector(
      'button[aria-label="Toggle rotate snap"]',
    ) as HTMLButtonElement | null

    expect(snapToggle).not.toBeNull()

    await act(async () => {
      snapToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.rotateSnapByReferenceId['shoe:shoe-1']).toMatchObject(
      {
        enabled: true,
        value: 15,
      },
    )

    const snap225Button = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '22.5',
    ) as HTMLButtonElement | undefined

    expect(snap225Button).toBeDefined()

    await act(async () => {
      snap225Button?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.rotateSnapByReferenceId['shoe:shoe-1']).toMatchObject(
      {
        enabled: true,
        value: 22.5,
      },
    )

    const snapValueButton = container.querySelector(
      'button[aria-label="Edit Snap value"]',
    ) as HTMLButtonElement | null

    expect(snapValueButton).not.toBeNull()

    await act(async () => {
      snapValueButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const snapValueInput = container.querySelector(
      'input[aria-label="Edit Snap value"]',
    ) as HTMLInputElement | null

    expect(snapValueInput).not.toBeNull()

    await act(async () => {
      if (snapValueInput !== null) {
        snapValueInput.value = '7.5'
        snapValueInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    await act(async () => {
      snapValueInput?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.rotateSnapByReferenceId['shoe:shoe-1']).toMatchObject(
      {
        enabled: true,
        value: 7.5,
      },
    )
  })

  it('groups history rows by transform session and expands the newest session by default', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: {
          referenceId: 'shoe:shoe-1',
          sessionId: 'reference-transform-session-2',
          sessionOrdinal: 2,
          mode: 'translate',
          space: 'local',
          shellActive: true,
          entryActive: false,
          activeHandle: null,
          draftTransform: {
            position: { x: 9, y: -2, z: 4 },
            rotationDeg: { x: 0, y: 20, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          entryOrigin: null,
        },
        transformHistoryByReferenceId: {
          ...state.referenceWorkspace.transformHistoryByReferenceId,
          'shoe:shoe-1': [
            {
              entryId: 'history-1',
              sessionId: 'reference-transform-session-1',
              sessionOrdinal: 1,
              kind: 'move',
              delta: { x: 5, y: 0, z: 0 },
              after: { x: 5, y: 0, z: 0 },
              transformAfter: {
                position: { x: 5, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
              },
              locked: false,
            },
            {
              entryId: 'history-2',
              sessionId: 'reference-transform-session-1',
              sessionOrdinal: 1,
              kind: 'rotate',
              delta: { x: 0, y: 20, z: 0 },
              after: { x: 0, y: 20, z: 0 },
              transformAfter: {
                position: { x: 5, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 20, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
              },
              locked: false,
            },
            {
              entryId: 'history-3',
              sessionId: 'reference-transform-session-2',
              sessionOrdinal: 2,
              kind: 'move',
              delta: { x: 4, y: -2, z: 4 },
              after: { x: 9, y: -2, z: 4 },
              transformAfter: {
                position: { x: 9, y: -2, z: 4 },
                rotationDeg: { x: 0, y: 20, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
              },
              locked: false,
            },
          ],
        },
      },
    }))

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    expect(container.textContent).toContain('Transform 1')
    expect(container.textContent).toContain('Transform 2')
    expect(container.querySelector('button[aria-label="Expand Transform 1"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Collapse Transform 2"]')).not.toBeNull()
    expect(container.querySelector('button[aria-label="Lock Transform 2 entry 3"]')).not.toBeNull()
    expect(container.textContent).not.toContain('2. Rotate Vec(0.00, 20.00, 0.00)')
    expect(container.textContent).toContain('3. Move Vec(9.00, -2.00, 4.00)')

    const expandTransform1 = container.querySelector(
      'button[aria-label="Expand Transform 1"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expandTransform1?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.textContent).toContain('2. Rotate Vec(0.00, 20.00, 0.00)')
  })

  it('edits existing history entry values in place without appending a new entry', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: {
          referenceId: 'shoe:shoe-1',
          sessionId: 'reference-transform-session-1',
          sessionOrdinal: 1,
          mode: 'translate',
          space: 'local',
          shellActive: true,
          entryActive: false,
          activeHandle: null,
          draftTransform: {
            position: { x: 5, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          entryOrigin: null,
        },
        transformHistoryByReferenceId: {
          ...state.referenceWorkspace.transformHistoryByReferenceId,
          'shoe:shoe-1': [
            {
              entryId: 'history-1',
              sessionId: 'reference-transform-session-1',
              sessionOrdinal: 1,
              kind: 'move',
              delta: { x: 5, y: 0, z: 0 },
              after: { x: 5, y: 0, z: 0 },
              transformAfter: {
                position: { x: 5, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
              },
              locked: false,
            },
          ],
        },
      },
    }))

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const values = container.querySelector(
      '[aria-label="Transform 1 entry 1 values"]',
    ) as HTMLDivElement | null
    const firstTrack = values?.querySelector('.ParaSliderTrack') as HTMLDivElement | null
    expect(firstTrack).not.toBeNull()

    Object.defineProperty(firstTrack, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 26,
        right: 100,
        bottom: 26,
        x: 0,
        y: 0,
        toJSON: () => '',
      }),
    })

    await act(async () => {
      firstTrack?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 75,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
    })

    const entries =
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'] ?? []
    expect(entries).toHaveLength(1)
    expect(entries[0]).toMatchObject({
      delta: { x: 150, y: 0, z: 0 },
      after: { x: 150, y: 0, z: 0 },
      transformAfter: {
        position: { x: 150, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    })
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject(
      {
        position: { x: 150, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    )
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.draftTransform).toMatchObject(
      {
        position: { x: 150, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    )
  })

  it('scrubs committed history from the toolbar and deactivates future rows', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: {
          referenceId: 'shoe:shoe-1',
          sessionId: 'reference-transform-session-1',
          sessionOrdinal: 1,
          mode: 'translate',
          space: 'local',
          shellActive: true,
          entryActive: false,
          activeHandle: null,
          historyScrubIndex: 3,
          draftTransform: {
            position: { x: 5, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 20, z: 0 },
            scale: { x: 1.5, y: 1, z: 1 },
          },
          entryOrigin: null,
        },
        transformHistoryByReferenceId: {
          ...state.referenceWorkspace.transformHistoryByReferenceId,
          'shoe:shoe-1': [
            {
              entryId: 'history-1',
              sessionId: 'reference-transform-session-1',
              sessionOrdinal: 1,
              kind: 'move',
              delta: { x: 5, y: 0, z: 0 },
              after: { x: 5, y: 0, z: 0 },
              transformAfter: {
                position: { x: 5, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 0, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
              },
              locked: false,
            },
            {
              entryId: 'history-2',
              sessionId: 'reference-transform-session-1',
              sessionOrdinal: 1,
              kind: 'rotate',
              delta: { x: 0, y: 20, z: 0 },
              after: { x: 0, y: 20, z: 0 },
              transformAfter: {
                position: { x: 5, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 20, z: 0 },
                scale: { x: 1, y: 1, z: 1 },
              },
              locked: false,
            },
            {
              entryId: 'history-3',
              sessionId: 'reference-transform-session-1',
              sessionOrdinal: 1,
              kind: 'scale',
              delta: { x: 0.5, y: 0, z: 0 },
              after: { x: 1.5, y: 1, z: 1 },
              transformAfter: {
                position: { x: 5, y: 0, z: 0 },
                rotationDeg: { x: 0, y: 20, z: 0 },
                scale: { x: 1.5, y: 1, z: 1 },
              },
              locked: false,
            },
          ],
        },
      },
    }))

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const jumpToSecondEntry = container.querySelector(
      'button[aria-label="Jump to Transform 1 entry 2"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      jumpToSecondEntry?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toMatchObject({
      historyScrubIndex: 2,
      draftTransform: {
        position: { x: 5, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 20, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    })

    const currentEntryButton = container.querySelector(
      'button[aria-label="Jump to Transform 1 entry 2"]',
    ) as HTMLButtonElement | null
    const futureValues = container.querySelector(
      '[aria-label="Transform 1 entry 3 values"]',
    ) as HTMLDivElement | null

    expect(currentEntryButton?.getAttribute('aria-pressed')).toBe('true')
    expect(futureValues?.className).toContain('isInactive')
  })

  it('applies the active rotate snap interval to rotate axis stepping', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: {
          referenceId: 'shoe:shoe-1',
          sessionId: 'reference-transform-session-1',
          sessionOrdinal: 1,
          mode: 'rotate',
          space: 'local',
          shellActive: true,
          entryActive: false,
          activeHandle: null,
          draftTransform: {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 121, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          entryOrigin: null,
        },
        transformOverrideById: {
          ...state.referenceWorkspace.transformOverrideById,
          'shoe:shoe-1': {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 121, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
        },
      },
    }))

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const snapToggle = container.querySelector(
      'button[aria-label="Toggle rotate snap"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      snapToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const snap5Button = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '5',
    ) as HTMLButtonElement | undefined

    await act(async () => {
      snap5Button?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const increaseXButtons = Array.from(
      container.querySelectorAll('button[aria-label="Increase X"]'),
    ) as HTMLButtonElement[]

    expect(increaseXButtons.length).toBeGreaterThanOrEqual(3)

    await act(async () => {
      increaseXButtons[1]?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.draftTransform).toMatchObject(
      {
        rotationDeg: { x: 126, y: 0, z: 0 },
      },
    )
  })

  it('does not normalize the current rotate value when the snap interval changes', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        transformOverrideById: {
          ...state.referenceWorkspace.transformOverrideById,
          'shoe:shoe-1': {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 13, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
        },
      },
    }))

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const snapToggle = container.querySelector(
      'button[aria-label="Toggle rotate snap"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      snapToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const snap225Button = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '22.5',
    ) as HTMLButtonElement | undefined

    await act(async () => {
      snap225Button?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject(
      {
        rotationDeg: { x: 13, y: 0, z: 0 },
      },
    )
  })

  it('switches a transform value row into timeline mode from the context menu', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const firstChannelRow = container.querySelector(
      '.ReferenceTransformToolbarChannelBox',
    ) as HTMLDivElement | null

    expect(firstChannelRow).not.toBeNull()

    await act(async () => {
      firstChannelRow?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 120,
          clientY: 160,
        }),
      )
    })

    const timelineButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Timeline',
    ) as HTMLButtonElement | undefined

    expect(timelineButton).toBeDefined()

    await act(async () => {
      timelineButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      useAppStore.getState().referenceWorkspace.timelineModeByReferenceId['shoe:shoe-1']?.['move-x'],
    ).toBe('timeline')
    expect(container.querySelector('.ReferenceTransformToolbarTimelineBox')).not.toBeNull()
  })

  it('opens the Basic / Timeline menu when right-clicking the slider track itself', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const firstTrack = container.querySelector(
      '[aria-label="Reference transform values"] .ParaSliderTrack',
    ) as HTMLDivElement | null
    expect(firstTrack).not.toBeNull()

    await act(async () => {
      firstTrack?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 144,
          clientY: 188,
        }),
      )
    })

    expect(container.textContent).toContain('Basic')
    expect(container.textContent).toContain('Timeline')
  })

  it('can switch rotate snap into timeline mode and keep its controls visible', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ReferenceTransformToolbar />)
    })

    const snapToggle = container.querySelector(
      'button[aria-label="Toggle rotate snap"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      snapToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const snapRow = container.querySelector(
      '.ReferenceTransformToolbarRotateSnapGroup .ReferenceTransformToolbarChannelBox',
    ) as HTMLDivElement | null

    expect(snapRow).not.toBeNull()

    await act(async () => {
      snapRow?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 140,
          clientY: 200,
        }),
      )
    })

    const timelineButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === 'Timeline',
    ) as HTMLButtonElement | undefined

    await act(async () => {
      timelineButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      useAppStore.getState().referenceWorkspace.timelineModeByReferenceId['shoe:shoe-1']?.['rotate-snap'],
    ).toBe('timeline')
    expect(container.textContent).toContain('Left to Right')
  })
})
