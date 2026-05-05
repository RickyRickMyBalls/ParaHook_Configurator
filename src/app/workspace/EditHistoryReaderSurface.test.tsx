// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { editHistoryStore, type EditHistoryEntry } from '../store/editHistoryStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
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
  childSummaries: options.childSummaries,
  childRestorePoints: options.childRestorePoints,
  undo: options.undo ?? vi.fn(),
  redo: options.redo ?? vi.fn(),
})

const createSketchDrawSession = (): NonNullable<
  ReturnType<typeof useSpaghettiStore.getState>['geometrySketchSession']
> => {
  const snapshot = {
    activeTool: null,
    lastUsedTool: 'line' as const,
    drawStage: 'sessionIdle' as const,
    drawDraft: null,
    selectedComponentIds: [],
    hoveredComponentId: null,
    selectionWindowDraft: null,
  }
  const command = {
    commandId: 'draw-command-1',
    nodeId: 'sketch-node-1',
    label: 'Draw sketch line',
    kind: 'geometry' as const,
    beforeSessionState: snapshot,
    afterSessionState: snapshot,
    beforeParams: {},
    afterParams: { sketch: { components: [{ rowId: 'line-1' }] } },
  }

  return {
    nodeId: 'sketch-node-1',
    mode: 'draw',
    activeTool: null,
    lastUsedTool: 'line',
    drawStage: 'sessionIdle',
    editorViewportId: null,
    shouldRestoreViewportWindowMode: false,
    drawDraft: null,
    selectedComponentIds: [],
    hoveredComponentId: null,
    selectionWindowDraft: null,
    stagedBaselineParams: {},
    stagedBaselineHistory: {
      undoCommands: [],
      redoCommands: [],
    },
    stagedUndoCommands: [command],
    stagedRedoCommands: [],
    sessionUndoCommands: [command],
    sessionRedoCommands: [],
  }
}

describe('EditHistoryReaderSurface', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    editHistoryStore.clear()
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
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
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  })

  const renderSurface = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(<EditHistoryReaderSurface surfaceInstanceId="edit-history-test" />)
    })
  }

  const clickTab = async (labelStart: string) => {
    const tab = Array.from(
      container?.querySelectorAll('button[role="tab"]') ?? [],
    ).find((button) => button.textContent?.startsWith(labelStart)) as HTMLButtonElement
    await act(async () => {
      tab.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
  }

  const mockRailRect = (rail: HTMLElement, top = 100, height = 300) => {
    rail.getBoundingClientRect = vi.fn(() => ({
      x: 0,
      y: top,
      top,
      left: 0,
      right: 18,
      bottom: top + height,
      width: 18,
      height,
      toJSON: () => ({}),
    }))
  }

  const createPointerEvent = (
    type: string,
    options: {
      clientY: number
      pointerId?: number
    },
  ): Event => {
    const event = new Event(type, { bubbles: true, cancelable: true })
    Object.defineProperties(event, {
      clientY: { value: options.clientY },
      pointerId: { value: options.pointerId ?? 1 },
    })
    return event
  }

  const getTimelineRail = (): HTMLElement =>
    container?.querySelector('[aria-label="Timeline scrub rail"]') as HTMLElement

  const getTimelineMarker = (): HTMLElement =>
    Array.from(
      container?.querySelectorAll('[aria-label="Timeline history"] button') ?? [],
    ).find((button) => button.textContent?.includes('Current position')) as HTMLElement

  const getToolbarButton = (label: string): HTMLButtonElement =>
    Array.from(container?.querySelectorAll('button') ?? []).find(
      (button) => button.textContent === label,
    ) as HTMLButtonElement

  const createSketchCommitEntry = (
    entryId: string,
    options: Partial<EditHistoryEntry> = {},
  ): EditHistoryEntry =>
    createReaderEntry(entryId, {
      label: 'Commit sketch draw changes',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'geometry-sketch-draw',
        sourceLabel: 'Sketch Draw',
      },
      targetId: 'node-sketch-1:sketch:components',
      targetLabel: 'Sketch Draw changes',
      childSummaries: [
        {
          childId: 'draw-command-1',
          label: 'Draw sketch line',
          kind: 'geometry',
          sequence: 1,
        },
        {
          childId: 'tool-command-1',
          label: 'Select sketch rectangle tool',
          kind: 'tool-selection',
          sequence: 2,
        },
      ],
      ...options,
    })

  const commitNumberedReaderEntries = (count: number, events: string[] = []) => {
    for (let index = 1; index <= count; index += 1) {
      const entryId = `reader-entry-${index}`
      editHistoryStore.commitEntry(createReaderEntry(entryId, {
        label: `Graph edit ${index}`,
        undo: () => events.push(`undo:${entryId}`),
        redo: () => events.push(`redo:${entryId}`),
      }))
    }
  }

  it('opens to a unified timeline with an empty current-position marker', async () => {
    await renderSurface()

    expect(container?.querySelector('[aria-selected="true"]')?.textContent).toBe('Timeline (0)')
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Current position',
    )
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Marker index 0',
    )
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).not.toContain(
      '0 applied / 0 redoable',
    )
    expect(container?.querySelector('[aria-label="Timeline scrub rail"]')).not.toBeNull()
    expect(container?.querySelectorAll('.EditHistoryReaderTimelineRailDot')).toHaveLength(0)
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('50%')
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Read only marker',
    )
  })

  it('keeps an empty timeline rail click as a marker no-op', async () => {
    await renderSurface()

    const rail = container?.querySelector('[aria-label="Timeline scrub rail"]') as HTMLElement
    mockRailRect(rail)
    await act(async () => {
      rail.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientY: 250,
      }))
    })

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Read only marker',
    )
  })

  it('renders empty undo and redo stack states', async () => {
    await renderSurface()
    await clickTab('Undo')

    expect(container?.textContent).toContain('Edit History')
    expect(container?.textContent).toContain('Undo (0)')
    expect(container?.textContent).toContain('No undo entries')

    await clickTab('Redo')

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
    await clickTab('Undo')
    const entryButton = Array.from(
      container?.querySelectorAll('[aria-label="Undo stack"] button') ?? [],
    ).find((button) => button.textContent?.includes('Move graph node')) as HTMLButtonElement
    await act(async () => {
      entryButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

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
    await clickTab('Undo')

    expect(container?.textContent).toContain('Undo (0)')
    expect(container?.textContent).toContain('Redo (1)')
    expect(container?.textContent).toContain('No undo entries')

    await clickTab('Redo')

    expect(container?.textContent).toContain('Add Catalog item to project')
    expect(container?.textContent).toContain('Catalog Add To Project')
    expect(container?.textContent).toContain('Reader Catalog')
  })

  it('renders the public diagnostic activity log for captured undo and redo activity', async () => {
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1'))
    editHistoryStore.undo()
    editHistoryStore.redo()

    await renderSurface()

    const activityLog = container?.querySelector(
      '[aria-label="Diagnostic activity log"]',
    ) as HTMLElement | null

    expect(activityLog?.textContent).toContain('Diagnostic activity')
    expect(activityLog?.textContent).toContain('#1 Captured: Move graph node')
    expect(activityLog?.textContent).toContain('#2 Undo: Move graph node')
    expect(activityLog?.textContent).toContain('#3 Redo: Move graph node')
    expect(activityLog?.textContent).toContain('Graph Node Position')
    expect(activityLog?.textContent).toContain('Reader node')
    expect(activityLog?.textContent).toContain('Undo 1 / Redo 0')
    expect(activityLog?.textContent).toContain('Undo 0 / Redo 1')
    expect(container?.querySelector('[aria-label="History snapshot log"]')).toBeNull()
    expect(activityLog?.textContent).not.toContain('Snapshot log')
  })

  it('keeps diagnostic activity rows out of the timeline scrub rail targets', async () => {
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1'))
    editHistoryStore.undo()
    editHistoryStore.redo()

    await renderSurface()

    const timeline = container?.querySelector('[aria-label="Timeline history"]') as HTMLElement | null
    const activityLog = container?.querySelector(
      '[aria-label="Diagnostic activity log"]',
    ) as HTMLElement | null

    expect(container?.textContent).toContain('Timeline (1)')
    expect(timeline?.textContent).toContain('Marker index 1')
    expect(timeline?.textContent?.match(/Move graph node/g)).toHaveLength(1)
    expect(activityLog?.textContent?.match(/Move graph node/g)).toHaveLength(3)
    expect(container?.querySelectorAll('.EditHistoryReaderTimelineRailDot')).toHaveLength(1)
  })

  it('renders applied rows marker and redoable rows with a no-op marker click', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
      undo: () => events.push('undo:reader-entry-3'),
      redo: () => events.push('redo:reader-entry-3'),
    }))
    editHistoryStore.undo()
    editHistoryStore.undo()
    events.length = 0

    await renderSurface()

    const timeline = container?.querySelector('[aria-label="Timeline history"]') as HTMLElement | null
    expect(timeline?.textContent).toContain('First graph edit')
    expect(timeline?.textContent).toContain('Current position')
    expect(timeline?.textContent).toContain('Marker index 1')
    expect(timeline?.textContent).not.toContain('1 applied / 2 redoable')
    expect(timeline?.textContent).toContain('Second graph edit')
    expect(timeline?.textContent).toContain('Third graph edit')
    expect(timeline?.textContent).toContain('Applied')
    expect(timeline?.textContent).toContain('Redoable')
    expect(
      Array.from(container?.querySelectorAll('.EditHistoryReaderTimelineRailDot') ?? [])
        .map((dot) => (dot as HTMLElement).style.top),
    ).toEqual(['62.5%', '37.5%', '12.5%'])
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('62.5%')
    expect(timeline?.textContent?.indexOf('Third graph edit')).toBeLessThan(
      timeline?.textContent?.indexOf('Second graph edit') ?? 0,
    )
    expect(timeline?.textContent?.indexOf('Second graph edit')).toBeLessThan(
      timeline?.textContent?.indexOf('Current position') ?? 0,
    )
    expect(timeline?.textContent?.indexOf('Current position')).toBeLessThan(
      timeline?.textContent?.indexOf('First graph edit') ?? 0,
    )

    const markerButton = Array.from(
      timeline?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('Current position')) as HTMLButtonElement
    await act(async () => {
      markerButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual([])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
    ])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-3',
      'reader-entry-2',
    ])
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Read only marker',
    )
  })

  it('aligns rail dots and the active marker to measured timeline card centers', async () => {
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
    }))

    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
      const createRect = (top: number, height: number): DOMRect => ({
        x: 0,
        y: top,
        top,
        left: 0,
        right: 300,
        bottom: top + height,
        width: 300,
        height,
        toJSON: () => ({}),
      } as DOMRect)

      if (this.getAttribute('aria-label') === 'Timeline history') {
        return createRect(100, 500)
      }

      switch (this.getAttribute('data-timeline-rail-entry-id')) {
        case 'reader-entry-1':
          return createRect(310, 80)
        case 'reader-entry-2':
          return createRect(200, 100)
        case 'reader-entry-3':
          return createRect(110, 80)
        default:
          break
      }

      if (this.getAttribute('data-timeline-rail-marker') === 'true') {
        return createRect(428, 44)
      }

      return originalGetBoundingClientRect.call(this)
    }

    try {
      await renderSurface()
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
    }

    expect(
      Array.from(container?.querySelectorAll('.EditHistoryReaderTimelineRailDot') ?? [])
        .map((dot) => (dot as HTMLElement).style.top),
    ).toEqual(['10%', '30%', '50%'])
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('70%')
  })

  it('expands grouped timeline cards without triggering canonical marker jumps', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'Add graph node',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Commit sketch draw changes',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'geometry-sketch-draw',
        sourceLabel: 'Sketch Draw',
      },
      targetId: 'node-sketch-1:sketch:components',
      targetLabel: 'Sketch Draw changes',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))

    await renderSurface()

    expect(container?.querySelector('[aria-label="Expand Add graph node"]')).toBeNull()
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      '#2 Commit sketch draw changes',
    )

    const expandButton = container?.querySelector(
      '[aria-label="Expand Commit sketch draw changes"]',
    ) as HTMLButtonElement
    expect(expandButton).not.toBeNull()
    expect(expandButton.textContent?.trim()).toBe('')

    await act(async () => {
      expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual([])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'No committed command details available',
    )
    expect(
      container?.querySelector('[aria-label="Collapse Commit sketch draw changes"]'),
    ).not.toBeNull()
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).not.toContain(
      'Collapse',
    )
  })

  it('keeps grouped timeline parent cards as the only canonical jump target', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'Add graph node',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Commit sketch draw changes',
      source: {
        surface: 'spaghetti-graph',
        sourceId: 'geometry-sketch-draw',
        sourceLabel: 'Sketch Draw',
      },
      targetId: 'node-sketch-1:sketch:components',
      targetLabel: 'Sketch Draw changes',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))

    await renderSurface()

    const parentJumpButton = Array.from(
      container?.querySelectorAll('.EditHistoryReaderTimelineEntryMain') ?? [],
    ).find((button) =>
      button.textContent?.includes('Commit sketch draw changes')) as HTMLButtonElement
    await act(async () => {
      parentJumpButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual(['undo:reader-entry-2'])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
    ])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-2',
    ])
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Marker index 1',
    )
  })

  it('renders committed Sketch Draw child summaries inside expanded timeline groups', async () => {
    editHistoryStore.commitEntry(createSketchCommitEntry('reader-entry-1'))

    await renderSurface()

    const expandButton = container?.querySelector(
      '[aria-label="Expand Commit sketch draw changes"]',
    ) as HTMLButtonElement
    await act(async () => {
      expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const childList = container?.querySelector(
      '[aria-label="Commit sketch draw changes details"]',
    ) as HTMLElement | null

    expect(childList?.textContent).toContain('#1 Draw sketch line')
    expect(childList?.textContent).toContain('geometry')
    expect(childList?.textContent).toContain('#2 Select sketch rectangle tool')
    expect(childList?.textContent).toContain('tool-selection')
    expect(childList?.textContent).not.toContain('No committed command details available')
    expect(childList?.querySelectorAll('[data-timeline-rail-child-id]')).toHaveLength(2)
  })

  it('selects expanded Sketch Draw child rows without creating child undo ownership', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createSketchCommitEntry('reader-entry-1', {
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))

    await renderSurface()

    const expandButton = container?.querySelector(
      '[aria-label="Expand Commit sketch draw changes"]',
    ) as HTMLButtonElement
    await act(async () => {
      expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const childButton = container?.querySelector(
      '[data-timeline-rail-child-id="draw-command-1"]',
    ) as HTMLButtonElement
    await act(async () => {
      childButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual([])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(childButton.className).toContain('isSelected')
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Read only child marker',
    )
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Draw sketch line',
    )
  })

  it('restores expanded Sketch Draw child rows through the store without moving canonical ownership', async () => {
    const events: string[] = []
    const openGeometrySketchHistoryScrub = vi.fn(() => true)
    useSpaghettiStore.setState({
      activeGraphDocumentId: 'graph-document-reader-test',
      openGeometrySketchHistoryScrub,
    })
    editHistoryStore.commitEntry(createSketchCommitEntry('reader-entry-1', {
      childRestorePoints: [
        {
          childId: 'draw-command-1',
          restore: () => events.push('restore:draw-command-1'),
        },
      ],
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))

    await renderSurface()

    const expandButton = container?.querySelector(
      '[aria-label="Expand Commit sketch draw changes"]',
    ) as HTMLButtonElement
    await act(async () => {
      expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const childButton = container?.querySelector(
      '[data-timeline-rail-child-id="draw-command-1"]',
    ) as HTMLButtonElement
    await act(async () => {
      childButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual(['restore:draw-command-1'])
    expect(openGeometrySketchHistoryScrub).toHaveBeenCalledWith({
      parentEntryId: 'reader-entry-1',
      childId: 'draw-command-1',
      graphDocumentId: 'graph-document-reader-test',
      nodeId: 'node-sketch-1',
      childLabel: 'Draw sketch line',
      childSequence: 1,
    })
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Restored child marker',
    )
  })

  it('shows Sketch Draw history scrub status when a restored child opens scrub state', async () => {
    const events: string[] = []
    useSpaghettiStore.setState({
      openGeometrySketchHistoryScrub: (input) => {
        useSpaghettiStore.setState({ geometrySketchHistoryScrub: input })
        return true
      },
    })
    editHistoryStore.commitEntry(createSketchCommitEntry('reader-entry-1', {
      childRestorePoints: [
        {
          childId: 'draw-command-1',
          restore: () => events.push('restore:draw-command-1'),
        },
      ],
    }))

    await renderSurface()

    const expandButton = container?.querySelector(
      '[aria-label="Expand Commit sketch draw changes"]',
    ) as HTMLButtonElement
    await act(async () => {
      expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const childButton = container?.querySelector(
      '[data-timeline-rail-child-id="draw-command-1"]',
    ) as HTMLButtonElement
    await act(async () => {
      childButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Sketch Draw history scrub',
    )
  })

  it('clears selected child detail when undo moves away from the parent boundary', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createSketchCommitEntry('reader-entry-1', {
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))

    await renderSurface()

    const expandButton = container?.querySelector(
      '[aria-label="Expand Commit sketch draw changes"]',
    ) as HTMLButtonElement
    await act(async () => {
      expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const childButton = container?.querySelector(
      '[data-timeline-rail-child-id="draw-command-1"]',
    ) as HTMLButtonElement
    await act(async () => {
      childButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Read only child marker',
    )

    await act(async () => {
      getToolbarButton('Undo').dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
    })

    expect(events).toEqual(['undo:reader-entry-1'])
    expect(useSpaghettiStore.getState().geometrySketchHistoryScrub).toBeNull()
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
    ])
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).not.toContain(
      'Read only child marker',
    )
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Current position',
    )
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Marker index0',
    )
  })

  it('previews expanded child rows as scrub targets and releases to the parent boundary', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createSketchCommitEntry('reader-entry-1', {
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.undo()
    events.length = 0

    const originalGetBoundingClientRect = HTMLElement.prototype.getBoundingClientRect
    HTMLElement.prototype.getBoundingClientRect = function getBoundingClientRect() {
      const createRect = (top: number, height: number): DOMRect => ({
        x: 0,
        y: top,
        top,
        left: 0,
        right: 300,
        bottom: top + height,
        width: 300,
        height,
        toJSON: () => ({}),
      } as DOMRect)

      if (this.getAttribute('aria-label') === 'Timeline history') {
        return createRect(100, 300)
      }

      if (this.getAttribute('data-timeline-rail-child-id') === 'draw-command-1') {
        return createRect(190, 40)
      }

      if (this.getAttribute('data-timeline-rail-child-id') === 'tool-command-1') {
        return createRect(240, 40)
      }

      if (this.getAttribute('data-timeline-rail-marker') === 'true') {
        return createRect(110, 40)
      }

      return originalGetBoundingClientRect.call(this)
    }

    try {
      await renderSurface()
      const expandButton = container?.querySelector(
        '[aria-label="Expand Commit sketch draw changes"]',
      ) as HTMLButtonElement
      await act(async () => {
        expandButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      })

      const rail = getTimelineRail()
      mockRailRect(rail, 100, 300)

      await act(async () => {
        rail.dispatchEvent(createPointerEvent('pointerdown', { clientY: 210, pointerId: 12 }))
      })

      const previewedChildButton = container?.querySelector(
        '[data-timeline-rail-child-id="draw-command-1"]',
      ) as HTMLButtonElement
      expect(previewedChildButton.className).toContain('isPreviewTarget')
      expect(
        container?.querySelector('.EditHistoryReaderTimelineScrub')?.getAttribute(
          'data-preview-marker-index',
        ),
      ).toBe('1')

      await act(async () => {
        rail.dispatchEvent(createPointerEvent('pointerup', { clientY: 210, pointerId: 12 }))
      })

      expect(events).toEqual(['redo:reader-entry-1'])
      expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
        'reader-entry-1',
      ])
      expect(editHistoryStore.getRedoEntries()).toEqual([])
      expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
        'Read only child marker',
      )
    } finally {
      HTMLElement.prototype.getBoundingClientRect = originalGetBoundingClientRect
    }
  })

  it('jumps backward from an applied timeline row through canonical undo calls', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
      undo: () => events.push('undo:reader-entry-3'),
      redo: () => events.push('redo:reader-entry-3'),
    }))

    await renderSurface()

    const timeline = container?.querySelector('[aria-label="Timeline history"]') as HTMLElement | null
    const firstEntryButton = Array.from(
      timeline?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('First graph edit')) as HTMLButtonElement
    await act(async () => {
      firstEntryButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual([
      'undo:reader-entry-3',
      'undo:reader-entry-2',
      'undo:reader-entry-1',
    ])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-3',
      'reader-entry-2',
      'reader-entry-1',
    ])
    expect(container?.querySelector('[aria-selected="true"]')?.textContent).toBe('Timeline (3)')
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Marker index 0',
    )
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).not.toContain(
      '0 applied / 3 redoable',
    )
  })

  it('jumps forward from a redoable timeline row through canonical redo calls', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
      undo: () => events.push('undo:reader-entry-3'),
      redo: () => events.push('redo:reader-entry-3'),
    }))
    editHistoryStore.undo()
    editHistoryStore.undo()
    editHistoryStore.undo()
    events.length = 0

    await renderSurface()

    const timeline = container?.querySelector('[aria-label="Timeline history"]') as HTMLElement | null
    const thirdEntryButton = Array.from(
      timeline?.querySelectorAll('button') ?? [],
    ).find((button) => button.textContent?.includes('Third graph edit')) as HTMLButtonElement
    await act(async () => {
      thirdEntryButton.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(events).toEqual([
      'redo:reader-entry-1',
      'redo:reader-entry-2',
      'redo:reader-entry-3',
    ])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(container?.querySelector('[aria-selected="true"]')?.textContent).toBe('Timeline (3)')
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Marker index 3',
    )
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).not.toContain(
      '3 applied / 0 redoable',
    )
  })

  it('jumps backward from the timeline scrub rail through canonical undo calls', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
      undo: () => events.push('undo:reader-entry-3'),
      redo: () => events.push('redo:reader-entry-3'),
    }))

    await renderSurface()

    const rail = container?.querySelector('[aria-label="Timeline scrub rail"]') as HTMLElement
    mockRailRect(rail)
    await act(async () => {
      rail.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientY: 400,
      }))
    })

    expect(events).toEqual([
      'undo:reader-entry-3',
      'undo:reader-entry-2',
      'undo:reader-entry-1',
    ])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-3',
      'reader-entry-2',
      'reader-entry-1',
    ])
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('87.5%')
    const timelinePreview = container?.querySelector('[aria-label="Timeline history"]') as HTMLElement
    expect(timelinePreview.textContent?.indexOf('First graph edit')).toBeLessThan(
      timelinePreview.textContent?.indexOf('Current position') ?? 0,
    )
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Marker index 0',
    )
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).not.toContain(
      '0 applied / 3 redoable',
    )
  })

  it('jumps forward from the timeline scrub rail through canonical redo calls', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
      undo: () => events.push('undo:reader-entry-3'),
      redo: () => events.push('redo:reader-entry-3'),
    }))
    editHistoryStore.undo()
    editHistoryStore.undo()
    editHistoryStore.undo()
    events.length = 0

    await renderSurface()

    const rail = container?.querySelector('[aria-label="Timeline scrub rail"]') as HTMLElement
    mockRailRect(rail)
    await act(async () => {
      rail.dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        clientY: 100,
      }))
    })

    expect(events).toEqual([
      'redo:reader-entry-1',
      'redo:reader-entry-2',
      'redo:reader-entry-3',
    ])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('12.5%')
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Marker index 3',
    )
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).not.toContain(
      '3 applied / 0 redoable',
    )
  })

  it('previews a downward marker drag and commits canonical undo calls only on release', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
      undo: () => events.push('undo:reader-entry-3'),
      redo: () => events.push('redo:reader-entry-3'),
    }))

    await renderSurface()

    const rail = getTimelineRail()
    const marker = getTimelineMarker()
    mockRailRect(rail)
    await act(async () => {
      marker.dispatchEvent(createPointerEvent('pointerdown', { clientY: 400, pointerId: 7 }))
    })
    await act(async () => {
      marker.dispatchEvent(createPointerEvent('pointermove', { clientY: 400, pointerId: 7 }))
    })

    expect(events).toEqual([])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
    ])
    expect(
      container?.querySelector('.EditHistoryReaderTimelineScrub')?.getAttribute(
        'data-preview-marker-index',
      ),
    ).toBe('0')
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('100%')

    await act(async () => {
      marker.dispatchEvent(createPointerEvent('pointerup', { clientY: 400, pointerId: 7 }))
    })

    expect(events).toEqual([
      'undo:reader-entry-3',
      'undo:reader-entry-2',
      'undo:reader-entry-1',
    ])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-3',
      'reader-entry-2',
      'reader-entry-1',
    ])
    expect(
      container?.querySelector('.EditHistoryReaderTimelineScrub')?.getAttribute(
        'data-preview-marker-index',
      ),
    ).toBeNull()
  })

  it('keeps the canonical undo pointer after a scrub jump from ten entries to five', async () => {
    const events: string[] = []
    commitNumberedReaderEntries(10, events)

    await renderSurface()

    const rail = getTimelineRail()
    const marker = getTimelineMarker()
    mockRailRect(rail)
    await act(async () => {
      marker.dispatchEvent(createPointerEvent('pointerdown', { clientY: 250, pointerId: 17 }))
    })
    await act(async () => {
      marker.dispatchEvent(createPointerEvent('pointerup', { clientY: 250, pointerId: 17 }))
    })

    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
      'reader-entry-4',
      'reader-entry-5',
    ])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-10',
      'reader-entry-9',
      'reader-entry-8',
      'reader-entry-7',
      'reader-entry-6',
    ])
    expect(events.slice(-5)).toEqual([
      'undo:reader-entry-10',
      'undo:reader-entry-9',
      'undo:reader-entry-8',
      'undo:reader-entry-7',
      'undo:reader-entry-6',
    ])
    expect(container?.querySelector('[aria-label="Timeline history"]')?.textContent).toContain(
      'Marker index 5',
    )

    events.length = 0
    await act(async () => {
      getToolbarButton('Undo').dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
    })

    expect(events).toEqual(['undo:reader-entry-5'])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
      'reader-entry-4',
    ])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-10',
      'reader-entry-9',
      'reader-entry-8',
      'reader-entry-7',
      'reader-entry-6',
      'reader-entry-5',
    ])

    events.length = 0
    await act(async () => {
      getToolbarButton('Redo').dispatchEvent(new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))
    })

    expect(events).toEqual(['redo:reader-entry-5'])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
      'reader-entry-4',
      'reader-entry-5',
    ])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-10',
      'reader-entry-9',
      'reader-entry-8',
      'reader-entry-7',
      'reader-entry-6',
    ])
  })

  it('does not add a marker-move entry when the scrub marker jumps', async () => {
    commitNumberedReaderEntries(4)

    await renderSurface()

    const rail = getTimelineRail()
    const marker = getTimelineMarker()
    mockRailRect(rail)
    await act(async () => {
      marker.dispatchEvent(createPointerEvent('pointerdown', { clientY: 300, pointerId: 18 }))
    })
    await act(async () => {
      marker.dispatchEvent(createPointerEvent('pointerup', { clientY: 300, pointerId: 18 }))
    })

    const canonicalLabels = [
      ...editHistoryStore.getUndoEntries(),
      ...editHistoryStore.getRedoEntries(),
    ].map((entry) => entry.label)
    expect(canonicalLabels).toEqual([
      'Graph edit 1',
      'Graph edit 4',
      'Graph edit 3',
      'Graph edit 2',
    ])
    expect(canonicalLabels).not.toContain('Current position')
    expect(canonicalLabels.some((label) => label.toLowerCase().includes('marker'))).toBe(false)
  })

  it('previews an upward rail drag and commits canonical redo calls only on release', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      label: 'First graph edit',
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      label: 'Second graph edit',
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3', {
      label: 'Third graph edit',
      undo: () => events.push('undo:reader-entry-3'),
      redo: () => events.push('redo:reader-entry-3'),
    }))
    editHistoryStore.undo()
    editHistoryStore.undo()
    editHistoryStore.undo()
    events.length = 0

    await renderSurface()

    const rail = getTimelineRail()
    mockRailRect(rail)
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointerdown', { clientY: 100, pointerId: 8 }))
    })
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointermove', { clientY: 100, pointerId: 8 }))
    })

    expect(events).toEqual([])
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-3',
      'reader-entry-2',
      'reader-entry-1',
    ])
    expect(
      container?.querySelector('.EditHistoryReaderTimelineScrub')?.getAttribute(
        'data-preview-marker-index',
      ),
    ).toBe('3')
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('0%')

    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointerup', { clientY: 100, pointerId: 8 }))
    })

    expect(events).toEqual([
      'redo:reader-entry-1',
      'redo:reader-entry-2',
      'redo:reader-entry-3',
    ])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })

  it('keeps pointer cancel as a preview-only no-op', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))

    await renderSurface()

    const rail = getTimelineRail()
    mockRailRect(rail)
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointerdown', { clientY: 400, pointerId: 9 }))
    })
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointermove', { clientY: 100, pointerId: 9 }))
    })
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointercancel', { clientY: 100, pointerId: 9 }))
    })

    expect(events).toEqual([])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(
      container?.querySelector('.EditHistoryReaderTimelineScrub')?.getAttribute(
        'data-preview-marker-index',
      ),
    ).toBeNull()
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('16.666666666666664%')
  })

  it('moves the scrub handle fluidly inside a snapped preview slot', async () => {
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1'))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2'))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-3'))

    await renderSurface()

    const rail = getTimelineRail()
    mockRailRect(rail)
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointerdown', { clientY: 110, pointerId: 11 }))
    })
    expect(
      container?.querySelector('.EditHistoryReaderTimelineScrub')?.getAttribute(
        'data-preview-marker-index',
      ),
    ).toBe('3')
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('3.3333333333333335%')

    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointermove', { clientY: 120, pointerId: 11 }))
    })

    expect(
      container?.querySelector('.EditHistoryReaderTimelineScrub')?.getAttribute(
        'data-preview-marker-index',
      ),
    ).toBe('3')
    expect(
      (container?.querySelector('.EditHistoryReaderTimelineRailHandle') as HTMLElement | null)
        ?.style.top,
    ).toBe('6.666666666666667%')
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
      'reader-entry-3',
    ])

    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointercancel', { clientY: 120, pointerId: 11 }))
    })
  })

  it('keeps same-index scrub release as a canonical no-op', async () => {
    const events: string[] = []
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-1', {
      undo: () => events.push('undo:reader-entry-1'),
      redo: () => events.push('redo:reader-entry-1'),
    }))
    editHistoryStore.commitEntry(createReaderEntry('reader-entry-2', {
      undo: () => events.push('undo:reader-entry-2'),
      redo: () => events.push('redo:reader-entry-2'),
    }))

    await renderSurface()

    const rail = getTimelineRail()
    mockRailRect(rail)
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointerdown', { clientY: 100, pointerId: 10 }))
    })
    await act(async () => {
      rail.dispatchEvent(createPointerEvent('pointerup', { clientY: 100, pointerId: 10 }))
    })

    expect(events).toEqual([])
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.entryId)).toEqual([
      'reader-entry-1',
      'reader-entry-2',
    ])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'Read only marker',
    )
  })

  it('surfaces uncommitted sketch draw history and links it to the Sketch Draw tab', async () => {
    useSpaghettiStore.setState({
      geometrySketchSession: createSketchDrawSession(),
    })

    await renderSurface()
    await clickTab('Undo')

    expect(container?.textContent).toContain('Sketch Draw (1)')
    expect(container?.textContent).toContain('Sketch Draw changes')
    expect(container?.textContent).toContain('Not committed yet')

    const pendingEntry = Array.from(
      container?.querySelectorAll('.EditHistoryReaderEntryList button') ?? [],
    ).find((button) => button.textContent?.includes('Sketch Draw changes')) as HTMLButtonElement
    await act(async () => {
      pendingEntry.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('[aria-selected="true"]')?.textContent).toBe('Sketch Draw (1)')
    expect(container?.querySelector('[aria-label="Sketch Draw local history"]')?.textContent).toContain(
      '#1 Draw sketch line',
    )
    expect(container?.querySelector('[aria-label="History entry details"]')?.textContent).toContain(
      'sketch-node-1',
    )
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
    await clickTab('Undo')

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

    const undoStack = container?.querySelector('[aria-label="Undo stack"]') as HTMLElement | null

    expect(undoStack?.textContent).not.toContain('Move graph node')
    expect(undoStack?.textContent).toContain('Add Catalog item to project')
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
