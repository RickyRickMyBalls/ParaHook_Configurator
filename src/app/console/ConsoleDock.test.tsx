// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { getDefaultNodeParams } from '../spaghetti/registry/nodeRegistry'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { resetAudioSamplerStore, useAudioSamplerStore } from '../store/audioSamplerStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { defaultPrimaryViewportSlotId } from '../workspace/workspaceShellTypes'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
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
  let setViewer: typeof import('../viewerBridge').setViewer
  const originalWindowOpen = window.open
  const originalWorker = globalThis.Worker

  beforeEach(async () => {
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    resetAudioSamplerStore()
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    window.open = originalWindowOpen
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ useAppStore } = await import('../store/useAppStore'))
    ;({ setViewer } = await import('../viewerBridge'))
    useAppStore.setState(useAppStore.getInitialState(), true)
    setViewer(null)
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
    setViewer(null)
  })

  const createRect = (left: number, top: number, width: number, height: number): DOMRect =>
    ({
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => ({}),
    }) as DOMRect

  const appendWorkspaceViewportShell = () => {
    const viewportArea = document.createElement('section')
    viewportArea.className = 'ViewportArea'
    viewportArea.getBoundingClientRect = () => createRect(0, 0, 800, 600)

    const primarySlot = document.createElement('div')
    primarySlot.dataset.workspaceSlotId = defaultPrimaryViewportSlotId
    primarySlot.getBoundingClientRect = () => createRect(0, 200, 800, 400)

    viewportArea.appendChild(primarySlot)
    document.body.appendChild(viewportArea)
    return { viewportArea, primarySlot }
  }

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

  it('enters the references scope from the console root', async () => {
    const { REFERENCE_ROOT_ROW_ID } = await import('../store/useAppStore')
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('refs')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'assembly',
      assemblyId: REFERENCE_ROOT_ROW_ID,
    })
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > References')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text.includes('References > Choose next [') &&
            entry.text.includes('Footpads') &&
            entry.text.includes('Shoes') &&
            entry.text.includes('Load All') &&
            entry.text.includes('Back'),
        ),
    ).toBe(true)
  })

  it('accepts ref as a root alias for the references scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('ref')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > References')).toBe(true)
  })

  it('enters the content root from an explicit root staged session instead of falling through to graph', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setStagedNavigationSession({
        scopeId: 'root',
        breadcrumb: ['Root'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
        },
        validChoices: [],
      })
      useConsoleStore.getState().setInputText('content')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentRoot')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Content')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text.includes('Content > Choose next [') && entry.text.includes('New Assembly')),
    ).toBe(true)
  })

  it('accepts co as a root alias for the content scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('co')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentRoot')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Content')).toBe(true)
  })

  it('keeps multi-word content autofill labels readable instead of collapsing to canonical tokens', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('content')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const input = container?.querySelector('.ConsoleInput') as HTMLInputElement | null

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('New Assembly')
  })

  it('prints content breadcrumbs before opening the new assembly rename prompt', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('content')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('New Assembly')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Content > New Assembly'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Select > Content > Assembly 2 > Enter value [Assembly 2]'),
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
      useConsoleStore.getState().setInputText('On')
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
        .entries.some(
          (entry) => entry.text.startsWith('Root > Choose next ['),
        ),
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
        .entries.some(
          (entry) => entry.text.startsWith('Root > Choose next ['),
        ),
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Extrude',
      triggerKind: 'arrowUp',
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch',
      triggerKind: 'arrowDown',
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Extrude',
      triggerKind: 'arrowUp',
    })

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch',
      triggerKind: 'arrowDown',
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch.Plane.XZ',
      triggerKind: 'arrowUp',
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useAudioSamplerStore.getState().latestBurstRequest).toMatchObject({
      commandIdentity: 'Console.Graph.Sketch.Plane.Rotate',
      triggerKind: 'arrowUp',
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

  it('opens the shared floating split menu callback from the floating console header on right-click', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const handleOpenFloatingSplitMenu = vi.fn()

    await act(async () => {
      useConsoleStore.getState().switchToFloating()
      root?.render(<ConsoleDock onOpenFloatingSplitMenu={handleOpenFloatingSplitMenu} />)
    })

    const floatingHeader = container.querySelector(
      '.ConsoleFloatingWindow .ConsolePanelHeader',
    ) as HTMLDivElement | null

    await act(async () => {
      floatingHeader?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    expect(handleOpenFloatingSplitMenu).toHaveBeenCalledTimes(1)
    expect(handleOpenFloatingSplitMenu.mock.calls[0]?.[0]).toBe('console-floating-compat')
  })

  it('uses the shared workspace float action when a real console slot is hosted in the workspace tree', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      useWorkspaceStore.getState().showViewportSplitSlot('console', 'right')
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
    expect(
      Object.values(useWorkspaceStore.getState().detachedSlotSurfaceById).some(
        (surface) => surface.surfaceKind === 'console' && surface.hostMode === 'floating',
      ),
    ).toBe(true)
  })

  it('keeps a slot-header seeded floating console attached to the pointer until release', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const consumeSeed = vi.fn()

    await act(async () => {
      useConsoleStore.getState().switchToFloating()
      useConsoleStore.getState().setFloatingRect({
        x: 64,
        y: 64,
        width: 720,
        height: 420,
      })
      root?.render(
        <ConsoleDock
          slotHeaderDragSeed={{
            pointerId: 1,
            clientX: 320,
            clientY: 180,
            pointerOffsetX: 120,
            pointerOffsetY: 24,
            titleBarHeight: 32,
          }}
          onConsumeSlotHeaderDragSeed={consumeSeed}
        />,
      )
    })

    expect(consumeSeed).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().floatingRect).toMatchObject({
      x: 200,
      y: 156,
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 250,
        }),
      )
    })

    expect(useConsoleStore.getState().floatingRect).toMatchObject({
      x: 292,
      y: 226,
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 250,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 520,
          clientY: 320,
        }),
      )
    })

    expect(useConsoleStore.getState().floatingRect).toMatchObject({
      x: 292,
      y: 226,
    })
  })

  it('keeps a slot-header seeded floating console below the primary viewport title bar during repeat drag-out', async () => {
    const viewportArea = document.createElement('section')
    viewportArea.className = 'ViewportArea'
    viewportArea.getBoundingClientRect = () => createRect(0, 0, 800, 600)
    const primarySlot = document.createElement('div')
    primarySlot.className = 'ViewportFrame isPrimarySlot'
    primarySlot.dataset.workspaceSlotId = defaultPrimaryViewportSlotId
    primarySlot.getBoundingClientRect = () => createRect(0, 0, 800, 600)
    const primarySlotBody = document.createElement('div')
    primarySlotBody.className = 'ViewportFrameBody'
    primarySlotBody.getBoundingClientRect = () => createRect(0, 56, 800, 544)
    primarySlot.appendChild(primarySlotBody)
    viewportArea.appendChild(primarySlot)
    document.body.appendChild(viewportArea)
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const consumeSeed = vi.fn()

    await act(async () => {
      useConsoleStore.getState().switchToFloating()
      useConsoleStore.getState().setFloatingRect({
        x: 64,
        y: 80,
        width: 720,
        height: 420,
      })
      root?.render(
        <ConsoleDock
          slotHeaderDragSeed={{
            pointerId: 2,
            clientX: 320,
            clientY: 24,
            pointerOffsetX: 120,
            pointerOffsetY: 24,
            titleBarHeight: 40,
          }}
          onConsumeSlotHeaderDragSeed={consumeSeed}
        />,
      )
    })

    expect(consumeSeed).toHaveBeenCalledTimes(1)

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 420,
          clientY: 0,
        }),
      )
    })

    expect(useConsoleStore.getState().floatingRect.y).toBe(56)
  })

  it('uses the shared local split ghost and keeps the top-level console split intact when the floating console drops into the hovered pane', async () => {
    const { viewportArea, primarySlot } = appendWorkspaceViewportShell()
    const originalElementsFromPoint = document.elementsFromPoint
    document.elementsFromPoint = (() => [primarySlot]) as typeof document.elementsFromPoint

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'top', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
      root?.render(<ConsoleDock />)
    })

    const initialWorkspaceState = useWorkspaceStore.getState()
    const initialRightSplitCount = Object.values(initialWorkspaceState.viewportLayoutNodesById).filter(
      (node): node is Extract<(typeof initialWorkspaceState.viewportLayoutNodesById)[string], { kind: 'split' }> =>
        node.kind === 'split' && node.splitDockSide === 'right',
    ).length

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

    const floatingHeader = container.querySelector(
      '.ConsoleFloatingWindow .ConsolePanelHeader',
    ) as HTMLDivElement | null
    floatingHeader!.getBoundingClientRect = () => createRect(120, 80, 720, 32)

    await act(async () => {
      floatingHeader?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          clientX: 220,
          clientY: 100,
          button: 0,
        }),
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 780,
          clientY: 260,
        }),
      )
    })

    const localGhost = viewportArea.querySelector(
      '.ViewportSplitDockGhost[data-split-preview-scope="local"]',
    ) as HTMLDivElement | null
    expect(localGhost).not.toBeNull()
    expect(localGhost?.className).toContain('isDockRight')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 780,
          clientY: 260,
        }),
      )
    })

    expect(viewportArea.querySelector('.ViewportSplitDockGhost')).toBeNull()

    const workspaceState = useWorkspaceStore.getState()
    const rootNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]
    const splitNodes = Object.values(workspaceState.viewportLayoutNodesById).filter(
      (node): node is Extract<(typeof workspaceState.viewportLayoutNodesById)[string], { kind: 'split' }> =>
        node.kind === 'split',
    )

    expect(rootNode?.kind).toBe('split')
    expect(splitNodes.filter((node) => node.splitDockSide === 'right').length).toBeGreaterThanOrEqual(
      initialRightSplitCount + 1,
    )
    expect(useConsoleStore.getState().windowMode).toBe('docked')

    document.elementsFromPoint = originalElementsFromPoint
  })

  it('uses the shared global split ghost and creates a new root column when the floating console drops on the outer edge band', async () => {
    const { viewportArea, primarySlot } = appendWorkspaceViewportShell()
    const originalElementsFromPoint = document.elementsFromPoint
    document.elementsFromPoint = (() => [primarySlot]) as typeof document.elementsFromPoint

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'top', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
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

    const floatingHeader = container.querySelector(
      '.ConsoleFloatingWindow .ConsolePanelHeader',
    ) as HTMLDivElement | null
    floatingHeader!.getBoundingClientRect = () => createRect(120, 80, 720, 32)

    await act(async () => {
      floatingHeader?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          clientX: 220,
          clientY: 100,
          button: 0,
        }),
      )
    })

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          clientX: 792,
          clientY: 260,
        }),
      )
    })

    const globalGhost = viewportArea.querySelector(
      '.ViewportSplitDockGhost[data-split-preview-scope="global"]',
    ) as HTMLDivElement | null
    expect(globalGhost).not.toBeNull()
    expect(globalGhost?.className).toContain('isDockRight')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          cancelable: true,
          clientX: 792,
          clientY: 260,
        }),
      )
    })

    expect(viewportArea.querySelector('.ViewportSplitDockGhost')).toBeNull()

    const workspaceState = useWorkspaceStore.getState()
    const rootNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]

    expect(rootNode?.kind).toBe('split')
    expect(rootNode?.kind === 'split' ? rootNode.splitDockSide : null).toBe('right')
    expect(useConsoleStore.getState().windowMode).toBe('docked')
    expect(
      Object.values(workspaceState.detachedSlotSurfaceById).some(
        (surface) => surface.surfaceKind === 'console',
      ),
    ).toBe(false)

    document.elementsFromPoint = originalElementsFromPoint
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

  it('uses the shared workspace popout action when a real console slot is hosted in the workspace tree', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const popoutDocument = document.implementation.createHTMLDocument('Console Workspace Popout')
    const popoutWindow = {
      get closed() {
        return false
      },
      document: popoutDocument,
      focus: () => undefined,
      close: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
    } as unknown as Window

    window.open = (() => popoutWindow) as typeof window.open

    await act(async () => {
      useWorkspaceStore.getState().showViewportSplitSlot('console', 'right')
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
    expect(
      Object.values(useWorkspaceStore.getState().detachedSlotSurfaceById).some(
        (surface) => surface.surfaceKind === 'console' && surface.hostMode === 'popout',
      ),
    ).toBe(true)
    expect(popoutDocument.querySelector('.ConsoleDock--popoutSurface')).not.toBeNull()
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
          key: 'ArrowDown',
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Orbit')
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

  it('captures printable typing into the console after viewport focus while sketch draw idle is active', async () => {
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

    const viewportButton = document.createElement('button')
    document.body.appendChild(viewportButton)
    viewportButton.focus()

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

  it('keeps printable console capture active through sketch draw and after it ends', async () => {
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

  it('lets focused circle-radius input accumulate multi-digit floats during freeform assist entry', async () => {
    const circleNodeId = 'node-sketch-circle-freeform'
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
      useSpaghettiStore.getState().runGeometrySketchDrawCommand('circle')
      useSpaghettiStore.getState().confirmGeometrySketchDrawPoint({ x: 2, y: 3 }, null)
    })

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    const typeIntoFocusedConsoleInput = async (nextValue: string, key: string) => {
      await act(async () => {
        input?.focus()
      })
      expect(document.activeElement).toBe(input)

      const keyEvent = new KeyboardEvent('keydown', {
        key,
        bubbles: true,
        cancelable: true,
      })

      await act(async () => {
        input?.dispatchEvent(keyEvent)
      })

      expect(keyEvent.defaultPrevented).toBe(false)

      await act(async () => {
        if (input === null) {
          return
        }
        const valueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value',
        )?.set
        valueSetter?.call(input, nextValue)
        input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
      })
    }

    await typeIntoFocusedConsoleInput('1', '1')
    expect(useConsoleStore.getState().inputText).toBe('1')

    await typeIntoFocusedConsoleInput('10', '0')
    expect(useConsoleStore.getState().inputText).toBe('10')

    await typeIntoFocusedConsoleInput('100', '0')
    expect(useConsoleStore.getState().inputText).toBe('100')
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
        .entries.some(
          (entry) => entry.text.startsWith('Graph > Sketch > Sketch Draw > Choose next ['),
        ),
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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

  it('aligns the active graph to the selected targets fallback graph from content context', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      const secondGraphId = useSpaghettiStore.getState().createGraphDocument(
        {
          schemaVersion: 1,
          nodes: [],
          edges: [],
        },
        'Graph 2',
      )
      useSpaghettiStore.setState((state) => ({
        ...state,
        activeGraphDocumentId: secondGraphId,
      }))
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useSpaghettiStore.getState().activeGraphDocumentId).toBe('graph-document-1')
    expect(useConsoleStore.getState().stagedNavigationSession?.selections.graphDocumentId).toBe(
      'graph-document-1',
    )
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
    expect(state.editorViewportsById[editorViewportId]?.windowMode).toBe('maximized')
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Root > Graph Documents > Graph 1 > Sketch > sketch_[1] > Choose next',
    )
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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

  it('syncs a browser-selected object target into object scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Selected target: Object 1')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text === 'Content > Choose next [ViewTransform, Move, Rotate, Scale, Zoom, Back]',
        ),
    ).toBe(true)
    expect(useConsoleStore.getState().inputText).toBe('ViewTransform')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Assembly 1 > Component 1 > Object 1 > Choose next',
    )
  })

  it('commits object-local zoom directly from a browser-selected object', async () => {
    const viewerFrameSelected = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: viewerFrameSelected,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('Zoom')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Select > Content > Assembly 1 > Component 1 > Object 1 > Zoom'),
    ).toBe(true)
    expect(viewerFrameSelected).toHaveBeenCalledWith('graph-document-1:slot-a')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Assembly 1 > Component 1 > Object 1 > Choose next',
    )
  })

  it('syncs a browser-selected assembly target into rooted assembly scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
        workspaceSelection: {
          ...state.workspaceSelection,
          resolvedContentSelection: {
            rootRowId: 'assembly-root:project-file-1',
            rootKind: 'assembly',
            partKeys: ['graph-document-1:slot-a'],
            groupedRowIds: ['component-1', 'object-1'],
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'assembly',
        assemblyId: 'assembly-root:project-file-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentAssemblySelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Content > Assembly 1')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text === 'Content > Choose next [New Component, Rename, SelectAll, Zoom, Back]',
        ),
    ).toBe(true)
  })

  it('frames a selected assembly from assembly-local z > o', async () => {
    const viewerFrameSelectionSet = vi.fn(() => true)
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameSelectionSet: viewerFrameSelectionSet,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
        workspaceSelection: {
          ...state.workspaceSelection,
          resolvedContentSelection: {
            rootRowId: 'assembly-root:project-file-1',
            rootKind: 'assembly',
            partKeys: ['graph-document-1:slot-a'],
            groupedRowIds: ['component-1', 'object-1'],
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'assembly',
        assemblyId: 'assembly-root:project-file-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('Object')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameSelectionSet).toHaveBeenCalledWith(['graph-document-1:slot-a'], [])
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentAssemblySelected')
  })

  it('syncs a selected reference target into lightweight reference scope and exposes real actions', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Select > References > Shoes > Shoe 1'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Reference > Choose next [Load Model, Zoom, Back]'),
    ).toBe(true)
  })

  it('commits reference-local zoom directly from a selected reference', async () => {
    const viewerFrameReference = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: viewerFrameReference,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('Zoom')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Select > References > Shoes > Shoe 1 > Zoom'),
    ).toBe(true)
    expect(viewerFrameReference).toHaveBeenCalledWith('shoe:shoe-1')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Shoes > Shoe 1 > Choose next',
    )
  })

  it('frames a selected reference from reference-local z', async () => {
    const viewerFrameReference = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: viewerFrameReference,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Select > References > Shoes > Shoe 1 > Zoom',
      ),
    ).toBe(true)
    expect(viewerFrameReference).toHaveBeenCalledWith('shoe:shoe-1')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')
  })

  it('routes explicit mixed browser selection into a synthetic multi-select scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-1',
          },
          explicitSelectedTargets: [
            {
              kind: 'reference-item',
              referenceId: 'shoe:shoe-1',
            },
            {
              kind: 'reference-item',
              referenceId: 'shoe:shoe-2',
            },
          ],
          selectionAnchorTarget: {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-2',
          },
          resolvedContentSelection: null,
          activeSurface: 'browser',
        },
      }))
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('multiSelectSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Multi-Select > [Shoe 1, Shoe 2]')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Choose next [Zoom, Back]'),
    ).toBe(true)
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Multi-Select > [Shoe 1, Shoe 2] > Choose next',
    )
  })

  it('routes viewport-created explicit object selection into the synthetic multi-select scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
            'object-2': {
              objectId: 'object-2',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-2',
              sourceNodeId: 'node-output-2',
              slotId: 'slot-b',
              label: 'Object 2',
              resolutionState: 'resolved',
            },
          },
        },
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'object',
            objectId: 'object-2',
          },
          explicitSelectedTargets: [
            {
              kind: 'object',
              objectId: 'object-1',
            },
            {
              kind: 'object',
              objectId: 'object-2',
            },
          ],
          selectionAnchorTarget: {
            kind: 'object',
            objectId: 'object-2',
          },
          resolvedContentSelection: {
            rootRowId: 'object:object-2',
            rootKind: 'multi-select',
            partKeys: ['graph-document-1:slot-a', 'graph-document-1:slot-b'],
            groupedRowIds: [],
          },
          activeSurface: 'viewer',
        },
      }))
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('multiSelectSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Multi-Select > [Object 1, Object 2]')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Choose next [Zoom, Back]'),
    ).toBe(true)
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Multi-Select > [Object 1, Object 2] > Choose next',
    )
  })

  it('commits multi-select zoom directly from explicit object selection', async () => {
    const viewerFrameSelectionSet = vi.fn(() => true)
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameSelectionSet: viewerFrameSelectionSet,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
            'object-2': {
              objectId: 'object-2',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-2',
              sourceNodeId: 'node-output-2',
              slotId: 'slot-b',
              label: 'Object 2',
              resolutionState: 'resolved',
            },
          },
        },
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'object',
            objectId: 'object-2',
          },
          explicitSelectedTargets: [
            {
              kind: 'object',
              objectId: 'object-1',
            },
            {
              kind: 'object',
              objectId: 'object-2',
            },
          ],
          selectionAnchorTarget: {
            kind: 'object',
            objectId: 'object-2',
          },
          resolvedContentSelection: {
            rootRowId: 'object:object-2',
            rootKind: 'multi-select',
            partKeys: ['slot-a', 'slot-b'],
            groupedRowIds: [],
          },
          activeSurface: 'viewer',
        },
      }))
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('Zoom')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Multi-Select > [Object 1, Object 2] > Zoom')).toBe(true)
    expect(viewerFrameSelectionSet).toHaveBeenCalledWith(['slot-a', 'slot-b'], [])
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('multiSelectSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Multi-Select > [Object 1, Object 2] > Choose next',
    )
  })

  it('frames the explicit multi-selection from multi-select z', async () => {
    const viewerFrameSelectionSet = vi.fn(() => true)
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameSelectionSet: viewerFrameSelectionSet,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
            'object-2': {
              objectId: 'object-2',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-2',
              sourceNodeId: 'node-output-2',
              slotId: 'slot-b',
              label: 'Object 2',
              resolutionState: 'resolved',
            },
          },
        },
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: {
            kind: 'object',
            objectId: 'object-2',
          },
          explicitSelectedTargets: [
            {
              kind: 'object',
              objectId: 'object-1',
            },
            {
              kind: 'object',
              objectId: 'object-2',
            },
          ],
          selectionAnchorTarget: {
            kind: 'object',
            objectId: 'object-2',
          },
          resolvedContentSelection: {
            rootRowId: 'object:object-2',
            rootKind: 'multi-select',
            partKeys: ['slot-a', 'slot-b'],
            groupedRowIds: [],
          },
          activeSurface: 'viewer',
        },
      }))
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameSelectionSet).toHaveBeenCalledWith(['slot-a', 'slot-b'], [])
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('multiSelectSelected')
  })

  it('syncs a selected references root target into references scope with Load All', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'references-root',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > References')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text.includes('References > Choose next [') &&
            entry.text.includes('Footpads') &&
            entry.text.includes('Shoes') &&
            entry.text.includes('Load All') &&
            entry.text.includes('Zoom') &&
            entry.text.includes('Back'),
        ),
    ).toBe(true)
  })

  it('clears the selected references root when backing out of references', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'references-root',
        },
        explicitSelectedTargets: [
          {
            kind: 'references-root',
          },
        ],
        selectionAnchorTarget: {
          kind: 'references-root',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')

    await act(async () => {
      useConsoleStore.getState().setInputText('Back')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
  })

  it('syncs a selected reference category target into a deeper references scope', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-category',
        categoryId: 'footpads',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceCategorySelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > References > Footpads')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text.includes('References > Choose next [') &&
            entry.text.includes('PubPad Full Assembly') &&
            entry.text.includes('Load All') &&
            entry.text.includes('Zoom') &&
            entry.text.includes('Back'),
        ),
    ).toBe(true)
  })

  it('frames the references root from references z > o', async () => {
    const viewerFrameSelectionSet = vi.fn(() => true)
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameSelectionSet: viewerFrameSelectionSet,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'references-root',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('Object')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameSelectionSet).toHaveBeenCalledWith(
      [],
      expect.arrayContaining(['footpad:pubpad-full-assembly', 'shoe:shoe-1', 'hook:large']),
    )
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')
  })

  it('frames a reference category from category z > o', async () => {
    const viewerFrameSelectionSet = vi.fn(() => true)
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameSelectionSet: viewerFrameSelectionSet,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-category',
        categoryId: 'footpads',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('Object')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameSelectionSet).toHaveBeenCalledWith([], ['footpad:pubpad-full-assembly'])
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceCategorySelected')
  })

  it('lets the references root scope advance into child categories', async () => {
    const { buildReferenceCategoryRowId } = await import('../store/useAppStore')
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'references-root',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('footpads')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceCategorySelected')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'component',
      componentId: buildReferenceCategoryRowId('footpads'),
    })
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Footpads > Choose next',
    )
  })

  it('reselects the references root target when backing out of a reference category scope', async () => {
    const { REFERENCE_ROOT_ROW_ID, buildReferenceCategoryRowId } = await import('../store/useAppStore')
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'assembly',
        assemblyId: REFERENCE_ROOT_ROW_ID,
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('footpads')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'component',
      componentId: buildReferenceCategoryRowId('footpads'),
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('back')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'assembly',
      assemblyId: REFERENCE_ROOT_ROW_ID,
    })
  })

  it('lets a reference category scope advance into an individual reference item and select it', async () => {
    const { buildImportedReferenceRowId, buildReferenceCategoryRowId } = await import('../store/useAppStore')
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'component',
        componentId: buildReferenceCategoryRowId('footpads'),
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('pubpad full assembly')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'object',
      objectId: buildImportedReferenceRowId('footpad:pubpad-full-assembly'),
    })
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > References > Footpads > PubPad Full Assembly')).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Reference > Choose next [Load Model, Zoom, Back]'),
    ).toBe(true)
  })

  it('accepts aliases for reference category navigation from the references root scope', async () => {
    const submitAndReadSummary = async (token: string): Promise<string> => {
      container = document.createElement('div')
      document.body.appendChild(container)
      root = createRoot(container)

      await act(async () => {
        root?.render(<ConsoleDock />)
        useAppStore.getState().setWorkspaceSelectedTarget({
          kind: 'references-root',
        })
        useAppStore.getState().setActiveSurface('browser')
        useAppStore.getState().requestConsoleContextSync('target-selection')
      })

      await act(async () => {
        useConsoleStore.getState().setInputText(token)
      })

      await act(async () => {
        const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })

      const summary = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
      await act(async () => {
        root?.unmount()
      })
      container.remove()
      root = null
      container = null
      return summary
    }

    await expect(submitAndReadSummary('fp')).resolves.toContain(
      'Select > References > Footpads > Choose next',
    )
    await expect(submitAndReadSummary('foodpads')).resolves.toContain(
      'Select > References > Footpads > Choose next',
    )
    await expect(submitAndReadSummary('sh')).resolves.toContain(
      'Select > References > Shoes > Choose next',
    )
    await expect(submitAndReadSummary('pfh')).resolves.toContain(
      'Select > References > Premade Foothooks > Choose next',
    )
  })

  it('committing Load All from a reference category scope loads that category without arming transform', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-category',
        categoryId: 'footpads',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('load all')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.visibilityById['footpad:pubpad-full-assembly']).toBe(true)
    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      source: 'category-load-all',
      targetIds: ['footpad:pubpad-full-assembly'],
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Load All: Footpads'),
    ).toBe(true)
  })

  it('committing Load All from the references root scope loads all references without arming transform', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'references-root',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('load all')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.visibilityById['shoe:shoe-1']).toBe(true)
    expect(useAppStore.getState().referenceWorkspace.visibilityById['hook:large']).toBe(true)
    expect(useAppStore.getState().referenceWorkspace.referenceLoadBatch).toMatchObject({
      source: 'root-load-all',
      targetIds: [
        'footpad:pubpad-full-assembly',
        'shoe:shoe-1',
        'shoe:shoe-2',
        'shoe:shoe-3',
        'hook:large',
        'hook:medium',
        'hook:small',
        'hook:xl',
      ],
    })
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Load All: References'),
    ).toBe(true)
  })

  it('committing Load Model from a hidden reference scope makes the reference visible without arming transform', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('load model')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.visibilityById['shoe:shoe-1']).toBe(true)
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')
    expect(useConsoleStore.getState().inputText).toBe('Load Model')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Load Model: Shoe 1'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text.includes('Reference > Choose next [')),
    ).toBe(true)
  })

  it('arms whole-reference move immediately from the reference scope', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerActivateTranslateCenterHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      activateTranslateCenterHandle: viewerActivateTranslateCenterHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.referenceId).toBe('shoe:shoe-1')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe('translate')
    expect(viewerSetReferenceTransformSession).toHaveBeenCalledWith(
      expect.objectContaining({
        referenceId: 'shoe:shoe-1',
        mode: 'translate',
        space: useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.space,
      }),
    )
    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(1)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Move armed'),
    ).toBe(true)
    const summaryText = container?.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Choose next')
    expect(summaryText).toContain('Vec3 [0.0, 0.0, 0.0]')
    expect(summaryText).not.toContain('CommitTransform')
  })

  it('cycles Transform root to Rotate on tab', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toMatchObject({
      referenceId: 'shoe:shoe-1',
      mode: 'rotate',
      entryActive: true,
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Rotate > Choose next',
    )
    expect(viewerSetReferenceTransformSession).toHaveBeenLastCalledWith(
      expect.objectContaining({
        referenceId: 'shoe:shoe-1',
        mode: 'rotate',
        space: useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.space,
      }),
    )
  })

  it('deletes the latest committed transform entry from Transform root', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('translate')
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 4, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })

    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label) ?? [],
    ).toContain('DeleteLatest')

    await act(async () => {
      useConsoleStore.getState().setInputText('delete')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'] ?? [],
    ).toHaveLength(0)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject(
      {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    )
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label) ?? [],
    ).toEqual(['Move', 'Rotate', 'Scale', 'Snap', 'Settings', 'Back'])
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Deleted latest transform entry'),
    ).toBe(true)
  })

  it('keeps DeleteLatest available across transform re-entry for references', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('translate')
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 4, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().commitActiveReferenceTransformEntry()
      useAppStore.getState().exitReferenceTransformShell()
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {})

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
    })

    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label) ?? [],
    ).toContain('DeleteLatest')

    await act(async () => {
      useConsoleStore.getState().setInputText('delete')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'] ?? [],
    ).toHaveLength(0)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Deleted latest transform entry'),
    ).toBe(true)
  })

  it('keeps the live transform summary synced to gizmo draft changes for move rotate and scale', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerActivateTranslateCenterHandle = vi.fn()
    const viewerActivateRotateCenterHandle = vi.fn()
    const viewerActivateScaleCenterHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      activateTranslateCenterHandle: viewerActivateTranslateCenterHandle,
      activateRotateCenterHandle: viewerActivateRotateCenterHandle,
      activateScaleCenterHandle: viewerActivateScaleCenterHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 12, y: -3, z: 7 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    let summaryText = container?.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Choose next')
    expect(summaryText).toContain('Vec3 [12.0, -3.0, 7.0]')

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('rotate')
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 12, y: -3, z: 7 },
        rotationDeg: { x: 15, y: 22.5, z: -30 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    summaryText = container?.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Select > References > Shoes > Shoe 1 > Viewer Transform > Rotate > Choose next')
    expect(summaryText).toContain('Vec3 [15.0, 22.5, -30.0]')
    expect(
      useConsoleStore.getState().featureAssistDescriptor?.choices.map((choice) => choice.canonicalToken) ?? [],
    ).toEqual(['VEC3', 'SNAP', 'X', 'Y', 'Z'])

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('scale')
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 12, y: -3, z: 7 },
        rotationDeg: { x: 15, y: 22.5, z: -30 },
        scale: { x: 1.25, y: 0.8, z: 1.5 },
      })
    })

    summaryText = container?.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Select > References > Shoes > Shoe 1 > Viewer Transform > Scale > Choose next')
    expect(summaryText).toContain('Vec3 [1.3, 0.8, 1.5]')
  })

  it('shows the full staged tree in reference transform axis prompts', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const summaryText = container?.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Move X > Enter value',
    )
  })

  it('shows sibling axis and mode-switch choices inside the Move X prompt', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')
    expect(useConsoleStore.getState().entries.at(-1)?.text ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Move X > Choose next [Enter value, Y, Z, Scale, Rotate]',
    )
  })

  it('switches from Move X to Move Y in one command and cancels the current leaf drag', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    const viewerSetReferenceTransformOverride = vi.fn()
    const viewerActivateTranslateHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setReferenceTransformOverride: viewerSetReferenceTransformOverride,
      activateTranslateHandle: viewerActivateTranslateHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('y')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(viewerSetReferenceTransformOverride).toHaveBeenCalledWith('shoe:shoe-1', {
      position: { x: 0, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(viewerActivateTranslateHandle).toHaveBeenLastCalledWith('Y')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe(
      'translate',
    )
    expect(useConsoleStore.getState().consolePromptSession).toMatchObject({
      kind: 'reference-transform.axis',
      axis: 'y',
      mode: 'translate',
    })
    expect(useConsoleStore.getState().entries.at(-1)?.text ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Move Y > Choose next [Enter value, X, Z, Scale, Rotate]',
    )
  })

  it('switches from Move X to Rotate in one command and cancels the current leaf drag', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    const viewerSetReferenceTransformOverride = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setReferenceTransformOverride: viewerSetReferenceTransformOverride,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('rotate')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(viewerSetReferenceTransformOverride).toHaveBeenCalledWith('shoe:shoe-1', {
      position: { x: 0, y: 0, z: 0 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.mode).toBe(
      'rotate',
    )
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Rotate > Choose next',
    )
    expect(
      useConsoleStore.getState().featureAssistDescriptor?.choices.map((choice) => choice.canonicalToken) ??
        [],
    ).toEqual(['VEC3', 'SNAP', 'X', 'Y', 'Z'])
  })

  it('cycles Move root to Rotate on tab and restores the saved baseline', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    const viewerSetReferenceTransformOverride = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setReferenceTransformOverride: viewerSetReferenceTransformOverride,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 1, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 9, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
      )
    })

    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(viewerSetReferenceTransformOverride).toHaveBeenCalledWith('shoe:shoe-1', {
      position: { x: 1, y: 2, z: 3 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toMatchObject({
      referenceId: 'shoe:shoe-1',
      mode: 'rotate',
      entryActive: true,
      draftTransform: {
        position: { x: 1, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    })
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Rotate > Choose next',
    )
  })

  it('cycles Move X to Rotate on tab and closes the prompt', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    const viewerSetReferenceTransformOverride = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setReferenceTransformOverride: viewerSetReferenceTransformOverride,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 1, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 9, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
      )
    })

    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(viewerSetReferenceTransformOverride).toHaveBeenCalledWith('shoe:shoe-1', {
      position: { x: 1, y: 2, z: 3 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toMatchObject({
      referenceId: 'shoe:shoe-1',
      mode: 'rotate',
      entryActive: true,
      draftTransform: {
        position: { x: 1, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    })
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Rotate > Choose next',
    )
  })

  it('treats x as typed console input first during move and only opens Move X on enter', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerActivateTranslateHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      activateTranslateHandle: viewerActivateTranslateHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'x', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('x')
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')
    expect(useConsoleStore.getState().consolePromptSession?.label).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Move X',
    )
    expect(viewerActivateTranslateHandle).toHaveBeenCalledWith('X')
  })

  it('updates the Move X prompt value live when the draft changes from gizmo movement', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerActivateTranslateHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      activateTranslateHandle: viewerActivateTranslateHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession?.prefill).toBe('@0')

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 14, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    expect(useConsoleStore.getState().consolePromptSession?.prefill).toBe('@14')
    expect(useConsoleStore.getState().inputText).toBe('@14')
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Move X > Enter value[@14]',
    )
  })

  it('treats Move X float input as a relative delta by default', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerSetReferenceTransformOverride = vi.fn()
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setReferenceTransformOverride: viewerSetReferenceTransformOverride,
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      activateTranslateHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 5, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('10')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 15, y: 0, z: 0 },
    })
  })

  it('keeps guided transform input focused and selected for the keyboard Move to X to 10 flow', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      activateTranslateHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector('input[aria-label="Console input"]') as HTMLInputElement | null
    const valueSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )?.set

    const typeConsoleCharacters = async (text: string) => {
      for (const key of text) {
        await act(async () => {
          input?.focus()
        })
        const currentValue = input?.value ?? ''
        const selectionStart = input?.selectionStart ?? currentValue.length
        const selectionEnd = input?.selectionEnd ?? currentValue.length
        const keyEvent = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        })
        await act(async () => {
          input?.dispatchEvent(keyEvent)
        })
        if (!keyEvent.defaultPrevented && input !== null) {
          const nextValue =
            currentValue.slice(0, selectionStart) + key + currentValue.slice(selectionEnd)
          await act(async () => {
            valueSetter?.call(input, nextValue)
            const nextCaret = selectionStart + key.length
            input.setSelectionRange(nextCaret, nextCaret)
            input.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }))
          })
        }
      }
    }

    const submitConsoleInput = async () => {
      await act(async () => {
        form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      })
    }

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
    })
    await submitConsoleInput()

    await typeConsoleCharacters('move')
    await submitConsoleInput()

    expect(document.activeElement).toBe(input)
    expect(input?.selectionStart).toBe(input?.value.length)
    expect(input?.selectionEnd).toBe(input?.value.length)

    await typeConsoleCharacters('x')
    expect(useConsoleStore.getState().inputText).toBe('x')
    await submitConsoleInput()

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')
    expect(useConsoleStore.getState().consolePromptSession).toMatchObject({
      kind: 'reference-transform.axis',
      axis: 'x',
    })
    expect(document.activeElement).toBe(input)
    expect(input?.value).toBe('@0')
    expect(input?.selectionStart).toBe(2)
    expect(input?.selectionEnd).toBe(2)

    await typeConsoleCharacters('10')
    expect(useConsoleStore.getState().inputText).toBe('10')
    await submitConsoleInput()

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 10, y: 0, z: 0 },
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
  })

  it('treats Move X float input as relative to the entry origin, not the live draft', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerSetReferenceTransformOverride = vi.fn()
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setReferenceTransformOverride: viewerSetReferenceTransformOverride,
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      activateTranslateHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 5, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 14, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('10')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 15, y: 0, z: 0 },
    })
  })

  it('treats @10 in Move X as an absolute axis value', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerSetReferenceTransformOverride = vi.fn()
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setReferenceTransformOverride: viewerSetReferenceTransformOverride,
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      activateTranslateHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 5, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('@10')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 10, y: 0, z: 0 },
    })
  })

  it('treats Rotate Y float input as a relative delta by default', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      activateRotateHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 30, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('rotate')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('y')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('15')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      rotationDeg: { x: 0, y: 45, z: 0 },
    })
  })

  it('treats Scale Z float input as a relative delta by default', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      activateScaleHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 2 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('scale')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('z')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('0.5')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      scale: { x: 1, y: 1, z: 2.5 },
    })
  })

  it('commits Rotate root float input directly and returns to Transform', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      activateRotateCenterHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('rotate')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('10')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      rotationDeg: { x: 10, y: 10, z: 10 },
    })
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
  })

  it('commits Scale root float input directly and returns to Transform', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      activateScaleCenterHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('scale')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('10')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      scale: { x: 10, y: 10, z: 10 },
    })
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalled()
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
  })

  it('returns to the Transform root after committing Move X from an axis prompt', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      activateTranslateHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('10')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
      false,
    )
    expect(useConsoleStore.getState().inputText).toBe('CommitTransform')
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalledTimes(1)
  })

  it('returns to the Transform root after committing Rotate X from an axis prompt', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      activateRotateHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('rotate')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('10')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
      false,
    )
    expect(useConsoleStore.getState().inputText).toBe('CommitTransform')
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalledTimes(1)
  })

  it('returns to the Transform root after committing Scale Z from an axis prompt', async () => {
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      activateScaleHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('scale')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('z')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      useConsoleStore.getState().setInputText('0.5')
      ;(container?.querySelector('.ConsoleBar form') as HTMLFormElement | null)?.dispatchEvent(
        new Event('submit', { bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
      false,
    )
    expect(useConsoleStore.getState().inputText).toBe('CommitTransform')
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalledTimes(1)
  })

  it('steps back to Move on global escape even while the Move X value is updating live', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'axis',
        axis: 'x',
      })
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 14, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')
    expect(useConsoleStore.getState().consolePromptSession?.prefill).toBe('@14')

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null
    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.activeHandle).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
      true,
    )
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalledTimes(1)
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalledTimes(1)
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Choose next',
    )
  })

  it('opens the matching axis prompt when the gizmo selects Move Y', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'axis',
        axis: 'y',
      })
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')
    expect(useConsoleStore.getState().consolePromptSession?.label).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Move Y',
    )
  })

  it('opens the matching plane prompt when the gizmo selects Move XY', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'plane',
        plane: 'xy',
      })
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.plane')
    expect(useConsoleStore.getState().consolePromptSession?.label).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Move XY',
    )
  })

  it('returns to the mode root when the gizmo switches to the translate center handle', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'axis',
        axis: 'x',
      })
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')

    await act(async () => {
      useConsoleStore.getState().setInputText('stale-manual-value', { startManualOverride: true })
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'center',
      })
    })

    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().inputText).toBe('Vec3 [0.0, 0.0, 0.0]')
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Choose next',
    )
  })

  it('enters the move entry and reseeds Vec3 when the gizmo selects the translate center handle from transform root', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
      false,
    )

    await act(async () => {
      useAppStore.getState().beginReferenceTransformEntry('translate')
      useAppStore.getState().setActiveReferenceTransformHandle({
        mode: 'translate',
        kind: 'center',
      })
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
      true,
    )
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(useConsoleStore.getState().inputText).toBe('Vec3 [0.0, 0.0, 0.0]')
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Move > Choose next',
    )
  })

  it('returns to Transform root after gizmo auto-commits axis entries repeatedly', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const commitAxisMove = async (x: number) => {
      await act(async () => {
        useAppStore.getState().beginReferenceTransformEntry('translate')
        useAppStore.getState().setActiveReferenceTransformHandle({
          mode: 'translate',
          kind: 'axis',
          axis: 'x',
        })
      })

      expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')
      expect(useConsoleStore.getState().consolePromptSession).toMatchObject({
        mode: 'translate',
        axis: 'x',
      })

      await act(async () => {
        useAppStore.getState().setActiveReferenceTransformDraft({
          position: { x, y: 0, z: 0 },
          rotationDeg: { x: 0, y: 0, z: 0 },
          scale: { x: 1, y: 1, z: 1 },
        })
        useAppStore.getState().commitActiveReferenceTransformEntry()
      })

      expect(useConsoleStore.getState().consolePromptSession).toBeNull()
      expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
      expect(useConsoleStore.getState().inputText).toBe('CommitTransform')
      expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
        false,
      )
    }

    await commitAxisMove(4)
    await commitAxisMove(9)

    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId['shoe:shoe-1'] ?? [],
    ).toHaveLength(2)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 9, y: 0, z: 0 },
    })
  })

  it('cancels a live Move root drag on escape and returns to Transform', async () => {
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 1, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformEntry('translate')
      useAppStore.getState().setActiveReferenceTransformHandle({ mode: 'translate', kind: 'center' })
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 9, y: 2, z: 3 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
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

    expect(
      useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive ?? false,
    ).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.activeHandle ?? null).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      position: { x: 1, y: 2, z: 3 },
    })
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
  })

  it('cancels a live Rotate root drag on escape and returns to Transform', async () => {
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 5, y: 6, z: 7 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformEntry('rotate')
      useAppStore.getState().setActiveReferenceTransformHandle({ mode: 'rotate', kind: 'free-rotate' })
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 15, y: 16, z: 17 },
        scale: { x: 1, y: 1, z: 1 },
      })
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

    expect(
      useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive ?? false,
    ).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      rotationDeg: { x: 5, y: 6, z: 7 },
    })
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
  })

  it('cancels a live Scale root drag on escape and returns to Transform', async () => {
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setReferenceTransformOverride('shoe:shoe-1', {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 2, y: 3, z: 4 },
      })
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useAppStore.getState().beginReferenceTransformShell('shoe:shoe-1')
      useAppStore.getState().beginReferenceTransformEntry('scale')
      useAppStore.getState().setActiveReferenceTransformHandle({ mode: 'scale', kind: 'center' })
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 6, y: 7, z: 8 },
      })
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(
      useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive ?? false,
    ).toBe(false)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById['shoe:shoe-1']).toMatchObject({
      scale: { x: 2, y: 3, z: 4 },
    })
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
  })

  it('enters the reference transform shell on transform and exits it only when CommitTransform is submitted', async () => {
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerCommitReferenceTransformSession = vi.fn(() => {
      useAppStore.getState().commitActiveReferenceTransformEntry()
    })
    setViewer({
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      commitReferenceTransformSession: viewerCommitReferenceTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.referenceId).toBe('shoe:shoe-1')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(false)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(useConsoleStore.getState().inputText).toBe('Move')

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().setActiveReferenceTransformDraft({
        position: { x: 4, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('vec3')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(useConsoleStore.getState().stagedNavigationSession?.validChoices[0]?.label).toBe(
      'CommitTransform',
    )

    await act(async () => {
      useConsoleStore.getState().setInputText('committransform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')
  })

  it('defaults transform space to local and lets Transform > W switch the shell to world', async () => {
    setViewer({
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.space).toBe(
      'local',
    )

    await act(async () => {
      useConsoleStore.getState().setInputText('w')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.space).toBe(
      'world',
    )
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Space: World applied'),
    ).toBe(true)
  })

  it('keeps the active mode root alive when Transform > Move > L reapplies local space', async () => {
    setViewer({
      setReferenceTransformSession: vi.fn(),
      activateTranslateCenterHandle: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('move')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive).toBe(
      true,
    )

    await act(async () => {
      useConsoleStore.getState().setInputText('l')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toMatchObject({
      entryActive: true,
      mode: 'translate',
      space: 'local',
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Space: Local already applied',
      ),
    ).toBe(true)
  })

  it('shows the full Settings > Space tree and lets escape step back out of it', async () => {
    setViewer({
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('se')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformSettingsRoot',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Settings > Choose next',
    )

    await act(async () => {
      useConsoleStore.getState().setInputText('space')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformSpaceRoot',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Settings > Space > Choose next',
    )

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformSettingsRoot',
    )

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformRoot',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Choose next',
    )
  })

  it('lets transform root jump straight to snap through the sn alias', async () => {
    setViewer({
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sn')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformSnapRoot',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Settings > Snap > Choose next',
    )
  })

  it('lets transform root jump straight to space through the sp alias', async () => {
    setViewer({
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sp')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformSpaceRoot',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Shoes > Shoe 1 > Viewer Transform > Settings > Space > Choose next',
    )
  })

  it('lets deep transform prompts switch space and collapse back to the owning mode root', async () => {
    const viewerCancelReferenceTransformDrag = vi.fn()
    const viewerClearReferenceTransformHandle = vi.fn()
    const viewerSetReferenceTransformSession = vi.fn()
    const viewerActivateTranslateCenterHandle = vi.fn()
    const viewerActivateTranslateHandle = vi.fn()
    setViewer({
      cancelReferenceTransformDrag: viewerCancelReferenceTransformDrag,
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setReferenceTransformSession: viewerSetReferenceTransformSession,
      activateTranslateCenterHandle: viewerActivateTranslateCenterHandle,
      activateTranslateHandle: viewerActivateTranslateHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('x')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('reference-transform.axis')

    await act(async () => {
      useConsoleStore.getState().setInputText('w')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toMatchObject({
      entryActive: true,
      mode: 'translate',
      space: 'world',
      activeHandle: null,
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(viewerCancelReferenceTransformDrag).toHaveBeenCalled()
    expect(viewerClearReferenceTransformHandle).toHaveBeenCalled()
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Space: World applied'),
    ).toBe(true)
  })

  it('shows one snap enable action at mode roots and uses Locked / Unlocked confirmation text', async () => {
    setViewer({
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('settings')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('snap')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('move')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformMoveSnapRoot',
    )
    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label),
    ).toEqual(['snap:On', 'snapXYZ:Unlock', 'Move X', 'Move Y', 'Move Z', 'Back'])

    await act(async () => {
      useConsoleStore.getState().setInputText('on')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Move snap: On'),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('settings')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('snap')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('move')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label),
    ).toEqual(['snap:Off', 'snapXYZ:Unlock', 'Move X', 'Move Y', 'Move Z', 'Back'])

    await act(async () => {
      useConsoleStore.getState().setInputText('unlock')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Move snap XYZ: Unlocked'),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('settings')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('snap')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      useConsoleStore.getState().setInputText('move')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label),
    ).toEqual(['snap:Off', 'snapXYZ:Lock', 'Move X', 'Move Y', 'Move Z', 'Back'])
  })

  it('replaces staged snap numeric autofill with the first typed key instead of appending to it', async () => {
    setViewer({
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    const input = container?.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sn')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('move')
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'referenceTransformMoveSnapRoot',
    )
    expect(useConsoleStore.getState().inputText).toBe('10')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(false)

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: '2', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('2')
    expect(useConsoleStore.getState().isStagedChoiceManualOverride).toBe(true)
  })

  it('closes the reference transform shell on escape when the user is at the transform root', async () => {
    const viewerClearReferenceTransformHandle = vi.fn()
    setViewer({
      clearReferenceTransformHandle: viewerClearReferenceTransformHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        referenceWorkspace: {
          ...state.referenceWorkspace,
          visibilityById: {
            ...state.referenceWorkspace.visibilityById,
            'shoe:shoe-1': true,
          },
          loadStateById: {
            ...state.referenceWorkspace.loadStateById,
            'shoe:shoe-1': 'loaded',
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceTransformRoot')
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.referenceId).toBe('shoe:shoe-1')

    const input = container.querySelector(
      'input[aria-label="Console input"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(viewerClearReferenceTransformHandle).toHaveBeenCalledTimes(1)
    expect(useAppStore.getState().referenceWorkspace.activeReferenceTransformSession).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')
  })

  it('falls back to graph scope when object selection is cleared', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')

    await act(async () => {
      useAppStore.getState().setWorkspaceSelectedTarget(null)
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Graph > graph_[1]')).toBe(true)
  })

  it('uses the same object scope for viewer-driven target sync as browser selection', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Content > Object 1')).toBe(true)
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 1 > Choose next',
    )
  })

  it('clears a selected object on escape', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
      })
      useAppStore.getState().selectPart('slot-a')
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toBeNull()
    expect(useAppStore.getState().selectedPartKey).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === '> esc'),
    ).toBe(true)
  })

  it('clears a selected reference on escape', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'reference-item',
          referenceId: 'shoe:shoe-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'reference-item',
          referenceId: 'shoe:shoe-1',
        },
      })
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === '> esc'),
    ).toBe(true)
  })

  it('clears a browser-selected reference on escape', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'reference-item',
          referenceId: 'shoe:shoe-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'reference-item',
            referenceId: 'shoe:shoe-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'reference-item',
          referenceId: 'shoe:shoe-1',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
  })

  it('clears a selected references root on escape', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'references-root',
        },
        explicitSelectedTargets: [
          {
            kind: 'references-root',
          },
        ],
        selectionAnchorTarget: {
          kind: 'references-root',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
  })

  it('clears a selected reference category on escape', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'reference-category',
          categoryId: 'shoes',
        },
        explicitSelectedTargets: [
          {
            kind: 'reference-category',
            categoryId: 'shoes',
          },
        ],
        selectionAnchorTarget: {
          kind: 'reference-category',
          categoryId: 'shoes',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceCategorySelected')

    await act(async () => {
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toBeNull()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
  })

  it('exposes transform under a selected object and routes direct move through the canonical branch', async () => {
    const viewerSetSelectedPart = vi.fn()
    const viewerSetContentObjectTransformSession = vi.fn()
    const viewerActivateTranslateCenterHandle = vi.fn()
    setViewer({
      setSelectedPart: viewerSetSelectedPart,
      setContentObjectTransformSession: viewerSetContentObjectTransformSession,
      activateTranslateCenterHandle: viewerActivateTranslateCenterHandle,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().selectPart('slot-a')
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text === 'Content > Choose next [ViewTransform, Move, Rotate, Scale, Zoom, Back]',
        ),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('m')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerSetSelectedPart).toHaveBeenCalledWith('slot-a')
    expect(viewerSetContentObjectTransformSession).toHaveBeenCalledWith({
      objectId: 'object-1',
      mode: 'translate',
      space: 'local',
      entryOrigin: {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    })
    expect(viewerActivateTranslateCenterHandle).toHaveBeenCalledTimes(1)
    expect(
      useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession?.objectId,
    ).toBe('object-1')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Assembly 1 > Component 1 > Object 1 > Viewer Transform > Choose next',
    )
  })

  it('enters Viewer Transform for a selected object when the autofill is submitted with enter', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    const openGraphDocumentInViewport = vi.fn(() => 'editor-viewport-transform')

    await act(async () => {
      useSpaghettiStore.setState((state) => ({
        ...state,
        openGraphDocumentInViewport,
      }))
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().inputText).toBe('ViewTransform')

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {})

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectTransformRoot')
    expect(
      useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession?.objectId,
    ).toBe('object-1')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Assembly 1 > Component 1 > Object 1 > Viewer Transform > Choose next',
    )
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Select > Content > Assembly 1 > Component 1 > Object 1 > Viewer Transform > Choose next [Move, Rotate, Scale, Snap, Settings, Back]',
      ),
    ).toBe(true)
    expect(openGraphDocumentInViewport).not.toHaveBeenCalled()
  })

  it('cycles generated object Transform root to Rotate on tab', async () => {
    const viewerSetContentObjectTransformSession = vi.fn()
    setViewer({
      setContentObjectTransformSession: viewerSetContentObjectTransformSession,
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }),
      )
    })

    expect(
      useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession,
    ).toMatchObject({
      objectId: 'object-1',
      mode: 'rotate',
      entryActive: true,
    })
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(container?.querySelector('.ConsoleBarSummary')?.textContent ?? '').toContain(
      'Select > Content > Assembly 1 > Component 1 > Object 1 > Viewer Transform > Choose next',
    )
    expect(viewerSetContentObjectTransformSession).toHaveBeenLastCalledWith(
      expect.objectContaining({
        objectId: 'object-1',
        mode: 'rotate',
        space:
          useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession?.space,
      }),
    )
  })

  it('shows DeleteLatest at the object transform root after the first committed entry and deletes it', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().selectPart('slot-a')
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().beginContentObjectTransformEntry('translate')
      useAppStore.getState().setActiveContentObjectTransformDraft({
        position: { x: 4, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().commitActiveContentObjectTransformEntry()
    })

    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label) ?? [],
    ).toContain('DeleteLatest')

    await act(async () => {
      useConsoleStore.getState().setInputText('delete')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().entries.slice(-6).map((entry) => entry.text)).toContain(
      'Deleted latest transform entry',
    )
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByObjectId['object-1'] ?? [],
    ).toHaveLength(0)
    expect(
      useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById['object-1'] ?? {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    ).toMatchObject(
      {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      },
    )
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectTransformRoot')
    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label) ?? [],
    ).toEqual(['Move', 'Rotate', 'Scale', 'Snap', 'Settings', 'Back'])
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Deleted latest transform entry'),
    ).toBe(true)
  })

  it('keeps DeleteLatest available across transform re-entry for content objects and confirms cross-session deletion', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          assembliesById: {
            'assembly-root:project-file-1': {
              assemblyId: 'assembly-root:project-file-1',
              label: 'Assembly 1',
              childRowIds: ['component-1'],
            },
          },
          componentsById: {
            'component-1': {
              componentId: 'component-1',
              ownerGraphDocumentId: 'graph-document-1',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              label: 'Component 1',
              componentSourceKind: 'published-component',
              resolutionState: 'resolved',
              receiveId: null,
              parentAssemblyId: 'assembly-root:project-file-1',
              childObjectIds: ['object-1'],
            },
          },
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().selectPart('slot-a')
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
      useConsoleStore.getState().setInputText('transform')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useAppStore.getState().beginContentObjectTransformEntry('translate')
      useAppStore.getState().setActiveContentObjectTransformDraft({
        position: { x: 4, y: 0, z: 0 },
        rotationDeg: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      useAppStore.getState().commitActiveContentObjectTransformEntry()
    })

    await act(async () => {
      useAppStore.getState().exitContentObjectTransformShell()
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    await act(async () => {})

    expect(useAppStore.getState().referenceWorkspace.activeContentObjectTransformSession).toBeNull()

    await act(async () => {
      useConsoleStore.getState().setInputText('transform')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().stagedNavigationSession?.validChoices.map((choice) => choice.label) ?? [],
    ).toContain('DeleteLatest')

    await act(async () => {
      useConsoleStore.getState().setInputText('delete')
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().consolePromptSession?.kind).toBe('transform.delete-latest.confirm')
    expect(useConsoleStore.getState().inputText).toBe('yes')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text ===
          'Delete latest will remove an entry from the previous transform. Are you sure?',
      ),
    ).toBe(true)

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByObjectId['object-1'] ?? [],
    ).toHaveLength(0)
    expect(useConsoleStore.getState().consolePromptSession).toBeNull()
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Deleted latest transform entry'),
    ).toBe(true)
  })

  it('uses the same object-local zoom branch for viewer-driven target sync as browser selection', async () => {
    const viewerFrameSelected = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: viewerFrameSelected,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameSelected).toHaveBeenCalledWith('graph-document-1:slot-a')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 1 > Choose next',
    )
  })

  it('frames a browser-selected object from object-local z even when selectedPartKey is null', async () => {
    const viewerFrameSelected = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: viewerFrameSelected,
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
        selectedPartKey: null,
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Select > Content > Object 1 > Zoom',
      ),
    ).toBe(true)
    expect(viewerFrameSelected).toHaveBeenCalledWith('graph-document-1:slot-a')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Zoom Object requires a selected part, object, or reference',
      ),
    ).toBe(false)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 1 > Choose next',
    )
  })

  it('aligns the active viewport to the selected graph document when multiple graph editor viewports are open', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    let secondGraphId = ''
    let secondViewportId = ''

    await act(async () => {
      root?.render(<ConsoleDock />)
      secondGraphId = useSpaghettiStore.getState().createGraphDocument(
        {
          schemaVersion: 1,
          nodes: [
            {
              nodeId: 'node-second-1',
              type: 'Geometry/Sketch',
              params: getDefaultNodeParams('Geometry/Sketch'),
            },
          ],
          edges: [],
        },
        'Graph 2',
      )
      const firstViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport('graph-document-1')
      secondViewportId = useSpaghettiStore.getState().openGraphDocumentInViewport(secondGraphId) ?? ''
      if (firstViewportId === null || secondViewportId.length === 0) {
        throw new Error('Expected graph editor viewports to open')
      }
      useSpaghettiStore.setState((state) => ({
        ...state,
        activeGraphDocumentId: 'graph-document-1',
        activeEditorViewportId: firstViewportId,
        selectedNodeId: 'node-stale-active',
        editorViewportSelectedNodeIdById: {
          ...state.editorViewportSelectedNodeIdById,
          [firstViewportId]: 'node-stale-active',
          [secondViewportId]: 'node-second-1',
        },
      }))
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'object-second-1': {
              objectId: 'object-second-1',
              ownerGraphDocumentId: secondGraphId,
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: secondGraphId,
              sourceOutputEntryId: 'output-entry-second-1',
              sourceNodeId: 'node-output-second-1',
              slotId: 'slot-second-1',
              label: 'Object Second 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: {
          kind: 'object',
          objectId: 'object-second-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-second-1',
          },
        ],
        selectionAnchorTarget: {
          kind: 'object',
          objectId: 'object-second-1',
        },
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
    expect(form).not.toBeNull()
    expect(useSpaghettiStore.getState().activeGraphDocumentId).toBe(secondGraphId)
    expect(useSpaghettiStore.getState().activeEditorViewportId).toBe(secondViewportId)
    expect(useConsoleStore.getState().stagedNavigationSession?.selections.graphDocumentId).toBe(
      secondGraphId,
    )
  })

  it('updates the object-selected console session when viewer sync changes to a different object in the same graph', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
            'object-2': {
              objectId: 'object-2',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-2',
              sourceNodeId: 'node-output-2',
              slotId: 'slot-b',
              label: 'Object 2',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 1 > Choose next',
    )

    await act(async () => {
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-2',
      })
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 2 > Choose next',
    )
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Content > Object 2')).toBe(true)
  })

  it('keeps selected object context ahead of spaghetti graph fallback sync', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.setState((state) => ({
        ...state,
        projectContent: {
          ...state.projectContent,
          objectsById: {
            'object-1': {
              objectId: 'object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: null,
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-output-1',
              slotId: 'slot-a',
              label: 'Object 1',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('spaghetti')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('contentObjectSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 1 > Choose next',
    )
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
        .entries.some(
          (entry) => entry.text.startsWith('Root > Choose next ['),
        ),
    ).toBe(true)
  })

  it('prefers the active spaghetti graph on surface-activation even when a stale selected target exists', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'object',
        objectId: 'object-1',
      })
      useAppStore.getState().setActiveSurface('spaghetti')
      useAppStore.getState().requestConsoleContextSync('surface-activation')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Root > Graph Documents > Graph 1 > Choose next',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).not.toContain('Object 1')
  })

  it('prefers an explicit viewer-root handoff over stale selected-target compatibility', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'footpad:pubpad-full-assembly',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')

    await act(async () => {
      useAppStore.getState().requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'viewer',
        mode: 'root',
        graphDocumentId: null,
        nodeId: null,
        editorViewportId: null,
        selectedTarget: useAppStore.getState().workspaceSelection.selectedTarget,
      })
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Root > Choose next')
  })

  it('prefers an explicit spaghetti graph handoff over stale selected-target compatibility', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'footpad:pubpad-full-assembly',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')

    await act(async () => {
      useAppStore.getState().requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'spaghetti',
        mode: 'graph',
        graphDocumentId: 'graph-document-1',
        nodeId: null,
        editorViewportId: 'editor-viewport-1',
        selectedTarget: useAppStore.getState().workspaceSelection.selectedTarget,
      })
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Root > Graph Documents > Graph 1 > Choose next',
    )
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).not.toContain('Premade')
  })

  it('does not replay legacy target-selection after an explicit browser selection handoff', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'references-root',
      })
      useAppStore.getState().requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'browser',
        mode: 'selection',
        graphDocumentId: null,
        nodeId: null,
        editorViewportId: null,
        selectedTarget: {
          kind: 'references-root',
        },
      })
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referencesSelected')
    expect(
      useConsoleStore.getState().entries.filter((entry) => entry.text === 'Select > References'),
    ).toHaveLength(1)
    expect(
      useConsoleStore
        .getState()
        .entries.filter((entry) => entry.text.includes('References > Choose next [')),
    ).toHaveLength(1)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(false)
  })

  it('ignores a stale surface-clear replay while spaghetti remains the active surface', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setActiveSurface('spaghetti')
      useAppStore.getState().requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'spaghetti',
        mode: 'graph',
        graphDocumentId: 'graph-document-1',
        nodeId: null,
        editorViewportId: 'editor-viewport-1',
        selectedTarget: null,
      })
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')

    await act(async () => {
      useAppStore.getState().requestConsoleContextSync('surface-clear')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Root > Graph Documents > Graph 1 > Choose next',
    )
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(false)
  })

  it('treats repeated explicit spaghetti graph handoffs as meaningful even when scope repeats', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'spaghetti',
        mode: 'graph',
        graphDocumentId: 'graph-document-1',
        nodeId: null,
        editorViewportId: 'editor-viewport-1',
        selectedTarget: null,
      })
    })

    const firstGraphPromptCount = useConsoleStore
      .getState()
      .entries.filter((entry) => entry.text.includes('Graph > Choose next')).length

    await act(async () => {
      useAppStore.getState().requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'spaghetti',
        mode: 'graph',
        graphDocumentId: 'graph-document-1',
        nodeId: null,
        editorViewportId: 'editor-viewport-1',
        selectedTarget: null,
      })
    })

    const secondGraphPromptCount = useConsoleStore
      .getState()
      .entries.filter((entry) => entry.text.includes('Graph > Choose next')).length

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(secondGraphPromptCount).toBeGreaterThan(firstGraphPromptCount)
  })

  it('uses the existing node-selected console path for an explicit spaghetti node handoff', async () => {
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
        ],
        edges: [],
      })
      useAppStore.getState().requestConsoleWorkspaceContextHandoff({
        sourceSurface: 'spaghetti',
        mode: 'node',
        graphDocumentId: 'graph-document-1',
        nodeId: 'node-cube-1',
        editorViewportId: 'editor-viewport-1',
        selectedTarget: null,
      })
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphNodeSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Root > Graph Documents > Graph 1 > Focus Node > node_[1] Cube > Choose next',
    )
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
        .entries.filter(
          (entry) => entry.text.startsWith('Root > Choose next ['),
        ),
    ).toHaveLength(1)
    const summaryText = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Root > Choose next')
    expect(summaryText).toContain('Graph')
    expect(summaryText).toContain('References')
    expect(summaryText).toContain('Camera')
    expect(summaryText).toContain('Radio')
    expect(summaryText).toContain('Zoom')
    expect(summaryText).toContain('Pan')
    expect(summaryText).toContain('Orbit')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(false)
  })

  it('keeps the full root prompt after viewer deselect, esc, and a second empty viewport click', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useAppStore.getState().setWorkspaceSelectedTarget({
        kind: 'reference-item',
        referenceId: 'footpad:pubpad-full-assembly',
      })
      useAppStore.getState().setActiveSurface('browser')
      useAppStore.getState().requestConsoleContextSync('target-selection')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('referenceSelected')

    await act(async () => {
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('surface-clear')
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')

    const input = container.querySelector(
      'input[aria-label=\"Console input\"]',
    ) as HTMLInputElement | null

    await act(async () => {
      input?.focus()
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()

    await act(async () => {
      useAppStore.getState().setActiveSurface('viewer')
      useAppStore.getState().requestConsoleContextSync('surface-clear')
    })

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    const summaryText = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Root > Choose next')
    expect(summaryText).toContain('Graph')
    expect(summaryText).toContain('References')
    expect(summaryText).toContain('Camera')
    expect(summaryText).toContain('Radio')
    expect(summaryText).toContain('Zoom')
    expect(summaryText).toContain('Pan')
    expect(summaryText).toContain('Orbit')
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
        .entries.filter(
          (entry) => entry.text.startsWith('Root > Choose next ['),
        ),
    ).toHaveLength(1)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text ===
            'Graph > Choose next [Sketch, Extrude, Output Preview, Focus Node, Zoom, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
        ),
    ).toBe(true)
  })

  it('enters the root zoom family and prefills the first zoom action', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('zoomRoot')
    expect(useConsoleStore.getState().inputText).toBe('All')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Zoom'),
    ).toBe(true)
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Zoom > Choose next')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text === 'Zoom > Choose next [All, Extents, Previous, Window, Object, Back]',
      ),
    ).toBe(true)
  })

  it('enters sketch draw zoom and returns to sketch draw after z > e completes', async () => {
    const viewerFrameGeometrySketch = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: viewerFrameGeometrySketch,
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useSpaghettiStore.getState().setGraph({
        schemaVersion: 1,
        nodes: [
          {
            nodeId: 'sketch_1',
            type: 'Geometry/Sketch',
            params: getDefaultNodeParams('Geometry/Sketch'),
          },
        ],
        edges: [],
      })
      useSpaghettiStore.getState().startGeometrySketchSession('sketch_1', 'draw')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    expect(useSpaghettiStore.getState().geometrySketchSession?.mode).toBe('draw')

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawZoomRoot')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Graph > Sketch > Sketch Draw > Zoom > Choose next',
    )

    await act(async () => {
      useConsoleStore.getState().setInputText('e')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameGeometrySketch).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Choose next')
  })

  it('uses sketch-selected geometry for sketch draw z > o', async () => {
    const viewerFrameSelectedGeometrySketch = vi.fn(() => true)
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      frameSelectedGeometrySketch: viewerFrameSelectedGeometrySketch,
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

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
                    type: 'line',
                    a: { x: 0, y: 0 },
                    b: { x: 25, y: 10 },
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
      useConsoleStore.getState().setInputText('z > o')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameSelectedGeometrySketch).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
  })

  it('arms zoom window from sketch draw z > w and returns to sketch draw', async () => {
    const viewerSetConsoleCameraMode = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      frameSelectedGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: vi.fn(),
      setConsoleCameraMode: viewerSetConsoleCameraMode,
    } as any)

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
      useConsoleStore.getState().setInputText('z > w')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerSetConsoleCameraMode).toHaveBeenCalledWith('zoom-window')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
  })

  it('arms pan from idle sketch draw and keeps the local sketch draw scope', async () => {
    const viewerSetConsoleCameraMode = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      frameSelectedGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: vi.fn(),
      setConsoleCameraMode: viewerSetConsoleCameraMode,
    } as any)

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
      useConsoleStore.getState().setInputText('pan')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerSetConsoleCameraMode).toHaveBeenCalledWith('pan')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
  })

  it('defaults Graph > Zoom to Canvas first', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('g')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')

    await act(async () => {
      useConsoleStore.getState().setInputText('z')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphZoomRoot')
    expect(useConsoleStore.getState().inputText).toBe('Canvas')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) =>
          entry.text === 'Graph > Zoom > Choose next [Canvas, Model Viewport, Back]',
      ),
    ).toBe(true)
  })

  it('frames model extents from z > e and arms pan from pan', async () => {
    const viewerFrameAll = vi.fn()
    const viewerFrameExtents = vi.fn()
    const viewerSetConsoleCameraMode = vi.fn()
    setViewer({
      frameAll: viewerFrameAll,
      frameExtents: viewerFrameExtents,
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: vi.fn(),
      setConsoleCameraMode: viewerSetConsoleCameraMode,
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('z > e')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameExtents).toHaveBeenCalledTimes(1)
    expect(viewerFrameAll).not.toHaveBeenCalled()
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(useConsoleStore.getState().inputText).toBe('Graph')

    await act(async () => {
      useConsoleStore.getState().setInputText('pan')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerSetConsoleCameraMode).toHaveBeenCalledWith('pan')
  })

  it('returns to root after flat z > a completes', async () => {
    const viewerFrameAll = vi.fn()
    setViewer({
      frameAll: viewerFrameAll,
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: vi.fn(),
      setConsoleCameraMode: vi.fn(),
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('z > a')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerFrameAll).toHaveBeenCalledTimes(1)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
    expect(useConsoleStore.getState().inputText).toBe('Graph')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Root > Choose next',
    )
  })

  it('arms zoom window from flat z > w and returns to root', async () => {
    const viewerSetConsoleCameraMode = vi.fn()
    setViewer({
      frameAll: vi.fn(),
      frameExtents: vi.fn(),
      frameGeometrySketch: vi.fn(),
      frameSelectedGeometrySketch: vi.fn(),
      framePrevious: vi.fn(),
      frameSelected: vi.fn(),
      frameReference: vi.fn(),
      setConsoleCameraMode: viewerSetConsoleCameraMode,
    } as any)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('z > w')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(viewerSetConsoleCameraMode).toHaveBeenCalledWith('zoom-window')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('root')
  })

  it('returns to graph after graph-scoped z > a completes', async () => {
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

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')

    await act(async () => {
      useConsoleStore.getState().setInputText('z > a')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Root > Graph Documents > Graph 1 > Choose next',
    )
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

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
    })
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) => entry.text === 'Graph > Sketch > Sketch Draw > Choose next [Line, PLine, Rectangle, Circle, Camera, Zoom, Done, Back, X]',
        ),
    ).toBe(true)
  })

  it('uses done in idle sketch draw to close the session and return to the selected sketch scope', async () => {
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

    const form = () => container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form()?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('s')
      form()?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      useConsoleStore.getState().setInputText('sd')
      form()?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
    expect(useSpaghettiStore.getState().geometrySketchSession?.mode).toBe('draw')

    await act(async () => {
      useConsoleStore.getState().setInputText('d')
      form()?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().geometrySketchSession).toBeNull()
    expect(
      useAppStore
        .getState()
        .sketchVisibilityByRowId['project-sketch:graph-document-1:node-sketch-1:sketch-1'],
    ).toBe(true)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSketchSelected')
    expect(
      useConsoleStore.getState().entries.some(
        (entry) => entry.text === 'Sketch > Choose next [Sketch Plane, Sketch Draw, Delete, Back]',
      ),
    ).toBe(true)
  })

  it('opens radio from sketch draw without closing the draw session', async () => {
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
      useConsoleStore.getState().setInputText('r')
    })

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('radioRoot')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
    })
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Select > Radio'),
    ).toBe(true)
  })

  it('returns to sketch draw after radio on is accepted from sketch draw', async () => {
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

    expect(useAudioSamplerStore.getState().isRadioEnabled).toBe(true)
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
    expect(useSpaghettiStore.getState().geometrySketchSession).toMatchObject({
      nodeId: 'node-sketch-1',
      mode: 'draw',
    })
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) => entry.text.startsWith('Graph > Sketch > Sketch Draw > Choose next ['),
        ),
    ).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(false)
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
    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain('Choose next')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Line',
    )

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
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

  it('routes sketch draw camera projection through local staged navigation', async () => {
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
      useConsoleStore.getState().setInputText('c')
    })

    const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawCameraRoot')

    await act(async () => {
      useConsoleStore.getState().setInputText('projection')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe(
      'sketchDrawCameraProjectionRoot',
    )

    await act(async () => {
      useConsoleStore.getState().setInputText('o')
    })

    await act(async () => {
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useUiPrefsStore.getState().view.projectionMode).toBe('orthographic')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('sketchDrawRoot')
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Projection: Orthographic'),
    ).toBe(true)
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
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

  it('submits a non-empty console draft on Enter after focus moves into the spaghetti surface', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleDock />)
      useConsoleStore.getState().setInputText('g')
    })

    const spaghettiSurface = document.createElement('div')
    spaghettiSurface.tabIndex = 0
    document.body.appendChild(spaghettiSurface)
    spaghettiSurface.focus()
    expect(document.activeElement).toBe(spaghettiSurface)

    await act(async () => {
      spaghettiSurface.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
    expect(useConsoleStore.getState().inputText).toBe('Sketch')
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> g')).toBe(true)
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
      'Root > Graph Documents > Graph 1 > Choose next',
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Extrude')
    expect(
      container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent,
    ).toContain('Extrude')

    await act(async () => {
      input?.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
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
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('Extrude')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Extrude',
    )

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
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
