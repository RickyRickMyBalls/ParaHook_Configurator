// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useDashboardStore } from '../dashboard/useDashboardStore'
import { useNotepadStore } from '../notepad/useNotepadStore'
import { editHistoryStore } from '../store/editHistoryStore'
import { DashboardSurface } from './DashboardSurface'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const changeTextControl = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const prototype =
    element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
  valueSetter?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
}

const blurTextControl = (element: HTMLInputElement | HTMLTextAreaElement) => {
  element.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
}

describe('Dashboard sticky note text edit history', () => {
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

  it('commits one canonical entry for a changed sticky-note title blur', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Dashboard title',
      body: 'Dashboard body',
      isPinned: true,
    })
    useDashboardStore.getState().setStickyNoteFrame(noteId, {
      x: 96,
      y: 104,
      width: 320,
      height: 220,
    })

    await act(async () => {
      root?.render(<DashboardSurface surfaceInstanceId="dashboard-text-history-test" />)
    })

    const titleButton = container?.querySelector(
      '[data-dashboard-sticky-note-title-button="true"]',
    ) as HTMLButtonElement | null
    expect(titleButton).not.toBeNull()

    await act(async () => {
      titleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const titleInput = container?.querySelector(
      '[data-dashboard-sticky-note-title-input="true"]',
    ) as HTMLInputElement | null
    expect(titleInput).not.toBeNull()

    await act(async () => {
      changeTextControl(titleInput as HTMLInputElement, 'Dashboard title edited')
    })

    expect(useNotepadStore.getState().notesById[noteId]?.title).toBe('Dashboard title')
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    await act(async () => {
      blurTextControl(titleInput as HTMLInputElement)
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Change note text',
        source: {
          surface: 'notepad',
          sourceId: 'notes',
          sourceLabel: 'Notes',
        },
        targetId: `note:${noteId}:title`,
        targetLabel: 'Note title',
      },
    ])
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Dashboard title edited',
      body: 'Dashboard body',
    }))

    await act(async () => {
      useNotepadStore.getState().updateNoteBody(noteId, 'Later body')
      useNotepadStore.getState().setNotePinned(noteId, true)
      useNotepadStore.getState().setNoteColorPreset(noteId, 'blue')
    })
    const dashboardLayoutBeforeUndo = useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]

    let undoneTargetId: string | undefined
    await act(async () => {
      undoneTargetId = editHistoryStore.undo()?.targetId
    })
    expect(undoneTargetId).toBe(`note:${noteId}:title`)
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Dashboard title',
      body: 'Later body',
      isPinned: true,
      colorPreset: 'blue',
    }))
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(dashboardLayoutBeforeUndo)

    let redoneTargetId: string | undefined
    await act(async () => {
      redoneTargetId = editHistoryStore.redo()?.targetId
    })
    expect(redoneTargetId).toBe(`note:${noteId}:title`)
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Dashboard title edited',
      body: 'Later body',
      isPinned: true,
      colorPreset: 'blue',
    }))
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId[noteId]).toEqual(dashboardLayoutBeforeUndo)
  })

  it('commits one canonical entry for a changed sticky-note body blur', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Body note',
      body: 'Dashboard body',
      isPinned: true,
    })

    await act(async () => {
      root?.render(<DashboardSurface surfaceInstanceId="dashboard-body-history-test" />)
    })

    const bodyButton = container?.querySelector(
      '[data-dashboard-sticky-note-body-button="true"]',
    ) as HTMLButtonElement | null
    expect(bodyButton).not.toBeNull()

    await act(async () => {
      bodyButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const bodyInput = container?.querySelector(
      '[data-dashboard-sticky-note-body-input="true"]',
    ) as HTMLTextAreaElement | null
    expect(bodyInput).not.toBeNull()

    await act(async () => {
      changeTextControl(bodyInput as HTMLTextAreaElement, 'Dashboard body edited')
      blurTextControl(bodyInput as HTMLTextAreaElement)
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Change note text',
        targetId: `note:${noteId}:body`,
        targetLabel: 'Note body',
      },
    ])
    expect(useNotepadStore.getState().notesById[noteId]?.body).toBe('Dashboard body edited')

    await act(async () => {
      useNotepadStore.getState().renameNote(noteId, 'Later title')
    })

    let undoneTargetId: string | undefined
    await act(async () => {
      undoneTargetId = editHistoryStore.undo()?.targetId
    })
    expect(undoneTargetId).toBe(`note:${noteId}:body`)
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Later title',
      body: 'Dashboard body',
    }))

    let redoneTargetId: string | undefined
    await act(async () => {
      redoneTargetId = editHistoryStore.redo()?.targetId
    })
    expect(redoneTargetId).toBe(`note:${noteId}:body`)
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Later title',
      body: 'Dashboard body edited',
    }))
  })

  it('keeps Escape and unchanged blur out of canonical history', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Stable title',
      body: 'Stable body',
      isPinned: true,
    })
    const marker = { value: 'after' }
    editHistoryStore.commitEntry({
      entryId: 'dashboard-sticky-redo-sentinel',
      label: 'Redo sentinel',
      source: {
        surface: 'dashboard-test',
      },
      undo: () => {
        marker.value = 'before'
      },
      redo: () => {
        marker.value = 'after'
      },
    })
    editHistoryStore.undo()

    await act(async () => {
      root?.render(<DashboardSurface surfaceInstanceId="dashboard-no-entry-test" />)
    })

    const titleButton = container?.querySelector(
      '[data-dashboard-sticky-note-title-button="true"]',
    ) as HTMLButtonElement | null
    expect(titleButton).not.toBeNull()

    await act(async () => {
      titleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const titleInput = container?.querySelector(
      '[data-dashboard-sticky-note-title-input="true"]',
    ) as HTMLInputElement | null
    expect(titleInput).not.toBeNull()

    await act(async () => {
      changeTextControl(titleInput as HTMLInputElement, 'Temporary dashboard title')
      titleInput?.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Escape',
      }))
    })

    expect(useNotepadStore.getState().notesById[noteId]?.title).toBe('Stable title')
    expect(marker.value).toBe('before')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'dashboard-sticky-redo-sentinel',
    ])

    const bodyButton = container?.querySelector(
      '[data-dashboard-sticky-note-body-button="true"]',
    ) as HTMLButtonElement | null
    expect(bodyButton).not.toBeNull()

    await act(async () => {
      bodyButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const bodyInput = container?.querySelector(
      '[data-dashboard-sticky-note-body-input="true"]',
    ) as HTMLTextAreaElement | null
    expect(bodyInput).not.toBeNull()

    await act(async () => {
      blurTextControl(bodyInput as HTMLTextAreaElement)
    })

    expect(useNotepadStore.getState().notesById[noteId]?.body).toBe('Stable body')
    expect(marker.value).toBe('before')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'dashboard-sticky-redo-sentinel',
    ])
  })
})
