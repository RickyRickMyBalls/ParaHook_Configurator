// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const viewerFrameReference = vi.fn()
const viewerSetReferenceCameraLock = vi.fn()
const viewerSetReferenceTransformOverride = vi.fn()
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
    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeTransformReferenceId: 'shoe:shoe-1',
      },
    }))
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

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject(
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

    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('rotate')

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
    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('rotate')
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
    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('rotate')
    expect(viewerActivateRotateCenterHandle).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('Rotate')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('scale')
    expect(viewerActivateScaleCenterHandle).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('Scale')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('translate')
    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(1)
  })

  it('uses x y z shortcuts to constrain move while translate mode is active', async () => {
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
    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('translate')

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
    expect(viewerActivateTranslateHandle).toHaveBeenNthCalledWith(1, 'Y')
    expect(viewerActivateTranslateHandle).toHaveBeenNthCalledWith(2, 'X')
    expect(viewerActivateTranslateHandle).toHaveBeenNthCalledWith(3, 'Z')
  })

  it('does not use x y z as standalone transform-start shortcuts without an active keyboard chain', async () => {
    const { ReferenceTransformToolbar } = await import('./ReferenceTransformToolbar')
    const { useAppStore } = await import('../store/useAppStore')

    useAppStore.getState().setReferenceTransformMode('translate')

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

  it('uses x y z shortcuts to constrain rotate and scale while those modes are active', async () => {
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
    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('rotate')
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }))
    })
    expect(viewerActivateRotateHandle).toHaveBeenNthCalledWith(1, 'Y')
    expect(viewerActivateRotateHandle).toHaveBeenNthCalledWith(2, 'X')
    expect(viewerActivateRotateHandle).toHaveBeenNthCalledWith(3, 'Z')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })
    expect(useAppStore.getState().referenceWorkspace.activeTransformMode).toBe('scale')
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'x', bubbles: true }))
    })
    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'y', bubbles: true }))
    })
    expect(viewerActivateScaleHandle).toHaveBeenNthCalledWith(1, 'Z')
    expect(viewerActivateScaleHandle).toHaveBeenNthCalledWith(2, 'X')
    expect(viewerActivateScaleHandle).toHaveBeenNthCalledWith(3, 'Y')
  })

  it('reverts an uncommitted keyboard transform when switching modes and keeps it after Enter commit', async () => {
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
      position: { x: 0, y: 0, z: 0 },
    })
    expect(viewerSetReferenceTransformOverride).toHaveBeenCalled()
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalled()

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
    expect(viewerCompleteReferenceTransformDrag).toHaveBeenCalled()

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      rotationDeg: { x: 0, y: 33, z: 0 },
    })
  })

  it('cancels an active keyboard transform on Escape and restores the baseline', async () => {
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
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 9, y: 2, z: -3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 0, y: 0, z: 0 },
    })
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalled()
    expect(useConsoleStore.getState().entries.at(-1)?.text).toBe('Translate canceled')
  })

  it('cancels an uncommitted move when m is pressed a second time', async () => {
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
      position: { x: 0, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalled()
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(1)
    expect(moveSection?.className).not.toContain('isActive')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'm', bubbles: true }))
    })

    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(2)
    expect(moveSection?.className).toContain('isActive')
  })

  it('cancels uncommitted rotate and scale when r or s is pressed a second time', async () => {
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
      rotationDeg: { x: 0, y: 0, z: 0 },
    })
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalled()
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(viewerActivateRotateCenterHandle).toHaveBeenCalledTimes(1)
    expect(rotateSection?.className).not.toContain('isActive')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'r', bubbles: true }))
    })

    expect(viewerActivateRotateCenterHandle).toHaveBeenCalledTimes(2)
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
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(viewerActivateScaleCenterHandle).toHaveBeenCalledTimes(1)
    expect(scaleSection?.className).not.toContain('isActive')

    await act(async () => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 's', bubbles: true }))
    })

    expect(viewerActivateScaleCenterHandle).toHaveBeenCalledTimes(2)
    expect(scaleSection?.className).toContain('isActive')
  })

  it('highlights the matching xyz rows for keyboard transform targets', async () => {
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
    expect(getChannelBox('move-y')?.className).not.toContain('isHighlighted')
    expect(getChannelBox('move-z')?.className).not.toContain('isHighlighted')

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
    expect(getChannelBox('rotate-x')?.className).not.toContain('isHighlighted')
    expect(getChannelBox('rotate-y')?.className).not.toContain('isHighlighted')

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

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject(
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
    const labels = Array.from(container.querySelectorAll('.ParaSliderLabel')).map((node) =>
      node.textContent?.trim(),
    )
    const values = Array.from(container.querySelectorAll('.ParaSliderValue')).map((node) =>
      node.textContent?.trim(),
    )
    expect(labels[0]).toBe('-300.00')
    expect(values[0]).toBe('300.00')
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

  it('applies the active rotate snap interval to rotate axis stepping', async () => {
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

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject(
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

    const firstTrack = container.querySelector('.ReferenceTransformToolbar .ParaSliderTrack') as HTMLDivElement | null
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
