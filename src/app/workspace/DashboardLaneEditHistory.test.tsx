// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDashboardStore } from '../dashboard/useDashboardStore'
import { useNotepadStore } from '../notepad/useNotepadStore'
import { editHistoryStore } from '../store/editHistoryStore'
import { DashboardSurface } from './DashboardSurface'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const changeTextControl = (element: HTMLInputElement, value: string) => {
  const valueSetter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set
  valueSetter?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
}

const blurTextControl = (element: HTMLInputElement) => {
  element.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
}

const selectLaneNotes = async (
  laneBoard: HTMLElement,
  bounds: { left: number; top: number; width: number; height: number },
) => {
  vi.spyOn(laneBoard, 'getBoundingClientRect').mockReturnValue({
    ...bounds,
    right: bounds.left + bounds.width,
    bottom: bounds.top + bounds.height,
    x: bounds.left,
    y: bounds.top,
    toJSON: () => ({}),
  } as DOMRect)

  await act(async () => {
    laneBoard.dispatchEvent(
      new PointerEvent('pointerdown', {
        bubbles: true,
        cancelable: true,
        button: 0,
        pointerId: 1,
        clientX: bounds.left,
        clientY: bounds.top,
      }),
    )
    window.dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: true,
        button: 0,
        pointerId: 1,
        clientX: bounds.left + bounds.width,
        clientY: bounds.top + bounds.height,
      }),
    )
    window.dispatchEvent(
      new PointerEvent('pointerup', {
        bubbles: true,
        cancelable: true,
        button: 0,
        pointerId: 1,
        clientX: bounds.left + bounds.width,
        clientY: bounds.top + bounds.height,
      }),
    )
  })
}

describe('Dashboard lane edit history wiring', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    editHistoryStore.clear()
    useNotepadStore.setState(useNotepadStore.getInitialState(), true)
    useDashboardStore.setState(useDashboardStore.getInitialState(), true)
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })

  afterEach(async () => {
    vi.restoreAllMocks()
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

  it('routes lane create, rename, and remove callbacks through canonical history wrappers', async () => {
    await act(async () => {
      root?.render(<DashboardSurface surfaceInstanceId="dashboard-lane-history-test" />)
    })

    const addLaneButton = container?.querySelector(
      '[data-dashboard-lane-add-lane-button="todo"]',
    ) as HTMLButtonElement | null
    expect(addLaneButton).not.toBeNull()

    await act(async () => {
      addLaneButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Create Dashboard lane',
        source: {
          surface: 'dashboard',
          sourceId: 'board',
          sourceLabel: 'Dashboard board',
        },
        targetId: 'dashboard-lane:lane-1',
      },
    ])

    const titleButton = container?.querySelector(
      '[data-dashboard-lane-title-button="lane-1"]',
    ) as HTMLButtonElement | null
    expect(titleButton).not.toBeNull()

    await act(async () => {
      titleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const titleInput = container?.querySelector(
      '[data-dashboard-lane-title-input="lane-1"]',
    ) as HTMLInputElement | null
    expect(titleInput).not.toBeNull()

    await act(async () => {
      changeTextControl(titleInput as HTMLInputElement, 'In Review')
      blurTextControl(titleInput as HTMLInputElement)
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Create Dashboard lane',
        targetId: 'dashboard-lane:lane-1',
      },
      {
        label: 'Rename Dashboard lane',
        targetId: 'dashboard-lane:lane-1:title',
        targetLabel: 'Dashboard lane title',
      },
    ])

    vi.spyOn(window, 'confirm').mockReturnValue(true)
    const deleteButton = container?.querySelector(
      '[data-dashboard-lane-delete-button="lane-1"]',
    ) as HTMLButtonElement | null
    expect(deleteButton).not.toBeNull()

    await act(async () => {
      deleteButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Create Dashboard lane',
        targetId: 'dashboard-lane:lane-1',
      },
      {
        label: 'Rename Dashboard lane',
        targetId: 'dashboard-lane:lane-1:title',
      },
      {
        label: 'Delete Dashboard lane',
        targetId: 'dashboard-lane:lane-1',
        targetLabel: 'In Review',
      },
    ])
  })

  it('routes Dashboard board align and grid command buttons through canonical history wrappers', async () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'First',
      body: 'First body',
      isPinned: true,
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Second',
      body: 'Second body',
      isPinned: true,
    })
    const thirdNoteId = useNotepadStore.getState().createNote({
      title: 'Third',
      body: 'Third body',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNotePlacement(firstNoteId, 'todo', 24, 32)
    useDashboardStore.getState().setStickyNotePlacement(secondNoteId, 'todo', 180, 200)
    useDashboardStore.getState().setStickyNotePlacement(thirdNoteId, 'todo', 360, 420)

    await act(async () => {
      root?.render(<DashboardSurface surfaceInstanceId="dashboard-board-command-history-test" />)
    })

    const todoLaneBoard = container?.querySelector(
      '[data-dashboard-lane-board="todo"]',
    ) as HTMLElement | null
    expect(todoLaneBoard).not.toBeNull()

    await selectLaneNotes(todoLaneBoard as HTMLElement, {
      left: 0,
      top: 0,
      width: 700,
      height: 700,
    })

    const verticalAlignButton = container?.querySelector(
      '[data-dashboard-lane-align-vertical-button="todo"]',
    ) as HTMLButtonElement | null
    expect(verticalAlignButton).not.toBeNull()
    expect(verticalAlignButton?.disabled).toBe(false)

    await act(async () => {
      verticalAlignButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Align sticky notes',
        source: {
          surface: 'dashboard',
          sourceId: 'board',
          sourceLabel: 'Dashboard board',
        },
        targetId: 'dashboard-board-command:align-vertical:todo',
        targetLabel: 'Vertical alignment',
      },
    ])

    const gridButton = container?.querySelector(
      '[data-dashboard-lane-grid-button="todo"]',
    ) as HTMLButtonElement | null
    expect(gridButton).not.toBeNull()

    await act(async () => {
      gridButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Align sticky notes',
        targetId: 'dashboard-board-command:align-vertical:todo',
      },
      {
        label: 'Arrange sticky notes',
        targetId: 'dashboard-board-command:grid:todo',
        targetLabel: 'Sticky note grid',
      },
    ])
  })
})
