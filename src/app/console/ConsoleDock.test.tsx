// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { getDefaultNodeParams } from '../spaghetti/registry/nodeRegistry'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
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

    expect(useConsoleStore.getState().entries).toHaveLength(2)

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
    expect(useConsoleStore.getState().entries).toHaveLength(2)
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

    expect(useConsoleStore.getState().inputText).toBe('help')
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
    expect(useConsoleStore.getState().inputText).toBe('')
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

    expect(useConsoleStore.getState().inputText).toBe('')
  })

  it('keeps sketch draw feature-assist prefill stable instead of flat auto-capturing printable keys', async () => {
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

    expect(useConsoleStore.getState().inputText).toBe('Line')
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

    expect(useConsoleStore.getState().inputText).toBe('Line')

    await act(async () => {
      useSpaghettiStore.getState().closeGeometrySketchSession()
    })

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'b', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('b')
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
    })
    expect(useConsoleStore.getState().entries.some((entry) => entry.text === '> xy')).toBe(true)
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Sketch plane selected: XY'),
    ).toBe(true)
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
    expect(texts).toContain('PLINE Specify start point:')
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
      useConsoleStore.getState().entries.some((entry) => entry.text === 'LINE Specify start point:'),
    ).toBe(true)
  })

  it('uses esc twice in sketch draw to clear the draft and then return to session idle', async () => {
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
    expect(useSpaghettiStore.getState().geometrySketchSession?.drawDraft).toEqual({
      points: [],
      hoverPoint: null,
      hoverSnapTarget: null,
    })
    expect(useSpaghettiStore.getState().geometrySketchSession?.activeTool).toBe('line')

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
    expect(
      useConsoleStore.getState().entries.filter((entry) => entry.text === '> esc'),
    ).toHaveLength(2)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Sketch Draw > [Line, PLine, X]'),
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
      ),
    ).toBe(true)
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
          'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(
      useConsoleStore.getState().entries.some((entry) => entry.text === 'Returned to root'),
    ).toBe(true)
    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text === 'Root > Choose next [Graph]'),
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

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
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

    expect(useConsoleStore.getState().stagedNavigationSession).toBeNull()
    expect(
      useConsoleStore
        .getState()
        .entries.filter((entry) => entry.text === 'Root > Choose next [Graph]'),
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
        .entries.filter((entry) => entry.text === 'Root > Choose next [Graph]'),
    ).toHaveLength(1)
    expect(
      useConsoleStore
        .getState()
        .entries.some(
          (entry) =>
            entry.text ===
            'Graph > Choose next [Sketch, Extrude, Output Preview, Collapsed, Essentials, Expanded, References, Open, Build, Back]',
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
        .entries.some((entry) => entry.text === 'Sketch Draw > [Line, PLine, X]'),
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

    await act(async () => {
      window.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true }),
      )
    })

    expect(useConsoleStore.getState().inputText).toBe('XZ')
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'XZ',
    )

    await act(async () => {
      const form = container?.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().sketchPlanePickSession).toMatchObject({
      nodeId: 'node-sketch-1',
      stage: 'adjust',
      draftPlane: 'XZ',
    })
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

  it('clears staged input on first escape and cancels the staged session on second escape', async () => {
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

    expect(useConsoleStore.getState().inputText).toBe('')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')
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

  it('restores meatball editor view when graph root is cancelled after escape clears the prefill', async () => {
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

    expect(useConsoleStore.getState().inputText).toBe('')
    expect(useConsoleStore.getState().stagedNavigationSession?.scopeId).toBe('graphSelected')

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
    expect(container.querySelector('.ConsoleBarSummaryChoice.isActive')?.textContent).toContain(
      'Sketch',
    )
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
