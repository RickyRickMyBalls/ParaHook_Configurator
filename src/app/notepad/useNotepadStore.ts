import { create } from 'zustand'
import {
  serializePersistedNotepadState,
} from './notepadPersistence'
import type { NotepadNote, NotepadNoteColorPreset, PersistedNotepadState } from './notepadTypes'

type NotepadStoreState = {
  notesById: Record<string, NotepadNote>
  noteOrder: string[]
  activeNoteId: string | null
  hydratePersistedNotepadState: (state: PersistedNotepadState) => void
  createNote: (seed?: Partial<Pick<NotepadNote, 'title' | 'body' | 'isPinned'>>) => string
  renameNote: (noteId: string, title: string) => void
  updateNoteBody: (noteId: string, body: string) => void
  deleteNote: (noteId: string) => void
  setActiveNoteId: (noteId: string | null) => void
  setNotePinned: (noteId: string, isPinned: boolean) => void
  setNoteColorPreset: (noteId: string, colorPreset: NotepadNoteColorPreset) => void
}

const createInitialState = (): Pick<NotepadStoreState, 'notesById' | 'noteOrder' | 'activeNoteId'> => ({
  notesById: {},
  noteOrder: [],
  activeNoteId: null,
})

const cloneNote = (note: NotepadNote): NotepadNote => ({
  id: note.id,
  title: note.title,
  body: note.body,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
  isPinned: note.isPinned,
  colorPreset: note.colorPreset,
})

const touchNote = (
  note: NotepadNote,
  patch: Partial<Pick<NotepadNote, 'title' | 'body' | 'isPinned' | 'colorPreset'>>,
  updatedAt: string,
): NotepadNote => ({
  ...note,
  ...patch,
  updatedAt,
})

const createNoteTitle = (nextCount: number) => `Note ${nextCount}`

const createNoteId = (): string =>
  `note-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`

export const serializeNotepadState = (
  state: Pick<NotepadStoreState, 'notesById' | 'noteOrder' | 'activeNoteId'>,
): PersistedNotepadState =>
  serializePersistedNotepadState({
    notesById: state.notesById,
    noteOrder: state.noteOrder,
    activeNoteId: state.activeNoteId,
  })

export const useNotepadStore = create<NotepadStoreState>((set) => ({
  ...createInitialState(),
  hydratePersistedNotepadState: (state) => {
    set({
      notesById: Object.fromEntries(
        Object.entries(state.notesById).map(([noteId, note]) => [noteId, cloneNote(note)]),
      ),
      noteOrder: [...state.noteOrder],
      activeNoteId: state.activeNoteId,
    })
  },
  createNote: (seed) => {
    const now = new Date().toISOString()
    const noteId = createNoteId()
    set((state) => {
      const nextNote: NotepadNote = {
        id: noteId,
        title: seed?.title ?? createNoteTitle(state.noteOrder.length + 1),
        body: seed?.body ?? '',
        createdAt: now,
        updatedAt: now,
        isPinned: seed?.isPinned ?? false,
        colorPreset: 'yellow',
      }
      return {
        notesById: {
          ...state.notesById,
          [noteId]: nextNote,
        },
        noteOrder: [noteId, ...state.noteOrder],
        activeNoteId: noteId,
      }
    })
    return noteId
  },
  renameNote: (noteId, title) => {
    set((state) => {
      const currentNote = state.notesById[noteId] ?? null
      if (currentNote === null || currentNote.title === title) {
        return state
      }
      return {
        notesById: {
          ...state.notesById,
          [noteId]: touchNote(currentNote, { title }, new Date().toISOString()),
        },
      }
    })
  },
  updateNoteBody: (noteId, body) => {
    set((state) => {
      const currentNote = state.notesById[noteId] ?? null
      if (currentNote === null || currentNote.body === body) {
        return state
      }
      return {
        notesById: {
          ...state.notesById,
          [noteId]: touchNote(currentNote, { body }, new Date().toISOString()),
        },
      }
    })
  },
  deleteNote: (noteId) => {
    set((state) => {
      if (state.notesById[noteId] === undefined) {
        return state
      }
      const nextNotesById = { ...state.notesById }
      delete nextNotesById[noteId]
      const nextNoteOrder = state.noteOrder.filter((currentNoteId) => currentNoteId !== noteId)
      const currentIndex = state.noteOrder.indexOf(noteId)
      const nextActiveNoteId =
        state.activeNoteId !== noteId
          ? state.activeNoteId
          : nextNoteOrder[currentIndex] ?? nextNoteOrder[currentIndex - 1] ?? nextNoteOrder[0] ?? null
      return {
        notesById: nextNotesById,
        noteOrder: nextNoteOrder,
        activeNoteId: nextActiveNoteId,
      }
    })
  },
  setActiveNoteId: (noteId) => {
    set((state) => {
      if (noteId !== null && state.notesById[noteId] === undefined) {
        return state
      }
      return {
        activeNoteId: noteId,
      }
    })
  },
  setNotePinned: (noteId, isPinned) => {
    set((state) => {
      const currentNote = state.notesById[noteId] ?? null
      if (currentNote === null || currentNote.isPinned === isPinned) {
        return state
      }
      return {
        notesById: {
          ...state.notesById,
          [noteId]: touchNote(currentNote, { isPinned }, new Date().toISOString()),
        },
      }
    })
  },
  setNoteColorPreset: (noteId, colorPreset) => {
    set((state) => {
      const currentNote = state.notesById[noteId] ?? null
      if (currentNote === null || currentNote.colorPreset === colorPreset) {
        return state
      }
      return {
        notesById: {
          ...state.notesById,
          [noteId]: touchNote(currentNote, { colorPreset }, new Date().toISOString()),
        },
      }
    })
  },
}))
