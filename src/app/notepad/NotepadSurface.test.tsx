// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from '../store/editHistoryStore'
import { useNotepadStore } from './useNotepadStore'
import { NotepadSurface } from './NotepadSurface'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const dispatchFocus = (element: HTMLElement) => {
  element.dispatchEvent(new FocusEvent('focusin', { bubbles: true }))
}

const dispatchBlur = (element: HTMLElement) => {
  element.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
}

const changeTextControl = (element: HTMLInputElement | HTMLTextAreaElement, value: string) => {
  const prototype =
    element instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set
  valueSetter?.call(element, value)
  element.dispatchEvent(new Event('input', { bubbles: true }))
}

describe('NotepadSurface text edit history', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    editHistoryStore.clear()
    useNotepadStore.setState(useNotepadStore.getInitialState(), true)
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

  it('commits one title entry on blur after a focused raw edit', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Initial title',
      body: 'Initial body',
    })

    await act(async () => {
      root?.render(<NotepadSurface surfaceInstanceId="notepad-test" />)
    })

    const titleInput = container?.querySelector('.NotepadSurfaceTitleInput') as HTMLInputElement | null
    expect(titleInput).not.toBeNull()

    await act(async () => {
      dispatchFocus(titleInput as HTMLInputElement)
      changeTextControl(titleInput as HTMLInputElement, 'Edited title')
    })

    expect(useNotepadStore.getState().notesById[noteId]?.title).toBe('Edited title')
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    await act(async () => {
      dispatchBlur(titleInput as HTMLInputElement)
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Change note text',
        targetId: `note:${noteId}:title`,
        targetLabel: 'Note title',
      },
    ])
  })

  it('restores a focused body edit on Escape without committing history', async () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Escape note',
      body: 'Original body',
    })

    await act(async () => {
      root?.render(<NotepadSurface surfaceInstanceId="notepad-test" />)
    })

    const bodyInput = container?.querySelector('.NotepadSurfaceBodyInput') as HTMLTextAreaElement | null
    expect(bodyInput).not.toBeNull()

    await act(async () => {
      dispatchFocus(bodyInput as HTMLTextAreaElement)
      changeTextControl(bodyInput as HTMLTextAreaElement, 'Temporary body')
    })

    expect(useNotepadStore.getState().notesById[noteId]?.body).toBe('Temporary body')

    await act(async () => {
      bodyInput?.dispatchEvent(new KeyboardEvent('keydown', {
        bubbles: true,
        key: 'Escape',
      }))
    })

    expect(useNotepadStore.getState().notesById[noteId]?.body).toBe('Original body')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
  })
})
