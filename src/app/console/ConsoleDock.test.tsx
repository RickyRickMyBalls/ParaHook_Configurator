// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
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
  const originalWindowOpen = window.open
  const originalWorker = globalThis.Worker

  beforeEach(async () => {
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    window.open = originalWindowOpen
    globalThis.Worker = MockWorker as unknown as typeof Worker
    ;({ ConsoleDock } = await import('./ConsoleDock'))
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root.unmount()
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
      const form = container.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(useConsoleStore.getState().entries).toHaveLength(2)

    const toggle = container.querySelector(
      'button[aria-label="Expand console"]',
    ) as HTMLButtonElement | null
    await act(async () => {
      toggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

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
    let beforeUnloadHandler: (() => void) | null = null
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: () => undefined,
      close: () => {
        popoutWindow.closed = true
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
      beforeUnloadHandler?.call(popoutWindow, new Event('beforeunload'))
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
      const listButton = container.querySelector(
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
    const popoutWindow = {
      closed: false,
      document: popoutDocument,
      focus: () => undefined,
      close: () => {
        popoutWindow.closed = true
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
      const form = container.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    expect(
      useConsoleStore
        .getState()
        .entries.some((entry) => entry.text.includes('Status: input=legacy, view=parts')),
    ).toBe(true)

    await act(async () => {
      useConsoleStore.getState().setInputText('mirror')
    })

    await act(async () => {
      const form = container.querySelector('.ConsoleBar form') as HTMLFormElement | null
      form?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    })

    const lastEntry = useConsoleStore.getState().entries.at(-1)
    expect(lastEntry?.layer).toBe('Diagnostics')
    expect(lastEntry?.text).toBe('Unknown command: mirror')
  })
})
