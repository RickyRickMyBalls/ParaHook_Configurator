// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getDefaultNodeParams } from '../spaghetti/registry/nodeRegistry'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { resetAudioSamplerStore, useAudioSamplerStore } from '../store/audioSamplerStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useConsoleStore } from './useConsoleStore'

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

describe('ConsoleDock', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  let ConsoleDock: typeof import('./ConsoleDock').ConsoleDock
  let useAppStore: typeof import('../store/useAppStore').useAppStore
  const originalWindowOpen = window.open
  const originalWorker = globalThis.Worker

  beforeEach(async () => {
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    resetAudioSamplerStore()
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    window.open = originalWindowOpen
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ useAppStore } = await import('../store/useAppStore'))
    useAppStore.setState(useAppStore.getInitialState(), true)
    ;({ ConsoleDock } = await import('./ConsoleDock'))
  })

  afterEach(async () => {
    if (root !== null) {
      const currentRoot = root
      await act(async () => {
        currentRoot.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
    window.open = originalWindowOpen
    globalThis.Worker = originalWorker
  })

  it('renders the collapsed console row and expands into the panel', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    expect(container.querySelector('.ConsoleBar')).not.toBeNull()
    expect(container.querySelector('.ConsolePanel')).toBeNull()

    const toggle = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsolePanel')).not.toBeNull()
  })

  it('enters the radio root from the console root and prefills the first radio action', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('radioRoot')
    expect(useConsoleStore.getState().inputText).toBe('On')
    expect(
      useConsoleStore.getState().entries.some((entry) =>
        entry.text ===
          'Radio > Choose next [On, Off, Url, SampleBurstTime, RandomizeSampleTimes, OpenToolbar, CloseToolbar]',
      ),
    ).toBe(true)
  })

  it('opens and closes the radio toolbar from the radio scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('OpenToolbar')
    })

    expect(useConsoleStore.getState().inputText).toBe('OpenToolbar')

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().isRadioToolbarOpen).toBe(true)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('radioRoot')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Radio toolbar opened'),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('CloseToolbar')
    })

    expect(useConsoleStore.getState().inputText).toBe('CloseToolbar')

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().isRadioToolbarOpen).toBe(false)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('radioRoot')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Radio toolbar closed'),
    ).toBe(true)
  })

  it('keeps accumulating guided typing so multi-letter radio aliases like OT can be entered from the input', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector('.ConsoleInput') as HTMLInputElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().inputText).toBe('On')

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'o', bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().inputText).toBe('o')

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 't', bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('ot')
    })

    expect(useConsoleStore.getState().inputText).toBe('ot')

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().isRadioToolbarOpen).toBe(true)
  })

  it('accepts a custom radio url prompt, turns radio on, and returns to the radio scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('u')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('radio.url')
    expect(useConsoleStore.getState().inputText).toBe('https://soundcloud.com/keota-us/gusano')

    await act(async () => {
      useConsoleStore.getState().setInputText('https://soundcloud.com/example/new-track')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('radioRoot')
    expect(useAudioSamplerStore.getState().isRadioEnabled).toBe(true)
    expect(useAudioSamplerStore.getState().sourceUrl).toBe(
      'https://soundcloud.com/example/new-track',
    )
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Radio on'),
    ).toBe(true)
  })

  it('accepts a sample burst time prompt and returns to the radio scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sb')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('radio.sampleBurstTime')
    expect(useConsoleStore.getState().inputText).toBe('0.1')

    await act(async () => {
      useConsoleStore.getState().setInputText('0.25')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('radioRoot')
    expect(useAudioSamplerStore.getState().sampleBurstTime).toBe(0.25)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Sample burst time: 0.25'),
    ).toBe(true)
  })

  it('returns to root after radio on is accepted', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAudioSamplerStore.getState().setSampleBurstTime(0.25)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('o')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(useConsoleStore.getState().inputText).toBe('Graph')
    expect(useAudioSamplerStore.getState().isRadioEnabled).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Radio on'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) => entry.text === 'Radio url: https://soundcloud.com/keota-us/gusano',
        ),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Sample burst time: 0.25'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Root > Choose next [Graph, Radio]'),
    ).toBe(true)
  })

  it('returns to root after radio off is accepted', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAudioSamplerStore.getState().turnRadioOn()
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('off')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(useConsoleStore.getState().inputText).toBe('Graph')
    expect(useAudioSamplerStore.getState().isRadioEnabled).toBe(false)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Radio off'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Root > Choose next [Graph, Radio]'),
    ).toBe(true)
  })

  it('tracks canonical radio command identities for the radio url flow', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('u')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('https://soundcloud.com/example/identity-test')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const keys = Object.keys(useAudioSamplerStore.getState().samplePositionByCommandId)

    expect(keys).toContain('Console.Root.Radio')
    expect(keys).toContain('Console.Radio.Url')
    expect(keys).toContain('Console.Radio.Url.PromptSubmit')
    expect(keys.some((key) => key.startsWith('staged:'))).toBe(false)
    expect(keys.some((key) => key.startsWith('prompt:'))).toBe(false)
    expect(keys.some((key) => key.startsWith('flat:'))).toBe(false)
    expect(keys.some((key) => key.startsWith('invalid:'))).toBe(false)
  })

  it('reuses one canonical prompt-submit identity even when url submit values change', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('u')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('https://soundcloud.com/example/first-submit')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const firstPromptSubmitPosition =
      useAudioSamplerStore.getState().samplePositionByCommandId['Console.Radio.Url.PromptSubmit']

    await act(async () => {
      useConsoleStore.getState().setInputText('u')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('https://soundcloud.com/example/second-submit')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const secondPromptSubmitPosition =
      useAudioSamplerStore.getState().samplePositionByCommandId['Console.Radio.Url.PromptSubmit']

    expect(firstPromptSubmitPosition).toBeDefined()
    expect(secondPromptSubmitPosition).toBe(firstPromptSubmitPosition)
    expect(
      Object.keys(useAudioSamplerStore.getState().samplePositionByCommandId).filter(
        (key) => key === 'Console.Radio.Url.PromptSubmit',
      ),
    ).toHaveLength(1)
  })

  it('publishes a radio burst request when a url prompt submit turns radio on', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('r')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('u')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('https://soundcloud.com/example/phase4-url')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Radio.Url.PromptSubmit',
      sourceUrl: 'https://soundcloud.com/example/phase4-url',
      sampleBurstTime: 0.1,
      triggerKind: 'enter',
    })
  })

  it('publishes burst requests for newly highlighted staged choices when radio is enabled', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAudioSamplerStore.getState().turnRadioOn()
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Extrude',
      triggerKind: 'arrowDown',
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch',
      triggerKind: 'arrowUp',
    })
  })

  it('publishes burst requests when ArrowUp and ArrowDown are pressed from the focused console input', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAudioSamplerStore.getState().turnRadioOn()
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector('.ConsoleInput') as HTMLInputElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Extrude',
      triggerKind: 'arrowDown',
    })

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch',
      triggerKind: 'arrowUp',
    })
  })

  it('publishes burst requests for sketch plane feature assist choices and deeper sketch plane scopes', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAudioSamplerStore.getState().turnRadioOn()
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector('.ConsoleInput') as HTMLInputElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('sp')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().inputText).toBe('XY')

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch.Plane.XZ',
      triggerKind: 'arrowDown',
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch.Plane.XZ',
      triggerKind: 'enter',
    })
    expect(useConsoleStore.getState().inputText).toBe('Move')

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch.Plane.Rotate',
      triggerKind: 'arrowDown',
    })
  })

  it('keeps staged arrow cycling silent when radio is off', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toBeNull()
  })

  it('submits typed input from the bar and keeps clear disabled in the panel', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('help')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> help')).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text.includes('help')),
    ).toBe(true)

    const toggle = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null
    await act(async () => {
      toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsoleTranscript')?.textContent).toContain('[commands.user]')
    expect(container.querySelector('.ConsoleTranscript')?.textContent).toContain('[commands.system]')

    const clear = Array.from(container.querySelectorAll('.ConsolePanelAction')).find(
      (button) => button.textContent === 'Clear',
    ) as HTMLButtonElement | undefined

    expect(clear?.disabled).toBe(true)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> help')).toBe(true)
  })

  it('can expand the console by dragging up from the bottom bar', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const resizeHandle = container.querySelector('.ConsoleBarResizeHandle') as HTMLDivElement | null

    await act(async () => {
      resizeHandle?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: 200 }))
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientY: 120 }))
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientY: 120 }))
    })

    expect(container.querySelector('.ConsolePanel')).not.toBeNull()
    expect(useConsoleStore.getState().isExpanded).toBe(true)
  })

  it('lets the collapsed bar divider widen the summary area', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const divider = container.querySelector('.ConsoleBarDivider') as HTMLDivElement | null
    const bar = container.querySelector('.ConsoleBar') as HTMLDivElement | null
    expect(divider).not.toBeNull()
    expect(bar).not.toBeNull()
    if (bar === null) {
      throw new Error('Expected console bar')
    }

    bar.getBoundingClientRect = () =>
      ({
        left: 0,
        top: 0,
        right: 720,
        bottom: 34,
        width: 720,
        height: 34,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }) as DOMRect

    await act(async () => {
      divider?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true, clientX: 360 }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: 520 }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, cancelable: true, clientX: 520 }),
      )
    })

    expect(useConsoleStore.getState().summaryWidth).toBe(508)
    expect(bar.style.gridTemplateColumns).toContain('508px')
  })

  it('toggles the hidden console tools menu from the header info button', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsoleToolbarMenu')).toBeNull()

    const info = container.querySelector(
      'button[aria-label="Show console tools"]',
    ) as HTMLButtonElement | null
    expect(info?.classList.contains('isActive')).toBe(false)

    await act(async () => {
      info?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsoleToolbarMenu')).not.toBeNull()
    expect(container.querySelectorAll('.ConsoleToolbarMenu .ParaSlider')).toHaveLength(4)
    expect(container.querySelectorAll('.ConsoleToolbarMenu .ParaSelect')).toHaveLength(3)
    expect(
      Array.from(container.querySelectorAll('.ConsoleToolbarMenu .ParaSelectLabel')).some(
        (label) => label.textContent === 'Preset',
      ),
    ).toBe(true)
    expect(info?.classList.contains('isActive')).toBe(true)
  })

  it('applies the clear preset from the console tools preset selector', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const info = container.querySelector(
      'button[aria-label="Show console tools"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      info?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const selects = Array.from(
      container.querySelectorAll('.ConsoleToolbarMenu .ParaSelectNative'),
    ) as HTMLSelectElement[]
    const presetSelect = selects[0]

    await act(async () => {
      presetSelect.value = 'clear'
      presetSelect.dispatchEvent(new Event('change', { bubbles: true }))
    })

    expect(useConsoleStore.getState().backgroundOpacity).toBe(10)
    expect(useConsoleStore.getState().backgroundFillMode).toBe('flat')
  })

  it('applies the shared console font-size variable from the tools state', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      useConsoleStore.getState().setFontSize(18)
    })

    const dock = container.querySelector('.ConsoleDock') as HTMLDivElement | null
    expect(dock?.style.getPropertyValue('--console-font-size')).toBe('18px')
  })

  it('toggles the layer toolbar from the header T button', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsoleLayerToggles')).not.toBeNull()

    const toolbarToggle = container.querySelector(
      'button[aria-label="Hide console layer toolbar"]',
    ) as HTMLButtonElement | null
    expect(toolbarToggle?.classList.contains('isActive')).toBe(true)

    await act(async () => {
      toolbarToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsoleLayerToggles')).toBeNull()
    expect(toolbarToggle?.classList.contains('isActive')).toBe(false)
  })

  it('shows the 4.1D view, browser, and transforms layer buttons', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const layerLabels = Array.from(container.querySelectorAll('.ConsoleLayerToggle')).map(
      (button) => button.textContent,
    )

    expect(layerLabels).toContain('View')
    expect(layerLabels).toContain('Browser')
    expect(layerLabels).toContain('Transforms')
  })

  it('supports isolate mode and diagnostics pin in the transcript filters', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().appendEntry({
        layer: 'Browser',
        text: 'Browser event',
        source: 'test',
      })
      useConsoleStore.getState().appendEntry({
        layer: 'Diagnostics',
        text: 'Diagnostics event',
        source: 'test',
        severity: 'warn',
      })
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setFilterMode('isolate')
      useConsoleStore.getState().setIsolatedLayer('Browser')
    })

    expect(container.querySelector('.ConsoleTranscript')?.textContent).toContain('Browser event')
    expect(container.querySelector('.ConsoleTranscript')?.textContent).not.toContain('Diagnostics event')

    await act(async () => {
      useConsoleStore.getState().setDiagnosticsPinned(true)
    })

    expect(container.querySelector('.ConsoleTranscript')?.textContent).toContain('Diagnostics event')
  })

  it('hides the full console chrome and leaves only the floating toggle', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const info = container.querySelector(
      'button[aria-label="Show console tools"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      info?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsolePanelHeader')).not.toBeNull()
    expect(container.querySelector('.ConsoleToolbarMenu')).not.toBeNull()
    expect(container.querySelector('.ConsoleLayerToggles')).not.toBeNull()

    const chromeToggle = container.querySelector(
      'button[aria-label="Hide console chrome"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      chromeToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container.querySelector('.ConsolePanelHeader')).toBeNull()
    expect(container.querySelector('.ConsoleToolbarMenu')).toBeNull()
    expect(container.querySelector('.ConsoleLayerToggles')).toBeNull()
    expect(
      container.querySelector('button[aria-label="Show console chrome"]'),
    ).not.toBeNull()
  })

  it('switches into floating mode from the header float button', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const floatButton = container.querySelector(
      'button[aria-label="Float console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      floatButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(container.querySelector('.ConsoleFloatingWindow')).not.toBeNull()
    expect(container.querySelector('.ConsoleDock--floatingOwner > .ConsolePanel')).toBeNull()
  })

  it('opens pop-out mode and keeps only the collapsed row in the main shell', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const popoutDocument = document.implementation.createHTMLDocument('Console Popout')
    let beforeUnloadHandler: EventListener | null = null
    let isPopoutClosed = false
    const popoutWindow = {
      get closed() {
        return isPopoutClosed
      },
      document: popoutDocument,
      focus: () => undefined,
      close: () => {
        isPopoutClosed = true
      },
      addEventListener: (name: string, handler: EventListenerOrEventListenerObject) => {
        if (name === 'beforeunload' && typeof handler === 'function') {
          beforeUnloadHandler = handler
        }
      },
      removeEventListener: () => undefined,
    } as unknown as Window

    window.open = (() => popoutWindow) as typeof window.open

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const popButton = container.querySelector(
      'button[aria-label="Pop out console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      popButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().windowMode).toBe('popout')
    expect(container.querySelector('.ConsoleDock--popoutOwner .ConsolePanel')).toBeNull()
    expect(container.querySelector('.ConsoleDock--popoutOwner .ConsoleBar')).not.toBeNull()
    expect(popoutDocument.querySelector('.ConsoleDock--popoutSurface')).not.toBeNull()

    await act(async () => {
      beforeUnloadHandler?.(new Event('beforeunload'))
    })

    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isExpanded).toBe(false)
  })

  it('switches on the list overlay without collapsing an already-expanded docked console', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock listLeftOffset={320} />)
    })

    await act(async () => {
      useConsoleStore.getState().appendEntry({
        layer: 'Worker',
        text: 'Build started',
        source: 'list-test',
      })
    })

    const expand = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      expand?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const listButton = container.querySelector(
      'button[aria-label="Show console list mode"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      listButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const listView = container.querySelector('.ConsoleListView') as HTMLDivElement | null

    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isListMode).toBe(true)
    expect(useConsoleStore.getState().isExpanded).toBe(true)
    expect(container.querySelector('.ConsolePanel')).not.toBeNull()
    expect(container.querySelector('.ConsoleBar')).not.toBeNull()
    expect(listView).not.toBeNull()
    expect(listView?.style.left).toBe('320px')
    expect(listView?.textContent).toContain('Build started')
  })

  it('lets list mode drag up the bottom bar to show the expanded console without leaving list mode', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock listLeftOffset={320} />)
    })

    await act(async () => {
      useConsoleStore.getState().appendEntry({
        layer: 'Worker',
        text: 'Build started',
        source: 'list-drag-test',
      })
      useConsoleStore.getState().switchToList()
    })

    const resizeHandle = container.querySelector('.ConsoleBarResizeHandle') as HTMLDivElement | null

    await act(async () => {
      resizeHandle?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: 200 }))
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientY: 120 }))
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientY: 120 }))
    })

    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isListMode).toBe(true)
    expect(useConsoleStore.getState().isExpanded).toBe(true)
    expect(container.querySelector('.ConsolePanel')).not.toBeNull()
    expect(container.querySelector('.ConsoleListView')).not.toBeNull()
  })

  it('turns off the list overlay in docked mode without collapsing the expanded console', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock listLeftOffset={320} />)
    })

    await act(async () => {
      useConsoleStore.getState().appendEntry({
        layer: 'Worker',
        text: 'Build started',
        source: 'list-active-test',
      })
      useConsoleStore.getState().switchToList()
    })

    const resizeHandle = container.querySelector('.ConsoleBarResizeHandle') as HTMLDivElement | null

    await act(async () => {
      resizeHandle?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientY: 200 }))
      window.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientY: 120 }))
      window.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientY: 120 }))
    })

    const listButton = container.querySelector(
      'button[aria-label="Show console list mode"]',
    ) as HTMLButtonElement | null

    expect(listButton?.classList.contains('isActive')).toBe(true)
    expect(container.querySelector('.ConsolePanel')).not.toBeNull()

    await act(async () => {
      listButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(useConsoleStore.getState().isListMode).toBe(false)
    expect(useConsoleStore.getState().isExpanded).toBe(true)
    expect(container.querySelector('.ConsolePanel')).not.toBeNull()
    const nextListButton = container.querySelector(
      'button[aria-label="Show console list mode"]',
    ) as HTMLButtonElement | null
    expect(nextListButton?.classList.contains('isActive')).toBe(false)
    expect(container.querySelector('.ConsoleListView')).toBeNull()
  })

  it('keeps the floating console open when the list button is clicked on from a floating console', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock listLeftOffset={320} />)
      useConsoleStore.getState().switchToFloating()
      useConsoleStore.getState().switchToList()
    })

    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().isListMode).toBe(true)
    expect(container.querySelector('.ConsoleFloatingWindow')).not.toBeNull()
    expect(container.querySelector('.ConsoleListView')).not.toBeNull()

    await act(async () => {
      const listButton = container?.querySelector(
        '.ConsoleFloatingWindow button[aria-label="Show console list mode"]',
      ) as HTMLButtonElement | null
      listButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().windowMode).toBe('floating')
    expect(useConsoleStore.getState().isListMode).toBe(false)
    expect(container.querySelector('.ConsoleFloatingWindow')).not.toBeNull()
    expect(container.querySelector('.ConsoleListView')).toBeNull()
  })

  it('renders the list overlay in the main viewport while pop-out mode stays open in the child window', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const popoutDocument = document.implementation.createHTMLDocument('Console Popout')
    let isPopoutClosed = false
    const popoutWindow = {
      get closed() {
        return isPopoutClosed
      },
      document: popoutDocument,
      focus: () => undefined,
      close: () => {
        isPopoutClosed = true
      },
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    } as unknown as Window

    window.open = (() => popoutWindow) as typeof window.open

    await act(async () => {
      root?.render(<ConsoleDock listLeftOffset={320} />)
      useConsoleStore.getState().switchToPopout()
      useConsoleStore.getState().switchToList()
    })

    expect(useConsoleStore.getState().windowMode).toBe('popout')
    expect(useConsoleStore.getState().isListMode).toBe(true)
    expect(container.querySelector('.ConsoleListView')).not.toBeNull()
    expect(popoutDocument.querySelector('.ConsoleListView')).toBeNull()
    expect(popoutDocument.querySelector('.ConsoleDock--popoutSurface')).not.toBeNull()
  })

  it('focuses the console from slash and recalls command history with arrow keys', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true }),
      )
    })

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null
    expect(document.activeElement).toBe(input)

    await act(async () => {
      useConsoleStore.getState().setInputText('help')
    })

    await act(async () => {
      input?.closest('form')?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: '/', bubbles: true, cancelable: true }),
      )
    })

    const refocusedInput = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      refocusedInput?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Radio')
  })

  it('auto-captures printable typing into the console without slash', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }),
      )
    })

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null
    expect(document.activeElement).toBe(input)
    expect(useConsoleStore.getState().inputText).toBe('b')
  })

  it('does not steal typing from protected text inputs during hybrid capture', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const paramInput = document.createElement('input')
    document.body.appendChild(paramInput)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    paramInput.focus()

    await act(async () => {
      paramInput.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'm', bubbles: true, cancelable: true }),
      )
    })

    expect(document.activeElement).toBe(paramInput)
    expect(useConsoleStore.getState().inputText).toBe('Graph')
  })

  it('does not auto-capture a global space key into the console', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Sketch')
  })

  it('replaces sketch draw feature-assist prefill from global printable typing and keeps subsequent typing manual', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('b')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'a', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('ba')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })

  it('auto-captures printable keys into the console while sketch-plane pick is active', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('b')
  })

  it('resumes flat console capture after sketch draw ends', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('b')

    await act(async () => {
      useSpaghettiStore.getState().closeGeometrySketchSession()
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('bb')
  })

  it('runs narrow-core typed commands and reports unknown commands strictly', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('status')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text.includes('Status: spaghetti preview active')),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('mirror')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const lastEntry = useConsoleStore.getState().entries.at(-1)
    expect(lastEntry?.layer).toBe('Diagnostics')
    expect(lastEntry?.text).toBe('Unknown command: mirror')
  })

  it('treats m as typed-first command entry and resolves it on submit', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'm', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('m')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().inputText).toBe('')
    expect(useConsoleStore.getState().commandHistory.at(-1)).toBe('m')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> m')).toBe(true)
  })

  it('routes temporary x through the sketch-plane cancel path while a pick session is active', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toBeNull()
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> x')).toBe(true)
  })

  it('selects the sketch plane from typed XY without requiring slash capture first', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'x', bubbles: true, cancelable: true }),
      )
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'y', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('xy')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      draftPlane: 'XY',
      stage: 'adjust',
      adjustScope: 'root',
    })
    expect(useConsoleStore.getState().inputText).toBe('Move')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> xy')).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Sketch plane selected: XY'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text === 'Sketch Plane > [Move, Rotate, Done, ConfirmToSketch, Back]',
        ),
    ).toBe(true)
  })

  it('advances sketch plane assist into move choices after move is submitted', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    })

    expect(useConsoleStore.getState().inputText).toBe('Move')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'move',
      draftPlane: 'XZ',
      gizmoMode: 'translate',
    })
    expect(useConsoleStore.getState().inputText).toBe('0.0,0.0,0.0')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Vec3(0.0, 0.0, 0.0)',
    )
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text ===
            'Sketch Plane > Move > [Vec3(0.0, 0.0, 0.0), Move Again, Move X, Move Y, Move Z, Snap, Back]',
        ),
    ).toBe(true)
  })

  it('treats m as move again inside sketch-plane move scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 12)
      useSpaghettiStore.getState().acceptActiveSketchPlaneTransformCommand()
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('y', 7)
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('m')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      adjustScope: 'move',
      activeTransformAxis: 'free',
      draftTransform: {
        translation: { x: 12, y: 7, z: 0 },
      },
      transformCommandOrigin: {
        translation: { x: 12, y: 7, z: 0 },
      },
    })
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text ===
            'Sketch Plane > Move > [Vec3(12.0, 7.0, 0.0), Move Again, Move X, Move Y, Move Z, Snap, Back]',
        ),
    ).toBe(true)
  })

  it('accepts bare axis shortcuts in sketch-plane move scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 18)
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      stage: 'adjust',
      adjustScope: 'move-axis',
      activeTransformAxis: 'x',
      gizmoMode: 'translate',
      draftTransform: {
        offsetMm: 0,
        translation: { x: 18, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
    })
    expect(useConsoleStore.getState().inputText).toBe('18.0')
  })

  it('accepts a move-axis float submit and returns to move', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
      useSpaghettiStore.getState().runSketchPlaneCommand('move-x')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('.1')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      stage: 'adjust',
      adjustScope: 'move',
      activeTransformAxis: 'free',
      draftTransform: {
        translation: { x: 0.1, y: 0, z: 0 },
      },
    })
    expect(useConsoleStore.getState().inputText).toBe('0.1,0.0,0.0')
  })

  it('requires confirm or deny before applying an off-snap move-axis value', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
      useSpaghettiStore.getState().runSketchPlaneCommand('move-x')
      useUiPrefsStore.getState().setSketchPlaneToolbarTranslateSnapEnabled(true)
      useUiPrefsStore.getState().setSketchPlaneToolbarTranslateSnapValue(1)
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('0.3')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      adjustScope: 'move-axis',
      activeTransformAxis: 'x',
      pendingMoveAxisOffSnapConfirmation: {
        axis: 'x',
        value: 0.3,
        literal: '0.3',
      },
      draftTransform: {
        translation: { x: 0, y: 0, z: 0 },
      },
    })
    expect(useConsoleStore.getState().inputText).toBe('confirm')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      adjustScope: 'move',
      activeTransformAxis: 'free',
      draftTransform: {
        translation: { x: 0.3, y: 0, z: 0 },
      },
    })
    expect(useConsoleStore.getState().inputText).toBe('0.3,0.0,0.0')
  })

  it('accepts the live vec3 move choice and returns to sketch-plane adjust root', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('x', 12.5)
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('y', -7)
      useSpaghettiStore.getState().setSketchPlanePickTranslationAxis('z', 42)
    })

    expect(useConsoleStore.getState().inputText).toBe('12.5,-7.0,42.0')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      stage: 'adjust',
      adjustScope: 'root',
      draftPlane: 'XZ',
    })
    expect(useConsoleStore.getState().inputText).toBe('Move')
  })

  it('enters move snap, accepts a float, and returns to move with snap enabled', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('snap')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession?.adjustScope).toBe('move-snap')
    expect(useConsoleStore.getState().inputText).toBe('10.0')

    await act(async () => {
      useConsoleStore.getState().setInputText('4.5')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useUiPrefsStore.getState().sketchPlaneToolbarTranslateSnapEnabled).toBe(true)
    expect(useUiPrefsStore.getState().sketchPlaneToolbarTranslateSnapValue).toBe(4.5)
    expect(useSpaghettiStore.getState().sketchPlanePickSession?.adjustScope).toBe('move')
    expect(useConsoleStore.getState().inputText).toBe('0.0,0.0,0.0')
  })

  it('uses done to finish sketch plane and return to the selected sketch scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      useSpaghettiStore.getState().setSelectedNodeId('node-sketch-1')
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('done')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toBeNull()
    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
    const sketch = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')
      ?.params.sketch as { plane: string }
    expect(sketch.plane).toBe('XZ')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]'),
    ).toBe(true)
  })

  it('shows a vec3-first rotate prompt and accepts the live rotation choice', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('rotate')
      useSpaghettiStore.getState().setSketchPlanePickRotationAxis('x', 15)
      useSpaghettiStore.getState().setSketchPlanePickRotationAxis('y', -10)
      useSpaghettiStore.getState().setSketchPlanePickRotationAxis('z', 25)
    })

    expect(useConsoleStore.getState().inputText).toBe('15.0,-10.0,25.0')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Vec3(15.0, -10.0, 25.0)',
    )
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text ===
            'Sketch Plane > Rotate > [Vec3(0.0, 0.0, 0.0), Rotate X, Rotate Y, Rotate Z, Snap, Back]',
        ),
    ).toBe(true)

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      stage: 'adjust',
      adjustScope: 'root',
      draftPlane: 'XZ',
      draftTransform: {
        rotationDeg: { x: 15, y: -10, z: 25 },
      },
    })
    expect(useConsoleStore.getState().inputText).toBe('Move')
  })

  it('uses confirmtosketch to confirm sketch plane and auto-enter sketch draw', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      useSpaghettiStore.getState().setSelectedNodeId('node-sketch-1')
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('YZ')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('confirmtosketch')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toBeNull()
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      drawStage: 'sessionIdle',
    })
    const sketch = useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')
      ?.params.sketch as { plane: string }
    expect(sketch.plane).toBe('YZ')
  })

  it('accepts bare axis shortcuts in sketch-plane rotate scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('rotate')
      useSpaghettiStore.getState().setSketchPlanePickRotationAxis('z', 60)
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      stage: 'adjust',
      adjustScope: 'rotate',
      activeTransformAxis: 'z',
      gizmoMode: 'rotate',
      draftTransform: {
        offsetMm: 0,
        translation: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        inPlaneRotationDeg: 0,
      },
    })
  })

  it('uses sketch-plane esc to return from adjust to plane selection without cancelling the session', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('esc')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'pick',
      draftPlane: 'XZ',
    })
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> esc')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Sketch Plane > [XY, XZ, YZ]'),
    ).toBe(true)
  })

  it('shows richer sketch draw prompts when pline is submitted from the console', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('pline')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const texts = useConsoleStore.getState().entries.map((entry) => entry.text)
    expect(texts).toContain('> pline')
    expect(texts).toContain('PLINE Specify point 1:')
  })

  it('accepts l as a sketch-local alias for line on submit', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSessionTool('pline')
      useConsoleStore.getState().setInputText('l')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession?.activeTool).toBe('line')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> l')).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'LINE Specify point 1:'),
    ).toBe(true)
  })

  it('accepts typed vec2 submissions during an active Line command and returns to idle after the second point', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useConsoleStore.getState().setInputText('line')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('1,1')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('5,5')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: null,
      lastUsedTool: 'line',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(
      (useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')
        ?.params.sketch as { components: Array<{ type: string }> }).components,
    ).toHaveLength(1)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> 1,1')).toBe(true)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> 5,5')).toBe(true)
  })

  it('accepts typed vec2 submissions during an active Rectangle command and returns to idle after the second point', async () => {
    const rectangleNodeId = 'node-sketch-rect-1'
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: rectangleNodeId,
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession(rectangleNodeId, 'draw')
      useConsoleStore.getState().setInputText('rec')
    })

    const submit = async () => {
      await act(async () => {
        const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })
    }

    await submit()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'rectangle',
      lastUsedTool: 'rectangle',
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('2,3')
    })
    await submit()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'rectangle',
      lastUsedTool: 'rectangle',
      drawStage: 'draftActive',
      drawDraft: {
        points: [{ x: 2, y: 3 }],
      },
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('12,15')
    })
    await submit()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(
      (useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === rectangleNodeId)
        ?.params.sketch as { components: Array<{ type: string }> }).components,
    ).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'rectangle',
        }),
      ]),
    )
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> rec')).toBe(true)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> 2,3')).toBe(true)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> 12,15')).toBe(true)
  })

  it('accepts typed radius submissions during an active Circle command and returns to idle after commit', async () => {
    const circleNodeId = 'node-sketch-circle-1'
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: circleNodeId,
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession(circleNodeId, 'draw')
      useConsoleStore.getState().setInputText('cc')
    })

    const submit = async () => {
      await act(async () => {
        const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })
    }

    await submit()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'circle',
      lastUsedTool: 'circle',
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('2,3')
    })
    await submit()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'circle',
      lastUsedTool: 'circle',
      drawStage: 'draftActive',
      drawDraft: {
        points: [{ x: 2, y: 3 }],
      },
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('6')
    })
    await submit()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(
      (useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === circleNodeId)
        ?.params.sketch as {
          components: Array<{
            type: string
            center?: { kind?: string; x: number; y: number }
            edge?: { kind?: string; x: number; y: number }
          }>
        }).components,
    ).toMatchObject([
      {
        type: 'circle',
        center: { kind: 'lit', x: 2, y: 3 },
        edge: { kind: 'lit', x: 8, y: 3 },
      },
    ])
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> cc')).toBe(true)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> 2,3')).toBe(true)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> 6')).toBe(true)
  })

  it('accepts del in idle sketch draw and deletes the selected entity set', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                components: [
                  {
                    rowId: 'row-line-1',
                    componentId: 'cmp-line-1',
                    type: 'line',
                    a: { kind: 'lit', x: 0, y: 0 },
                    b: { kind: 'lit', x: 10, y: 0 },
                  },
                ],
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSelectedComponents(['row-line-1'])
      useConsoleStore.getState().setInputText('del')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      selectedComponentIds: [],
    })
    expect(
      (useSpaghettiStore.getState().graph.nodes.find((node) => node.nodeId === 'node-sketch-1')
        ?.params.sketch as { components: Array<{ type: string }> }).components,
    ).toHaveLength(0)
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> del')).toBe(true)
  })

  it('re-arms the last draw tool when enter is pressed again from idle sketch draw', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSessionTool('pline')
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 1, y: 1 }, null)
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 5, y: 5 }, null)
    })

    const submit = async () => {
      await act(async () => {
        const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })
    }

    await act(async () => {
      useConsoleStore.getState().setInputText('')
    })
    await submit()

    expect(useConsoleStore.getState().inputText).toBe('PLine')

    await act(async () => {
      useConsoleStore.getState().setInputText('')
    })
    await submit()

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'pline',
      lastUsedTool: 'pline',
      drawStage: 'toolSelected',
      drawDraft: {
        points: [],
        hoverPoint: null,
        hoverSnapTarget: null,
      },
    })
    expect(useConsoleStore.getState().entries.filter((entry) => entry.text === '> enter')).toHaveLength(2)
  })

  it('publishes live draw target status in the top feature-assist breadcrumb while a tool is active', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
      useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 1.5, y: -2.25 }, null)
    })

    expect(useConsoleStore.getState().featureAssistDescriptor).toMatchObject({
      breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'L', 'P1', 'Vec(1.5,-2.25)'],
      choices: [],
      prefill: null,
    })
  })

  it('publishes the circle center and radius breadcrumb flow while Circle is active', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSessionTool('circle')
      useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 1.5, y: -2.25 }, null)
    })

    expect(useConsoleStore.getState().featureAssistDescriptor).toMatchObject({
      breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'Circle', 'Center', 'Vec(1.5,-2.25)'],
      choices: [],
      prefill: null,
    })

    await act(async () => {
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 1.5, y: -2.25 }, null)
      useSpaghettiStore.getState().setGeometrySketchDrawHoverPoint({ x: 4.5, y: -2.25 }, null)
    })

    expect(useConsoleStore.getState().featureAssistDescriptor).toMatchObject({
      breadcrumb: [
        'Graph',
        'Sketch',
        'Sketch Draw',
        'Circle',
        'Center Vec(1.5,-2.25)',
        'Radius',
        'Float(3)',
      ],
      choices: [],
      prefill: null,
    })
  })

  it('does not re-enter guided root after the first committed draw point', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')
    })

    expect(useConsoleStore.getState().inputText).not.toBe('Graph')
    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useConsoleStore.getState().featureAssistDescriptor).toMatchObject({
      breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'L', 'P2', 'Vec(0,0)'],
      choices: [],
      prefill: null,
    })
  })

  it('uses esc in sketch draw to cancel the active tool back to session idle', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 0, y: 0 }, 'origin')
      useConsoleStore.getState().setInputText('esc')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).not.toBeNull()
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      lastUsedTool: 'line',
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(useConsoleStore.getState().entries.filter((entry) => entry.text === '> esc')).toHaveLength(1)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Sketch Draw > [Line, PLine, Rectangle, Circle, Previous, X]'),
    ).toBe(true)
  })

  it('uses back to return one sketch level inside sketch draw and sketch plane sessions', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
      useSpaghettiStore.getState().setGeometrySketchSessionTool('line')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('back')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> back')).toBe(true)

    await act(async () => {
      useSpaghettiStore.getState().closeGeometrySketchSession()
      useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('b')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'pick',
      draftPlane: 'XZ',
    })
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> b')).toBe(true)
  })

  it('keeps SketchDraw open when esc is submitted from session idle', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('esc')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
      activeTool: null,
      drawStage: 'sessionIdle',
      drawDraft: null,
    })
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> esc')).toBe(true)
  })

  it('reports the named SketchDraw stage in console status output', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('node-sketch-1', 'draw')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('status')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text.includes('Draw Sketch Session Idle') &&
            entry.text.includes('tool=none'),
        ),
    ).toBe(true)
  })

  it('starts a staged graph session, auto-selects the only graph, and shows next choices', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> g')).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Graph'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Auto-selected graph_[1]',
      ),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)
  })

  it('lets enter chain through an assisted staged prefill without re-focusing manually', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector('input[aria-label="Console input"]') as HTMLInputElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch')
    expect(document.activeElement).toBe(input)
    expect(input?.selectionStart).toBe('Sketch'.length)
    expect(input?.selectionEnd).toBe('Sketch'.length)

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Select > Graph > graph_[1] > Sketch > sketch_[1]',
      ),
    ).toBe(true)
  })

  it('opens a spaghetti editor viewport when graph root is entered and none exists yet', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const state = useSpaghettiStore.getState()
    expect(state.activeEditorViewportId.length).toBeGreaterThan(0)
    expect(state.editorViewportsById[state.activeEditorViewportId]).toBeDefined()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useAppStore.getState().floatingShellActivationRequest?.target).toBe('spaghetti')
    expect(useAppStore.getState().workspaceSelection.activeSurface).toBe('spaghetti')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-1',
    })
  })

  it('reopens the spaghetti editor when graph root is entered from meatball mode', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      if (viewportId === null) {
        throw new Error('Expected graph viewport to open')
      }
      useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId, 'meatball editor view')
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const state = useSpaghettiStore.getState()
    expect(state.editorViewportsById[state.activeEditorViewportId]?.windowMode).toBe('expanded')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
  })

  it('keeps staged navigation active and scoped after invalid tokens', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('graph')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('q')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Invalid token for current scope: q'),
    ).toBe(true)
  })

  it('executes graph editor essentials mode from staged navigation', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      const viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      if (viewportId === null) {
        throw new Error('Expected graph viewport to open')
      }
      useSpaghettiStore.getState().setEditorViewportPresentationMode(viewportId, 'expanded')
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('es')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const state = useSpaghettiStore.getState()
    const editorViewportId = state.activeEditorViewportId
    expect(state.editorViewportsById[editorViewportId]?.windowMode).toBe('expanded')
    expect(state.editorViewportHeaderCollapsedById[editorViewportId]).toBe(true)
    expect(state.editorViewportCanvasToolbarVisibleById[editorViewportId]).toBe(false)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Editor mode: Essentials'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)
  })

  it('uses b to go back one level from graph selected scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')

    await act(async () => {
      useConsoleStore.getState().setInputText('b')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphRoot')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Graph'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Graph > Choose next [graph_[1], List]'),
    ).toBe(true)
  })

  it('uses b to return directly to graph scope from a selected sketch node', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
          {
            nodeId: 'node-sketch-2',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-2',
                plane: 'XY',
                components: [],
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchList')

    await act(async () => {
      useConsoleStore.getState().setInputText('1')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-sketch-1')

    await act(async () => {
      useConsoleStore.getState().setInputText('b')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useSpaghettiStore.getState().selectedNodeId).toBeNull()
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-1',
    })
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)
  })

  it('creates a sketch node when graph sketch scope is empty and continues into that sketch', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const sketchNodes = useSpaghettiStore
      .getState()
      .graph.nodes.filter((node) => node.type === 'Geometry/Sketch')

    expect(sketchNodes).toHaveLength(1)
    expect(useSpaghettiStore.getState().selectedNodeId).toBe(sketchNodes[0]?.nodeId ?? null)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Created sketch_[1]'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Auto-selected sketch_[1]'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]',
      ),
    ).toBe(true)
  })

  it('creates an extrude node when graph extrude scope is empty and continues into that node', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('e')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const extrudeNodes = useSpaghettiStore
      .getState()
      .graph.nodes.filter((node) => node.type === 'Geometry/Extrude')

    expect(extrudeNodes).toHaveLength(1)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphExtrudeSelected')
    expect(useSpaghettiStore.getState().selectedNodeId).toBe(extrudeNodes[0]?.nodeId ?? null)
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: extrudeNodes[0]?.nodeId,
    })
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Created extrude_[1]'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Auto-selected extrude_[1]'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Extrude > Choose next [Delete, Back]'),
    ).toBe(true)
  })

  it('selects output preview from graph scope and lets back deselect the node to graph scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-output-preview-1',
            type: 'System/OutputPreview',
            params: getDefaultNodeParams('System/OutputPreview'),
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('op')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'graphOutputPreviewSelected',
    )
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-output-preview-1')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-output-preview-1',
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('b')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useSpaghettiStore.getState().selectedNodeId).toBeNull()
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-1',
    })
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)
  })

  it('lists all graph nodes from focus node and focuses the selected node', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'node-cube-1',
            type: 'Part/Cube',
            params: getDefaultNodeParams('Part/Cube'),
          },
          {
            nodeId: 'node-sketch-1',
            type: 'Geometry/Sketch',
            params: {
              sketch: {
                type: 'sketch',
                featureId: 'sketch-1',
                plane: 'XY',
                components: [],
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('fn')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphNodeList')
    expect(useConsoleStore.getState().inputText).toBe('1')
    expect(useSpaghettiStore.getState().consolePreviewNodeId).toBe('node-cube-1')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Focus Node > Choose next',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('node_[2] Sketch')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'node_[1] Cube',
    )

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('2')
    expect(useSpaghettiStore.getState().consolePreviewNodeId).toBe('node-sketch-1')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(useSpaghettiStore.getState().selectedNodeId).toBe('node-sketch-1')
    expect(useSpaghettiStore.getState().consolePreviewNodeId).toBeNull()
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'node-sketch-1',
    })
    expect(useConsoleStore.getState().inputText).toBe('Sketch Plane')
  })

  it('deletes a selected sketch node with d and returns to graph scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')

    await act(async () => {
      useConsoleStore.getState().setInputText('d')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useSpaghettiStore.getState().graph.nodes.some((node) => node.nodeId === 'node-sketch-1'),
    ).toBe(false)
    expect(useSpaghettiStore.getState().selectedNodeId).toBeNull()
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toMatchObject({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-1',
    })
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Deleted sketch_[1]'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)
  })

  it('syncs surface-driven spaghetti activation into graph scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
    })

    await act(async () => {
      useAppStore.getState().setActiveSurface('spaghetti')
      useAppStore.getState().requestConsoleContextSync('surface-activation')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Select > Graph > graph_[1]',
      ),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)
  })

  it('syncs a browser-selected sketch target into sketch scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'graph-node',
        graphDocumentId: 'graph-document-1',
        nodeId: 'node-sketch-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Selected target: sketch_[1]',
      ),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Select > Graph > graph_[1] > Sketch > sketch_[1]',
      ),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]',
      ),
    ).toBe(true)
  })

  it('returns to root when surface-driven context is cleared', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setActiveSurface('spaghetti')
      useAppStore.getState().requestConsoleContextSync('surface-activation')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')

    await act(async () => {
      useAppStore.getState().setActiveSurface(null)
      useAppStore.getState().requestConsoleContextSync('surface-clear')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Root > Choose next [Graph, Radio]'),
    ).toBe(true)
  })

  it('returns to root on surface-clear even when a graph node remains selected', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'graph-node',
        graphDocumentId: 'graph-document-1',
        nodeId: 'node-sketch-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')

    await act(async () => {
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('surface-clear')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(true)
  })

  it('shows root availability when viewer surface-clear happens while already at root', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('surface-clear')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(
      useConsoleStore
        .getState()
        .entries.filter((entry) => entry.text === 'Root > Choose next [Graph, Radio]'),
    ).toHaveLength(1)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(false)
  })

  it('does not replay a stale root sync after g enters graph scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('surface-clear')
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(
      useConsoleStore
        .getState()
        .entries.filter((entry) => entry.text === 'Root > Choose next [Graph, Radio]'),
    ).toHaveLength(1)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text ===
            'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
        ),
    ).toBe(true)
  })

  it('executes sketch draw from staged navigation and clears the staged session', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Auto-selected sketch_[1]'),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]',
      ),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('sd')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
    })
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Sketch Draw > [Line, PLine, Rectangle, Circle, X]'),
    ).toBe(true)
  })

  it('prefills and cycles sketch draw feature assist choices after staged launch', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sd')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().inputText).toBe('Line')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Sketch Draw >')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Line',
    )

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('PLine')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'PLine',
    )

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      mode: 'draw',
      activeTool: 'pline',
      drawStage: 'toolSelected',
    })
  })

  it('executes sketch plane from staged navigation and clears the staged session', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')

    await act(async () => {
      useConsoleStore.getState().setInputText('sp')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'pick',
    })
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Sketch Plane > [XY, XZ, YZ]'),
    ).toBe(true)
  })

  it('prefills and cycles sketch plane feature assist choices after staged launch', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sp')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().inputText).toBe('XY')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Sketch Plane >')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'XY',
    )
    expect(useSpaghettiStore.getState().sketchPlanePickSession?.previewPlane).toBe('XY')

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('XZ')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'XZ',
    )
    expect(useSpaghettiStore.getState().sketchPlanePickSession?.previewPlane).toBe('XZ')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      adjustScope: 'root',
      draftPlane: 'XZ',
      previewPlane: null,
    })
    expect(useConsoleStore.getState().inputText).toBe('Move')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Move',
    )
  })

  it('restores the selected sketch prompt after sketch plane is cancelled', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sp')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).not.toBeNull()

    await act(async () => {
      useSpaghettiStore.getState().cancelSketchPlanePick()
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]',
      ),
    ).toBe(true)
  })

  it('steps staged escape back one level and only cancels at the staged root', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('1')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphRoot')
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Staged navigation cancelled'),
    ).toBe(false)

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(
      useConsoleStore.getState().entries.filter((entry) => entry.text === '> esc'),
    ).toHaveLength(2)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Staged navigation cancelled'),
    ).toBe(false)

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useSpaghettiStore.getState().activeEditorViewportId).toBe('')
    expect(Object.keys(useSpaghettiStore.getState().editorViewportsById)).toHaveLength(0)
    expect(
      useConsoleStore.getState().entries.filter((entry) => entry.text === '> esc'),
    ).toHaveLength(3)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Staged navigation cancelled'),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('status')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text.includes('Status: spaghetti preview active')),
    ).toBe(true)
  })

  it('restores meatball editor view when staged escape steps to graph root and then exits to root', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    let viewportId = ''

    await act(async () => {
      root?.render(<ConsoleDock />)
      viewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1') ?? ''
      if (viewportId.length === 0) {
        throw new Error('Expected graph viewport to open')
      }
      useSpaghettiStore.getState().setEditorViewportWindowMode(viewportId, 'meatball editor view')
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().editorViewportsById[viewportId]?.windowMode).toBe('expanded')

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('1')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphRoot')

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useSpaghettiStore.getState().editorViewportsById[viewportId]?.windowMode).toBe(
      'meatball editor view',
    )
  })

  it('uses escape to return from selected sketch scope back to graph scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch Plane')

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch')
    expect(
      useConsoleStore.getState().entries.filter((entry) => entry.text === '> esc'),
    ).toHaveLength(1)
  })

  it('lets enter continue immediately after staged escape steps back a level', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector('input[aria-label="Console input"]') as HTMLInputElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch')
    expect(document.activeElement).toBe(input)

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      )
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch Plane')
  })

  it('treats space as submit while a staged session is active', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
    })

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Select > Graph > graph_[1] > Sketch > sketch_[1]'),
    ).toBe(true)
  })

  it('submits the active guided console choice on Enter even after focus leaves the input', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch Plane')

    const viewportButton = document.createElement('button')
    document.body.appendChild(viewportButton)
    viewportButton.focus()
    expect(document.activeElement).toBe(viewportButton)

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useSpaghettiStore.getState().sketchPlanePickSession?.nodeId).toBe('node-sketch-1')
  })

  it('submits the active guided console choice on Space even after focus leaves the input', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch Plane')

    const viewportButton = document.createElement('button')
    document.body.appendChild(viewportButton)
    viewportButton.focus()
    expect(document.activeElement).toBe(viewportButton)

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(useSpaghettiStore.getState().sketchPlanePickSession?.nodeId).toBe('node-sketch-1')
  })

  it('treats space as submit for the root graph token before staged navigation starts', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('g')
    })

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> g')).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Graph'),
    ).toBe(true)
  })

  it('prefills the first staged choice and lets up/down cycle the highlighted summary choice', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Graph > Choose next',
    )
    expect(
      container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent,
    ).toContain('Sketch')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Extrude')

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Extrude')
    expect(
      container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent,
    ).toContain('Extrude')

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Sketch')
    expect(
      container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent,
    ).toContain('Sketch')
  })

  it('replaces assisted staged prefill with the first typed key instead of appending to it', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().inputText).toBe('Sketch')

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 's', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('s')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Sketch',
    )
  })

  it('replaces assisted prefill with pasted text in the focused input', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
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
                outputs: { profiles: [], diagnostics: [] },
                uiState: { collapsed: false },
              },
            },
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startSketchPlanePick('node-sketch-1')
      useSpaghettiStore.getState().setSketchPlanePickDraftPlane('XZ')
      useSpaghettiStore.getState().runSketchPlaneCommand('move')
    })

    const input = container?.querySelector('input[aria-label="Console input"]') as
      | HTMLInputElement
      | null

    expect(useConsoleStore.getState().inputText).toBe('0.0,0.0,0.0')

    await act(async () => {
      input?.focus()
      const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
      Object.defineProperty(pasteEvent, 'clipboardData', {
        value: {
          getData: (type: string) => (type === 'text' ? '1,2,3' : ''),
        },
      })
      input?.dispatchEvent(pasteEvent)
    })

    expect(useConsoleStore.getState().inputText).toBe('1,2,3')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })

  it('cycles staged choices from global up/down keys even when the input is not already focused', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [],
        edges: [],
      })
      useConsoleStore.getState().setInputText('g')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Extrude')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Extrude',
    )

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Sketch')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Sketch',
    )
  })

  it('parses choose-next transcript summaries into visible choices and highlights the matching input token', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().appendEntry({
        layer: 'Commands',
        text: 'Graph > Choose next [Sketch, Extrude, Output Preview, Build, Back]',
      })
      useConsoleStore.getState().setInputText('Build')
    })

    const summary = container.querySelector('.ConsoleBarSummary') as HTMLDivElement | null
    const activeChoice = container.querySelector(
      '.ConsoleBarSummaryChoice.isActive',
    ) as HTMLSpanElement | null

    expect(summary?.textContent).toContain('Graph > Choose next')
    expect(summary?.textContent).toContain('Output Preview')
    expect(summary?.textContent).toContain('Build')
    expect(activeChoice?.textContent).toContain('Build')
  })
})
