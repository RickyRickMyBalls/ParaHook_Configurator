import { beforeEach, describe, expect, it } from 'vitest'
import {
  normalizePersistedNotepadState,
  serializePersistedNotepadState,
} from './notepadPersistence'
import { serializeNotepadState, useNotepadStore } from './useNotepadStore'

describe('useNotepadStore', () => {
  beforeEach(() => {
    useNotepadStore.setState(useNotepadStore.getInitialState(), true)
  })

  it('creates, edits, pins, and deletes notes with a sane active-note fallback', () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'First note',
      body: 'Alpha',
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Second note',
      body: 'Beta',
    })

    useNotepadStore.getState().setActiveNoteId(firstNoteId)
    useNotepadStore.getState().renameNote(firstNoteId, 'Renamed first note')
    useNotepadStore.getState().updateNoteBody(firstNoteId, 'Updated alpha')
    useNotepadStore.getState().setNotePinned(firstNoteId, true)
    useNotepadStore.getState().setNoteColorPreset(firstNoteId, 'blue')

    let state = useNotepadStore.getState()
    expect(state.notesById[firstNoteId]).toEqual(
      expect.objectContaining({
        title: 'Renamed first note',
        body: 'Updated alpha',
        isPinned: true,
        colorPreset: 'blue',
      }),
    )
    expect(state.activeNoteId).toBe(firstNoteId)

    useNotepadStore.getState().deleteNote(firstNoteId)

    state = useNotepadStore.getState()
    expect(state.notesById[firstNoteId]).toBeUndefined()
    expect(state.activeNoteId).toBe(secondNoteId)
    expect(state.noteOrder).toEqual([secondNoteId])
  })

  it('round-trips persisted note state through serialization and normalization', () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Persisted note',
      body: 'Keep me',
      isPinned: true,
    })

    const serialized = serializePersistedNotepadState(serializeNotepadState(useNotepadStore.getState()))
    const normalized = normalizePersistedNotepadState(serialized)

    expect(normalized).not.toBeNull()
    expect(normalized?.activeNoteId).toBe(noteId)
    expect(normalized?.noteOrder).toEqual([noteId])
    expect(normalized?.notesById[noteId]).toEqual(
      expect.objectContaining({
        title: 'Persisted note',
        body: 'Keep me',
        isPinned: true,
        colorPreset: 'yellow',
      }),
    )
  })
})
