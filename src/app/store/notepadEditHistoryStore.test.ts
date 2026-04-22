import { beforeEach, describe, expect, it } from 'vitest'
import { useNotepadStore } from '../notepad/useNotepadStore'
import { type EditHistoryEntry, editHistoryStore } from './editHistoryStore'
import {
  commitNoteTextFieldWithHistory,
  createNoteWithHistory,
  deleteNoteWithHistory,
  setNoteColorPresetWithHistory,
  setNotePinnedWithHistory,
} from './notepadEditHistory'

const resetStores = () => {
  editHistoryStore.clear()
  useNotepadStore.setState(useNotepadStore.getInitialState(), true)
}

const seedRedoEntry = () => {
  const marker = { value: 'after' }
  const entry: EditHistoryEntry = {
    entryId: 'notepad-redo-sentinel',
    label: 'Redo sentinel',
    source: {
      surface: 'notepad-test',
    },
    undo: () => {
      marker.value = 'before'
    },
    redo: () => {
      marker.value = 'after'
    },
  }

  editHistoryStore.commitEntry(entry)
  editHistoryStore.undo()
  expect(marker.value).toBe('before')
  expect(editHistoryStore.getRedoEntries().map((redoEntry) => redoEntry.entryId)).toEqual([
    entry.entryId,
  ])
  return marker
}

const expectRedoPreserved = (marker: { value: string }) => {
  expect(marker.value).toBe('before')
  expect(editHistoryStore.getUndoEntries()).toEqual([])
  expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
    'notepad-redo-sentinel',
  ])
  expect(editHistoryStore.canRedo()).toBe(true)
}

describe('notepad edit history', () => {
  beforeEach(() => {
    resetStores()
  })

  it('commits one undoable create entry and redoes with the original generated note id', () => {
    const noteId = createNoteWithHistory({
      title: 'Project note',
      body: 'First body',
    }, {
      entryId: 'notepad-create-test',
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'notepad-create-test',
        label: 'Create note',
        source: {
          surface: 'notepad',
          sourceId: 'notes',
          sourceLabel: 'Notes',
        },
        targetId: `note:${noteId}`,
        targetLabel: 'Project note',
      },
    ])
    expect(useNotepadStore.getState().noteOrder).toEqual([noteId])
    expect(useNotepadStore.getState().activeNoteId).toBe(noteId)

    expect(editHistoryStore.undo()?.entryId).toBe('notepad-create-test')
    expect(useNotepadStore.getState().notesById[noteId]).toBeUndefined()
    expect(useNotepadStore.getState().noteOrder).toEqual([])
    expect(useNotepadStore.getState().activeNoteId).toBeNull()

    expect(editHistoryStore.redo()?.entryId).toBe('notepad-create-test')
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      id: noteId,
      title: 'Project note',
      body: 'First body',
    }))
    expect(useNotepadStore.getState().noteOrder).toEqual([noteId])
    expect(useNotepadStore.getState().activeNoteId).toBe(noteId)
  })

  it('preserves later raw-created notes when undoing and redoing a canonical create entry', () => {
    const canonicalNoteId = createNoteWithHistory({
      title: 'Canonical note',
    }, {
      entryId: 'notepad-create-order-repair-test',
    })
    const laterRawNoteId = useNotepadStore.getState().createNote({
      title: 'Later raw note',
    })

    expect(useNotepadStore.getState().noteOrder).toEqual([laterRawNoteId, canonicalNoteId])

    expect(editHistoryStore.undo()?.entryId).toBe('notepad-create-order-repair-test')
    expect(useNotepadStore.getState().notesById[canonicalNoteId]).toBeUndefined()
    expect(useNotepadStore.getState().notesById[laterRawNoteId]).toEqual(expect.objectContaining({
      title: 'Later raw note',
    }))
    expect(useNotepadStore.getState().noteOrder).toEqual([laterRawNoteId])

    expect(editHistoryStore.redo()?.entryId).toBe('notepad-create-order-repair-test')
    expect(useNotepadStore.getState().notesById[canonicalNoteId]).toEqual(expect.objectContaining({
      title: 'Canonical note',
    }))
    expect(useNotepadStore.getState().notesById[laterRawNoteId]).toEqual(expect.objectContaining({
      title: 'Later raw note',
    }))
    expect(useNotepadStore.getState().noteOrder).toEqual([canonicalNoteId, laterRawNoteId])
  })

  it('commits one undoable delete entry and restores note order plus active-note fallback', () => {
    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'First',
      body: 'Alpha',
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Second',
      body: 'Beta',
    })
    useNotepadStore.getState().setActiveNoteId(firstNoteId)

    expect(deleteNoteWithHistory(firstNoteId, {
      entryId: 'notepad-delete-test',
    })).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'notepad-delete-test',
        label: 'Delete note',
        targetId: `note:${firstNoteId}`,
        targetLabel: 'First',
      },
    ])
    expect(useNotepadStore.getState().notesById[firstNoteId]).toBeUndefined()
    expect(useNotepadStore.getState().noteOrder).toEqual([secondNoteId])
    expect(useNotepadStore.getState().activeNoteId).toBe(secondNoteId)

    expect(editHistoryStore.undo()?.entryId).toBe('notepad-delete-test')
    expect(useNotepadStore.getState().notesById[firstNoteId]).toEqual(expect.objectContaining({
      id: firstNoteId,
      title: 'First',
      body: 'Alpha',
    }))
    expect(useNotepadStore.getState().noteOrder).toEqual([secondNoteId, firstNoteId])
    expect(useNotepadStore.getState().activeNoteId).toBe(firstNoteId)

    expect(editHistoryStore.redo()?.entryId).toBe('notepad-delete-test')
    expect(useNotepadStore.getState().notesById[firstNoteId]).toBeUndefined()
    expect(useNotepadStore.getState().noteOrder).toEqual([secondNoteId])
    expect(useNotepadStore.getState().activeNoteId).toBe(secondNoteId)
  })

  it('preserves later raw-created notes when undoing and redoing a canonical delete entry', () => {
    const deletedNoteId = useNotepadStore.getState().createNote({
      title: 'Deleted note',
    })
    const survivingNoteId = useNotepadStore.getState().createNote({
      title: 'Surviving note',
    })

    expect(deleteNoteWithHistory(deletedNoteId, {
      entryId: 'notepad-delete-order-repair-test',
    })).toBe(true)
    const laterRawNoteId = useNotepadStore.getState().createNote({
      title: 'Later raw note',
    })

    expect(useNotepadStore.getState().noteOrder).toEqual([laterRawNoteId, survivingNoteId])

    expect(editHistoryStore.undo()?.entryId).toBe('notepad-delete-order-repair-test')
    expect(useNotepadStore.getState().notesById[deletedNoteId]).toEqual(expect.objectContaining({
      title: 'Deleted note',
    }))
    expect(useNotepadStore.getState().notesById[laterRawNoteId]).toEqual(expect.objectContaining({
      title: 'Later raw note',
    }))
    expect(useNotepadStore.getState().noteOrder).toEqual([
      survivingNoteId,
      deletedNoteId,
      laterRawNoteId,
    ])

    expect(editHistoryStore.redo()?.entryId).toBe('notepad-delete-order-repair-test')
    expect(useNotepadStore.getState().notesById[deletedNoteId]).toBeUndefined()
    expect(useNotepadStore.getState().notesById[laterRawNoteId]).toEqual(expect.objectContaining({
      title: 'Later raw note',
    }))
    expect(useNotepadStore.getState().noteOrder).toEqual([survivingNoteId, laterRawNoteId])
  })

  it('commits pin and color entries with targeted metadata restore that preserves later text edits', () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Original title',
      body: 'Original body',
    })

    expect(setNotePinnedWithHistory(noteId, true, {
      entryId: 'notepad-pin-test',
    })).toBe(true)
    expect(setNoteColorPresetWithHistory(noteId, 'blue', {
      entryId: 'notepad-color-test',
    })).toBe(true)

    useNotepadStore.getState().renameNote(noteId, 'Later title')
    useNotepadStore.getState().updateNoteBody(noteId, 'Later body')

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'notepad-pin-test',
        label: 'Change note',
        targetId: `note:${noteId}:pinned`,
        targetLabel: 'Note pin',
      },
      {
        entryId: 'notepad-color-test',
        label: 'Change note',
        targetId: `note:${noteId}:color`,
        targetLabel: 'Note color',
      },
    ])

    editHistoryStore.undo()
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Later title',
      body: 'Later body',
      isPinned: true,
      colorPreset: 'yellow',
    }))

    editHistoryStore.undo()
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Later title',
      body: 'Later body',
      isPinned: false,
      colorPreset: 'yellow',
    }))

    editHistoryStore.redo()
    editHistoryStore.redo()
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Later title',
      body: 'Later body',
      isPinned: true,
      colorPreset: 'blue',
    }))
  })

  it('keeps missing or unchanged discrete operations out of history and preserves redo', () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'No-op note',
    })
    const marker = seedRedoEntry()

    expect(deleteNoteWithHistory('missing-note')).toBe(false)
    expect(setNotePinnedWithHistory('missing-note', true)).toBe(false)
    expect(setNoteColorPresetWithHistory('missing-note', 'blue')).toBe(false)
    expect(setNotePinnedWithHistory(noteId, false)).toBe(false)
    expect(setNoteColorPresetWithHistory(noteId, 'yellow')).toBe(false)

    expectRedoPreserved(marker)
  })

  it('keeps raw Notepad setters history-free after wrappers are available', () => {
    const marker = seedRedoEntry()

    const noteId = useNotepadStore.getState().createNote({
      title: 'Raw note',
      body: 'Raw body',
    })
    useNotepadStore.getState().setNotePinned(noteId, true)
    useNotepadStore.getState().setNoteColorPreset(noteId, 'purple')
    useNotepadStore.getState().renameNote(noteId, 'Raw renamed')
    useNotepadStore.getState().updateNoteBody(noteId, 'Raw body changed')
    useNotepadStore.getState().deleteNote(noteId)

    expectRedoPreserved(marker)
  })

  it('commits title and body text entries with field-targeted restore', () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Before title',
      body: 'Before body',
    })
    const noteBeforeTitle = useNotepadStore.getState().notesById[noteId]
    useNotepadStore.getState().renameNote(noteId, 'After title')
    const noteAfterTitle = useNotepadStore.getState().notesById[noteId]

    expect(commitNoteTextFieldWithHistory(noteId, 'title', 'Before title', 'After title', {
      entryId: 'notepad-title-text-test',
      updatedAtBefore: noteBeforeTitle?.updatedAt,
      updatedAtAfter: noteAfterTitle?.updatedAt,
    })).toBe(true)

    useNotepadStore.getState().setNotePinned(noteId, true)
    useNotepadStore.getState().setNoteColorPreset(noteId, 'blue')
    useNotepadStore.getState().updateNoteBody(noteId, 'Later body')

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'notepad-title-text-test',
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

    expect(editHistoryStore.undo()?.entryId).toBe('notepad-title-text-test')
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Before title',
      body: 'Later body',
      isPinned: true,
      colorPreset: 'blue',
    }))

    expect(editHistoryStore.redo()?.entryId).toBe('notepad-title-text-test')
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'After title',
      body: 'Later body',
      isPinned: true,
      colorPreset: 'blue',
    }))

    const noteBeforeBody = useNotepadStore.getState().notesById[noteId]
    useNotepadStore.getState().updateNoteBody(noteId, 'Body after commit')
    const noteAfterBody = useNotepadStore.getState().notesById[noteId]

    expect(commitNoteTextFieldWithHistory(noteId, 'body', 'Later body', 'Body after commit', {
      entryId: 'notepad-body-text-test',
      updatedAtBefore: noteBeforeBody?.updatedAt,
      updatedAtAfter: noteAfterBody?.updatedAt,
    })).toBe(true)

    useNotepadStore.getState().renameNote(noteId, 'Later title')
    expect(editHistoryStore.undo()?.entryId).toBe('notepad-body-text-test')
    expect(useNotepadStore.getState().notesById[noteId]).toEqual(expect.objectContaining({
      title: 'Later title',
      body: 'Later body',
      isPinned: true,
      colorPreset: 'blue',
    }))
  })

  it('keeps missing or unchanged text commits out of history and preserves redo', () => {
    const noteId = useNotepadStore.getState().createNote({
      title: 'Stable title',
      body: 'Stable body',
    })
    const marker = seedRedoEntry()

    expect(commitNoteTextFieldWithHistory(noteId, 'title', 'Stable title', 'Stable title')).toBe(false)
    expect(commitNoteTextFieldWithHistory(noteId, 'body', 'Stable body', 'Stable body')).toBe(false)
    expect(commitNoteTextFieldWithHistory('missing-note', 'title', 'A', 'B')).toBe(false)

    expectRedoPreserved(marker)
  })
})
