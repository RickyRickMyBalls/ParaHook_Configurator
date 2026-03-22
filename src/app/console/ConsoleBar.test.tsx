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
})
