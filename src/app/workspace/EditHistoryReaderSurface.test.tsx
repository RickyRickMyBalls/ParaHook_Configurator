// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { editHistoryStore, type EditHistoryEntry } from '../store/editHistoryStore'
import { EditHistoryReaderSurface } from './EditHistoryReaderSurface'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const createReaderEntry = (
  entryId: string,
  options: Partial<EditHistoryEntry> = {},
): EditHistoryEntry => ({
  entryId,
  label: options.label ?? 'Move graph node',
  source: options.source ?? {
    surface: 'spaghetti-graph',
    sourceId: 'graph-node-position',
    sourceLabel: 'Graph Node Position',
  },
  targetId: options.targetId ?? 'node-reader',
  targetLabel: options.targetLabel ?? 'Reader node',
  transactionId: options.transactionId ?? 'reader-transaction-1',
  coalesceKey: options.coalesceKey ?? 'node-reader:position',
  undo: options.undo ?? vi.fn(),
  redo: options.redo ?? vi.fn(),
})

describe('EditHistoryReaderSurface', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    editHistoryStore.clear()
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
    editHistoryStore.clear()
  })

  const renderSurface = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<EditHistoryReaderSurface surfaceInstanceId="edit-history-test" />)
    })
  }

  it('renders empty undo and redo stack states', async () => {
    await renderSurface()

    expect(container?.textContent).toContain('Edit History')
    expect(container?.textContent).toContain('Undo (0)')
    expect(container?.textContent).toContain('No undo entries')

    const redoTab = container?.querySelector('button[role="tab"]:last-child') as HTMLButtonElement
    await act(async () => {
      redoTab.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Redo (0)')
    expect(container?.textContent).toContain('No redo entries')
  })

  it('renders undo stack entries and inspects only public metadata', async () => {
    const undo = vi.fn(() => {
      throw new Error('private undo payload should stay hidden')
    })
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', { undo }))
    const timestamp = editHistoryStore.getUndoEntries()[0]?.timestamp ?? ''

    await renderSurface()

    expect(container?.textContent).toContain('Move graph node')
    expect(container?.textContent).toContain('Graph Node Position')
    expect(container?.textContent).toContain('Reader node')
    expect(container?.textContent).toContain(timestamp)
    expect(container?.textContent).toContain('reader-entry-1')
    expect(container?.textContent).toContain('reader-transaction-1')
    expect(container?.textContent).toContain('node-reader:position')
    expect(container?.textContent).not.toContain('private undo payload')
    expect(container?.textContent).not.toContain('function')
  })

  it('switches between canonical undo and redo stacks from store updates', async () => {
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'Add Catalog item to project',
      source: {
        surface: 'catalog',
        sourceId: 'catalog-add-to-project',
        sourceLabel: 'Catalog Add To Project',
      },
      targetId: 'reference:reader',
      targetLabel: 'Reader Catalog',
    }))
    editHistoryStore.undo()

    await renderSurface()

    expect(container?.textContent).toContain('Undo (0)')
    expect(container?.textContent).toContain('Redo (1)')
    expect(container?.textContent).toContain('No undo entries')

    const redoTab = container?.querySelector('button[role="tab"]:last-child') as HTMLButtonElement
    await act(async () => {
      redoTab.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Add Catalog item to project')
    expect(container?.textContent).toContain('Catalog Add To Project')
    expect(container?.textContent).toContain('Reader Catalog')
  })

  it('filters the active stack by public source metadata without mutating history', async () => {
    editHistoryStore.commitEntry(createReaderEntry('reader-graph-entry', {
      label: 'Move graph node',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'graph-node-position',
        sourceLabel: 'Graph Node Position',
      },
      targetId: 'node-reader',
      targetLabel: 'Reader node',
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-catalog-entry', {
      label: 'Add Catalog item to project',
      source: {
        surface: 'catalog',
        sourceId: 'catalog-add-to-project',
        sourceLabel: 'Catalog Add To Project',
      },
      targetId: 'reference:reader',
      targetLabel: 'Reader Catalog',
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-redo-entry', {
      label: 'Change material',
      source: {
        surface: 'viewer-material',
        sourceId: 'materials',
        sourceLabel: 'Materials',
      },
      targetId: 'material-preset:reader',
      targetLabel: 'Reader material',
    }))
    editHistoryStore.undo()

    await renderSurface()

    const filterButtons = Array.from(
      container?.querySelectorAll('[aria-label="History source filter"] button') ?? [],
    ) as HTMLButtonElement[]
    const catalogFilter = filterButtons.find((button) =>
      button.textContent?.includes('Catalog Add To Project'),
    )

    expect(filterButtons.map((button) => button.textContent)).toEqual([
      'All (2)',
      'Catalog Add To Project (1)',
      'Graph Node Position (1)',
    ])
    expect(container?.textContent).toContain('Move graph node')
    expect(container?.textContent).toContain('Add Catalog item to project')

    await act(async () => {
      catalogFilter?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).not.toContain('Move graph node')
    expect(container?.textContent).toContain('Add Catalog item to project')
    expect(container?.textContent).toContain('Catalog Add To Project')
    expect(container?.textContent).toContain('Reader Catalog')
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-graph-entry',
      'reader-catalog-entry',
    ])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-redo-entry',
    ])

    const allFilter = filterButtons.find((button) => button.textContent === 'All (2)')
    await act(async () => {
      allFilter?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Move graph node')
    expect(container?.textContent).toContain('Add Catalog item to project')
  })

  it('uses the canonical owner for optional undo and redo buttons', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))

    await renderSurface()

    const actionButtons = Array.from(
      container?.querySelectorAll('.EditHistoryReaderSurfaceActions button') ?? [],
    ) as HTMLButtonElement[]

    await act(async () => {
      actionButtons[0]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual(['undo:reader-entry-1'])
    expect(container?.textContent).toContain('Undo (0)')
    expect(container?.textContent).toContain('Redo (1)')

    await act(async () => {
      actionButtons[1]?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual(['undo:reader-entry-1', 'redo:reader-entry-1'])
    expect(container?.textContent).toContain('Undo (1)')
    expect(container?.textContent).toContain('Redo (0)')
  })
})
