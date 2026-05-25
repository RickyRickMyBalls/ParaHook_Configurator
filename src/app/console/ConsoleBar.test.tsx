// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ROOT_PROMPT_TEXT } from './consolePromptText'
import { getConsoleRootChoiceLabels } from './stagedNavigation'
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

describe('ConsoleBar', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  let ConsoleBar: typeof import('./ConsoleBar').ConsoleBar
  const originalWorker = globalThis.Worker

  beforeEach(async () => {
    globalThis.Worker = MockWorker as unknown as typeof Worker
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
    ;({ ConsoleBar } = await import('./ConsoleBar'))
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
    globalThis.Worker = originalWorker
  })

  it('highlights the preferred short alias inside guided choice labels', async () => {
    useConsoleStore.setState({
      featureAssistDescriptor: {
        label: 'Sketch Plane > Move',
        breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Move'],
        prefill: 'Move X',
        choices: [
          { canonicalToken: 'MOVE X', aliases: ['X', 'MX'], label: 'Move X' },
          { canonicalToken: 'SNAP', aliases: ['S'], label: 'Snap' },
          { canonicalToken: 'BACK', aliases: ['B'], label: 'Back' },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    const moveChoice = container.querySelectorAll('.ConsoleBarSummaryChoice')[0] as HTMLElement | undefined
    const snapChoice = container.querySelectorAll('.ConsoleBarSummaryChoice')[1] as HTMLElement | undefined
    const backChoice = container.querySelectorAll('.ConsoleBarSummaryChoice')[2] as HTMLElement | undefined

    expect(moveChoice?.textContent).toBe('Move X, ')
    expect(
      Array.from(moveChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['X'])
    expect(
      Array.from(snapChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['S'])
    expect(
      Array.from(backChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['B'])
  })

  it('renders Sketch Plane feature assist with the full scoped breadcrumb', async () => {
    useConsoleStore.setState({
      featureAssistDescriptor: {
        label: 'Sketch Plane',
        breadcrumb: ['Graph', 'Sketch', 'Sketch Plane'],
        prefill: 'XY',
        choices: [
          { canonicalToken: 'XY', aliases: [], label: 'XY' },
          { canonicalToken: 'XZ', aliases: [], label: 'XZ' },
          { canonicalToken: 'YZ', aliases: [], label: 'YZ' },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    const summaryText = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Graph > Sketch > Sketch Plane > Choose next')
    expect(summaryText).not.toContain('Root')
  })

  it('renders Sketch Draw feature assist as scoped mode ahead of root staged summary', async () => {
    useConsoleStore.setState({
      featureAssistDescriptor: {
        label: 'Sketch Draw',
        breadcrumb: ['Graph', 'Sketch', 'Sketch Draw'],
        prefill: 'Line',
        choices: [
          { canonicalToken: 'LINE', aliases: ['L'], label: 'Line' },
          { canonicalToken: 'RECTANGLE', aliases: ['REC'], label: 'Rectangle' },
          { canonicalToken: 'X', aliases: [], label: 'X' },
        ],
      },
      stagedNavigationSession: {
        scopeId: 'root',
        breadcrumb: ['Root'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
        },
        validChoices: [
          {
            label: 'Graph',
            aliases: ['G'],
            canonicalToken: 'GRAPH',
            kind: 'scope',
          },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    const summaryText = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Graph > Sketch > Sketch Draw > Choose next')
    expect(summaryText).toContain('Line')
    expect(summaryText).not.toContain('Root')
  })

  it('renders status-style Sketch Draw assist with scoped breadcrumb and no empty brackets', async () => {
    useConsoleStore.setState({
      featureAssistDescriptor: {
        label: 'Sketch Draw',
        breadcrumb: ['Graph', 'Sketch', 'Sketch Draw', 'L', 'P1', 'Vec(1.5,-2.25)'],
        prefill: null,
        choices: [],
        summaryLeadText: ' > Waiting for point',
        summaryMode: 'status',
      },
      stagedChoiceIndex: null,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    const summaryText = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Graph > Sketch > Sketch Draw > L > P1 > Vec(1.5,-2.25)')
    expect(summaryText).toContain('Waiting for point')
    expect(summaryText).not.toContain('Root')
    expect(summaryText).not.toContain('[]')
  })

  it('uses workspace-modes one-letter aliases by default and promotes only collisions', async () => {
    useConsoleStore.setState({
      stagedNavigationSession: {
        scopeId: 'workspaceModeViewportTypeSelected',
        breadcrumb: ['Root', 'Workspace Modes', 'Browser Viewport', 'Viewport Type Menu'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
          workspaceViewportId: 'browser-workspace-slot-2',
        },
        validChoices: [
          {
            label: 'Model Viewport',
            aliases: ['MV'],
            canonicalToken: 'MODELVIEWPORT',
            kind: 'action',
          },
          {
            label: 'Browser',
            aliases: ['BRO'],
            canonicalToken: 'BROWSER',
            kind: 'action',
          },
          {
            label: 'Console',
            aliases: ['C'],
            canonicalToken: 'CONSOLE',
            kind: 'action',
          },
          {
            label: 'Back',
            aliases: ['B'],
            canonicalToken: 'BACK',
            kind: 'scope',
          },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    const choiceNodes = Array.from(container.querySelectorAll('.ConsoleBarSummaryChoice'))
    const aliasTexts = choiceNodes.map((choiceNode) =>
      Array.from(choiceNode.querySelectorAll('.ConsoleBarSummaryChoiceAlias')).map((node) => node.textContent).join(
        '',
      ),
    )

    expect(aliasTexts).toEqual(['M', 'Br', 'C', 'B'])
  })

  it('treats escape as step-back immediately for reference transform value prompts', async () => {
    const cancelSpy = { called: false }

    useConsoleStore.setState({
      consolePromptSession: {
        kind: 'reference-transform.axis',
        breadcrumb: ['Select', 'References', 'Wearable', 'Shoe 1', 'Transform', 'Move', 'Move X'],
        label: 'Select > References > Wearable > Shoe 1 > Transform > Move > Move X',
        prefill: '12',
        returnSession: {
          scopeId: 'referenceTransformRoot',
          breadcrumb: ['Select', 'References', 'Wearable', 'Shoe 1', 'Transform'],
          selections: {
            graphDocumentId: null,
            selectedNodeId: null,
            sketchNodeId: null,
            referenceId: 'shoe:shoe-1',
            referenceCategoryId: 'shoes',
            referenceCanLoadModel: true,
          },
          validChoices: [],
        },
        mode: 'translate',
        axis: 'x',
      },
      inputText: '12',
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ConsoleBar
          onCancelCommand={() => {
            cancelSpy.called = true
          }}
        />,
      )
    })

    const input = container.querySelector('.ConsoleInput') as HTMLInputElement | null
    expect(input).not.toBeNull()

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
    })

    expect(cancelSpy.called).toBe(true)
    expect(useConsoleStore.getState().inputText).toBe('12')
  })

  it('shows the full staged breadcrumb for object selection scopes', async () => {
    useConsoleStore.setState({
      stagedNavigationSession: {
        scopeId: 'contentObjectSelected',
        breadcrumb: ['Select', 'Content', 'Object 1'],
        selections: {
          graphDocumentId: 'graph-document-1',
          selectedNodeId: null,
          sketchNodeId: null,
          referenceId: null,
        },
        validChoices: [
          {
            label: 'Back',
            aliases: ['B'],
            canonicalToken: 'BACK',
            kind: 'action',
          },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 1 > Choose next',
    )
  })

  it('shows the full staged breadcrumb for object zoom scopes', async () => {
    useConsoleStore.setState({
      stagedNavigationSession: {
        scopeId: 'contentObjectZoomRoot',
        breadcrumb: ['Select', 'Content', 'Object 1', 'Zoom'],
        selections: {
          graphDocumentId: 'graph-document-1',
          selectedNodeId: null,
          sketchNodeId: null,
          referenceId: null,
        },
        validChoices: [
          {
            label: 'All',
            aliases: ['A'],
            canonicalToken: 'ALL',
            kind: 'action',
          },
          {
            label: 'Back',
            aliases: ['B'],
            canonicalToken: 'BACK',
            kind: 'action',
          },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Content > Object 1 > Zoom > Choose next',
    )
  })

  it('shows the full staged breadcrumb for reference zoom scopes', async () => {
    useConsoleStore.setState({
      stagedNavigationSession: {
        scopeId: 'referenceZoomRoot',
        breadcrumb: ['Select', 'Reference', 'Shoe 1', 'Zoom'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
          referenceId: 'shoe:shoe-1',
          referenceCategoryId: null,
          referenceCanLoadModel: true,
        },
        validChoices: [
          {
            label: 'All',
            aliases: ['A'],
            canonicalToken: 'ALL',
            kind: 'action',
          },
          {
            label: 'Back',
            aliases: ['B'],
            canonicalToken: 'BACK',
            kind: 'action',
          },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > Reference > Shoe 1 > Zoom > Choose next',
    )
  })

  it('renders read-only status assist descriptors without empty choice brackets', async () => {
    useConsoleStore.setState({
      featureAssistDescriptor: {
        label: 'Shoe 1 > M',
        breadcrumb: ['Shoe 1', 'M', 'Vec3 [0.0, 0.0, 0.0]'],
        prefill: null,
        choices: [],
        summaryLeadText: ' > Read only',
        summaryMode: 'status',
      },
      stagedChoiceIndex: null,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    const summaryText = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Shoe 1 > M > Vec3 [0.0, 0.0, 0.0]')
    expect(summaryText).toContain('Read only')
    expect(summaryText).not.toContain('[]')
  })

  it('shows the full staged breadcrumb for references-root zoom scopes', async () => {
    useConsoleStore.setState({
      stagedNavigationSession: {
        scopeId: 'referencesZoomRoot',
        breadcrumb: ['Select', 'References', 'Zoom'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
          referenceId: null,
          referenceZoomIds: ['shoe:shoe-1'],
        },
        validChoices: [
          {
            label: 'All',
            aliases: ['A'],
            canonicalToken: 'ALL',
            kind: 'action',
          },
          {
            label: 'Back',
            aliases: ['B'],
            canonicalToken: 'BACK',
            kind: 'action',
          },
        ],
      },
      stagedChoiceIndex: 0,
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    expect(container.querySelector('.ConsoleBarSummary')?.textContent).toContain(
      'Select > References > Zoom > Choose next',
    )
  })

  it('keeps root alias hints when the summary is rendered from the fallback prompt text', async () => {
    useConsoleStore.setState({
      entries: [
        {
          id: 'entry-1',
          sequence: 1,
          createdAtMs: 1,
          timestampLabel: '00:00:01',
          text: ROOT_PROMPT_TEXT,
          layer: 'Commands',
          commandLineKind: null,
          source: 'console',
          severity: 'info',
        },
      ],
      stagedNavigationSession: null,
      consolePromptSession: null,
      featureAssistDescriptor: null,
      stagedChoiceIndex: null,
      inputText: '',
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<ConsoleBar />)
    })

    const summaryText = container.querySelector('.ConsoleBarSummary')?.textContent ?? ''
    expect(summaryText).toContain('Root > Choose next')
    getConsoleRootChoiceLabels().forEach((label) => {
      expect(summaryText).toContain(label)
    })

    const choices = Array.from(
      container.querySelectorAll('.ConsoleBarSummaryChoice'),
    ) as HTMLElement[]
    const sketchChoice = choices.find((choice) => choice.textContent?.includes('Sketch,'))
    const newSketchChoice = choices.find((choice) => choice.textContent?.includes('New Sketch'))
    const newGraphChoice = choices.find((choice) => choice.textContent?.includes('New Graph'))
    const referencesChoice = choices.find((choice) => choice.textContent?.includes('References'))
    const workspaceModesChoice = choices.find((choice) =>
      choice.textContent?.includes('Workspace Modes'),
    )
    const consoleInputChoice = choices.find((choice) => choice.textContent?.includes('ConsoleInput'))
    const cameraChoice = choices.find((choice) => choice.textContent?.includes('Camera'))

    expect(
      Array.from(sketchChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['S'])
    expect(
      Array.from(newSketchChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['N', 'S'])
    expect(
      Array.from(newGraphChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['N', 'G'])
    expect(
      Array.from(referencesChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['R', 'e', 'f'])
    expect(
      Array.from(
        workspaceModesChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? [],
      ).map((node) => node.textContent),
    ).toEqual(['W', 'M'])
    expect(
      Array.from(consoleInputChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['C', 'I'])
    expect(
      Array.from(cameraChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['C', 'a'])
  })
})
