// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ConsoleBar } from './ConsoleBar'
import { useConsoleStore } from './useConsoleStore'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('ConsoleBar', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    useConsoleStore.setState(useConsoleStore.getInitialState(), true)
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

  it('shows the full staged breadcrumb for object selection scopes', async () => {
    useConsoleStore.setState({
      stagedNavigationSession: {
        scopeId: 'contentObjectSelected',
        breadcrumb: ['Select', 'Object', 'Object 1'],
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
      'Select > Object > Object 1 > Choose next',
    )
  })

  it('shows the full staged breadcrumb for object zoom scopes', async () => {
    useConsoleStore.setState({
      stagedNavigationSession: {
        scopeId: 'contentObjectZoomRoot',
        breadcrumb: ['Select', 'Object', 'Object 1', 'Zoom'],
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
      'Select > Object > Object 1 > Zoom > Choose next',
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
          text: 'Root > Choose next [Graph, References, Camera, Radio, Zoom, Pan, Orbit]',
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

    const choices = Array.from(
      container.querySelectorAll('.ConsoleBarSummaryChoice'),
    ) as HTMLElement[]
    const referencesChoice = choices.find((choice) => choice.textContent?.includes('References'))

    expect(
      Array.from(referencesChoice?.querySelectorAll('.ConsoleBarSummaryChoiceAlias') ?? []).map(
        (node) => node.textContent,
      ),
    ).toEqual(['R', 'e', 'f'])
  })
})
