import type { NotepadNote, NotepadNoteColorPreset } from '../notepad/notepadTypes'
import { useNotepadStore } from '../notepad/useNotepadStore'
import { editHistoryStore } from './editHistoryStore'

type NotepadHistoryOptions = {
  entryId?: string
}

type NotepadDiscreteMetadata = {
  isPinned: boolean
  colorPreset: NotepadNoteColorPreset
  updatedAt: string
}

type NotepadTextField = 'title' | 'body'

type NotepadTextFieldOptions = NotepadHistoryOptions & {
  updatedAtBefore?: string
  updatedAtAfter?: string
}

let notepadHistorySequence = 0

const notepadHistorySource = {
  surface: 'notepad',
  sourceId: 'notes',
  sourceLabel: 'Notes',
}

const nextNotepadHistoryEntryId = (): string => {
  notepadHistorySequence += 1
  return `notepad-${notepadHistorySequence}`
}

const cloneNote = (note: NotepadNote): NotepadNote => ({
  id: note.id,
  title: note.title,
  body: note.body,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
  isPinned: note.isPinned,
  colorPreset: note.colorPreset,
})

const getNoteLabel = (note: NotepadNote | null): string => {
  const title = note?.title.trim() ?? ''
  return title.length > 0 ? title : 'Untitled note'
}

const resolveActiveNoteId = (
  requestedNoteId: string | null,
  notesById: Record<string, NotepadNote>,
  noteOrder: string[],
): string | null => {
  if (requestedNoteId !== null && notesById[requestedNoteId] !== undefined) {
    return requestedNoteId
  }
  return noteOrder.find((noteId) => notesById[noteId] !== undefined) ?? null
}

const mergeCapturedOrderWithCurrentNotes = (
  capturedOrder: string[],
  notesById: Record<string, NotepadNote>,
): string[] => {
  const nextOrder: string[] = []
  capturedOrder.forEach((noteId) => {
    if (notesById[noteId] !== undefined && !nextOrder.includes(noteId)) {
      nextOrder.push(noteId)
    }
  })
  Object.keys(notesById).forEach((noteId) => {
    if (!nextOrder.includes(noteId)) {
      nextOrder.push(noteId)
    }
  })
  return nextOrder
}

const restoreCreatedNote = (
  note: NotepadNote,
  noteOrder: string[],
  activeNoteId: string | null,
): void => {
  useNotepadStore.setState((state) => {
    const nextNotesById = {
      ...state.notesById,
      [note.id]: cloneNote(note),
    }
    const nextNoteOrder = mergeCapturedOrderWithCurrentNotes(noteOrder, nextNotesById)
    if (!nextNoteOrder.includes(note.id)) {
      nextNoteOrder.unshift(note.id)
    }
    return {
      notesById: nextNotesById,
      noteOrder: nextNoteOrder,
      activeNoteId: resolveActiveNoteId(activeNoteId, nextNotesById, nextNoteOrder),
    }
  })
}

const removeNoteWithOrder = (
  noteId: string,
  noteOrder: string[],
  activeNoteId: string | null,
): void => {
  useNotepadStore.setState((state) => {
    const nextNotesById = { ...state.notesById }
    delete nextNotesById[noteId]
    const nextNoteOrder = mergeCapturedOrderWithCurrentNotes(noteOrder, nextNotesById)
    return {
      notesById: nextNotesById,
      noteOrder: nextNoteOrder,
      activeNoteId: resolveActiveNoteId(activeNoteId, nextNotesById, nextNoteOrder),
    }
  })
}

const captureMetadata = (note: NotepadNote): NotepadDiscreteMetadata => ({
  isPinned: note.isPinned,
  colorPreset: note.colorPreset,
  updatedAt: note.updatedAt,
})

const restoreNoteMetadata = (
  noteId: string,
  metadata: NotepadDiscreteMetadata,
): void => {
  useNotepadStore.setState((state) => {
    const currentNote = state.notesById[noteId] ?? null
    if (currentNote === null) {
      return state
    }
    return {
      notesById: {
        ...state.notesById,
        [noteId]: {
          ...currentNote,
          isPinned: metadata.isPinned,
          colorPreset: metadata.colorPreset,
          updatedAt: metadata.updatedAt,
        },
      },
    }
  })
}

const restoreNoteTextField = (
  noteId: string,
  field: NotepadTextField,
  value: string,
  updatedAt: string,
): void => {
  useNotepadStore.setState((state) => {
    const currentNote = state.notesById[noteId] ?? null
    if (currentNote === null) {
      return state
    }
    return {
      notesById: {
        ...state.notesById,
        [noteId]: {
          ...currentNote,
          [field]: value,
          updatedAt,
        },
      },
    }
  })
}

export const commitNoteTextFieldWithHistory = (
  noteId: string,
  field: NotepadTextField,
  beforeValue: string,
  afterValue: string,
  options: NotepadTextFieldOptions = {},
): boolean => {
  const currentNote = useNotepadStore.getState().notesById[noteId] ?? null
  if (currentNote === null || beforeValue === afterValue) {
    return false
  }

  const updatedAtBefore = options.updatedAtBefore ?? currentNote.updatedAt
  if (currentNote[field] !== afterValue) {
    if (field === 'title') {
      useNotepadStore.getState().renameNote(noteId, afterValue)
    } else {
      useNotepadStore.getState().updateNoteBody(noteId, afterValue)
    }
  }

  const afterNote = useNotepadStore.getState().notesById[noteId] ?? null
  if (afterNote === null || afterNote[field] !== afterValue) {
    return false
  }

  const updatedAtAfter = options.updatedAtAfter ?? afterNote.updatedAt
  const targetId = `note:${noteId}:${field}`
  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextNotepadHistoryEntryId(),
    label: 'Change note text',
    source: notepadHistorySource,
    targetId,
    targetLabel: field === 'title' ? 'Note title' : 'Note body',
    undo: () => restoreNoteTextField(noteId, field, beforeValue, updatedAtBefore),
    redo: () => restoreNoteTextField(noteId, field, afterValue, updatedAtAfter),
  })
}

export const createNoteWithHistory = (
  seed?: Partial<Pick<NotepadNote, 'title' | 'body' | 'isPinned'>>,
  options: NotepadHistoryOptions = {},
): string => {
  const beforeState = useNotepadStore.getState()
  const beforeNoteOrder = [...beforeState.noteOrder]
  const beforeActiveNoteId = beforeState.activeNoteId
  const noteId = beforeState.createNote(seed)
  const afterState = useNotepadStore.getState()
  const createdNote = afterState.notesById[noteId] ?? null
  if (createdNote === null) {
    return noteId
  }

  const afterNote = cloneNote(createdNote)
  const afterNoteOrder = [...afterState.noteOrder]
  const afterActiveNoteId = afterState.activeNoteId
  editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextNotepadHistoryEntryId(),
    label: 'Create note',
    source: notepadHistorySource,
    targetId: `note:${noteId}`,
    targetLabel: getNoteLabel(afterNote),
    undo: () => removeNoteWithOrder(noteId, beforeNoteOrder, beforeActiveNoteId),
    redo: () => restoreCreatedNote(afterNote, afterNoteOrder, afterActiveNoteId),
  })
  return noteId
}

export const deleteNoteWithHistory = (
  noteId: string,
  options: NotepadHistoryOptions = {},
): boolean => {
  const beforeState = useNotepadStore.getState()
  const deletedNote = beforeState.notesById[noteId] ?? null
  if (deletedNote === null) {
    return false
  }
  const beforeNote = cloneNote(deletedNote)
  const beforeNoteOrder = [...beforeState.noteOrder]
  const beforeActiveNoteId = beforeState.activeNoteId

  beforeState.deleteNote(noteId)
  const afterState = useNotepadStore.getState()
  if (afterState.notesById[noteId] !== undefined) {
    return false
  }
  const afterNoteOrder = [...afterState.noteOrder]
  const afterActiveNoteId = afterState.activeNoteId

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextNotepadHistoryEntryId(),
    label: 'Delete note',
    source: notepadHistorySource,
    targetId: `note:${noteId}`,
    targetLabel: getNoteLabel(beforeNote),
    undo: () => restoreCreatedNote(beforeNote, beforeNoteOrder, beforeActiveNoteId),
    redo: () => removeNoteWithOrder(noteId, afterNoteOrder, afterActiveNoteId),
  })
}

export const setNotePinnedWithHistory = (
  noteId: string,
  isPinned: boolean,
  options: NotepadHistoryOptions = {},
): boolean => {
  const beforeNote = useNotepadStore.getState().notesById[noteId] ?? null
  if (beforeNote === null || beforeNote.isPinned === isPinned) {
    return false
  }
  const beforeMetadata = captureMetadata(beforeNote)
  useNotepadStore.getState().setNotePinned(noteId, isPinned)
  const afterNote = useNotepadStore.getState().notesById[noteId] ?? null
  if (afterNote === null || beforeMetadata.isPinned === afterNote.isPinned) {
    return false
  }
  const afterMetadata = captureMetadata(afterNote)

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextNotepadHistoryEntryId(),
    label: 'Change note',
    source: notepadHistorySource,
    targetId: `note:${noteId}:pinned`,
    targetLabel: 'Note pin',
    undo: () => restoreNoteMetadata(noteId, beforeMetadata),
    redo: () => restoreNoteMetadata(noteId, afterMetadata),
  })
}

export const setNoteColorPresetWithHistory = (
  noteId: string,
  colorPreset: NotepadNoteColorPreset,
  options: NotepadHistoryOptions = {},
): boolean => {
  const beforeNote = useNotepadStore.getState().notesById[noteId] ?? null
  if (beforeNote === null || beforeNote.colorPreset === colorPreset) {
    return false
  }
  const beforeMetadata = captureMetadata(beforeNote)
  useNotepadStore.getState().setNoteColorPreset(noteId, colorPreset)
  const afterNote = useNotepadStore.getState().notesById[noteId] ?? null
  if (afterNote === null || beforeMetadata.colorPreset === afterNote.colorPreset) {
    return false
  }
  const afterMetadata = captureMetadata(afterNote)

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextNotepadHistoryEntryId(),
    label: 'Change note',
    source: notepadHistorySource,
    targetId: `note:${noteId}:color`,
    targetLabel: 'Note color',
    undo: () => restoreNoteMetadata(noteId, beforeMetadata),
    redo: () => restoreNoteMetadata(noteId, afterMetadata),
  })
}
