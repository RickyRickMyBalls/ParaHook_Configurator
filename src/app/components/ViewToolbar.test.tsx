// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const {
  frameAllCommandMock,
  frameSelectedCommandMock,
  setCameraPresetCommandMock,
  setProjectionModeCommandMock,
} = vi.hoisted(() => ({
  frameAllCommandMock: vi.fn(),
  frameSelectedCommandMock: vi.fn(),
  setCameraPresetCommandMock: vi.fn(),
  setProjectionModeCommandMock: vi.fn(),
}))

vi.mock('../viewCommands', () => ({
  frameAllCommand: frameAllCommandMock,
  frameSelectedCommand: frameSelectedCommandMock,
  setCameraPresetCommand: setCameraPresetCommandMock,
  setProjectionModeCommand: setProjectionModeCommandMock,
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

describe('ViewToolbar', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const originalWorker = globalThis.Worker

  beforeEach(async () => {
    vi.resetModules()
    frameAllCommandMock.mockReset()
    frameSelectedCommandMock.mockReset()
    setCameraPresetCommandMock.mockReset()
    setProjectionModeCommandMock.mockReset()
    globalThis.Worker = MockWorker as unknown as typeof Worker

    const { useAppStore } = await import('../store/useAppStore')
    const { useSpaghettiStore } = await import('../spaghetti/store/useSpaghettiStore')
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')

    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    useAppStore.setState({ selectedPartKey: 'part:object-1' })
    useUiPrefsStore.setState({ viewToolbarOpen: true })
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

  it('routes projection, camera preset, and framing through the shared view command owner seam', async () => {
    const { ViewToolbar } = await import('./ViewToolbar')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ViewToolbar />)
    })

    const perspectiveButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Perspective',
    )
    const topButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Top',
    )
    const frameButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Frame',
    )
    const frameAllButton = Array.from(container.querySelectorAll('button')).find(
      (button) => button.textContent === 'Frame All',
    )

    await act(async () => {
      perspectiveButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      topButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      frameButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      frameAllButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    })

    expect(setProjectionModeCommandMock).toHaveBeenCalledWith('perspective')
    expect(setCameraPresetCommandMock).toHaveBeenCalledWith('top')
    expect(frameSelectedCommandMock).toHaveBeenCalledWith('part:object-1')
    expect(frameAllCommandMock).toHaveBeenCalledTimes(1)
  })
})
