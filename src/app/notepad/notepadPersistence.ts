import type { PersistedNotepadState, NotepadNote, NotepadNoteColorPreset } from './notepadTypes'

export const notepadStorageKey = 'parahook.notepad.notes.v1'

type NotepadPersistenceSource = {
  notesById: Record<string, NotepadNote>
  noteOrder: string[]
  activeNoteId: string | null
}

const defaultPersistedTimestamp = '1970-01-01T00:00:00.000Z'
const defaultNoteColorPreset: NotepadNoteColorPreset = 'yellow'

const normalizeNoteColorPreset = (value: unknown): NotepadNoteColorPreset => {
  switch (value) {
    case 'green':
    case 'pink':
    case 'purple':
    case 'blue':
    case 'white':
    case 'gray':
      return value
    default:
      return defaultNoteColorPreset
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const cloneNote = (note: NotepadNote): NotepadNote => ({
  id: note.id,
  title: note.title,
  body: note.body,
  createdAt: note.createdAt,
  updatedAt: note.updatedAt,
  isPinned: note.isPinned,
  colorPreset: note.colorPreset,
})

const normalizeNote = (noteId: string, value: unknown): NotepadNote | null => {
  if (!isRecord(value)) {
    return null
  }
  const id =
    typeof value.id === 'string' && value.id.trim().length > 0 ? value.id.trim() : noteId
  if (id.length === 0) {
    return null
  }
  return {
    id,
    title: typeof value.title === 'string' ? value.title : '',
    body: typeof value.body === 'string' ? value.body : '',
    createdAt:
      typeof value.createdAt === 'string' && value.createdAt.length > 0
        ? value.createdAt
        : defaultPersistedTimestamp,
    updatedAt:
      typeof value.updatedAt === 'string' && value.updatedAt.length > 0
        ? value.updatedAt
        : defaultPersistedTimestamp,
    isPinned: value.isPinned === true,
    colorPreset: normalizeNoteColorPreset(value.colorPreset),
  }
}

export const serializePersistedNotepadState = (
  state: NotepadPersistenceSource,
): PersistedNotepadState => ({
  version: 1,
  notesById: Object.fromEntries(
    Object.entries(state.notesById).map(([noteId, note]) => [noteId, cloneNote(note)]),
  ),
  noteOrder: [...state.noteOrder],
  activeNoteId: state.activeNoteId,
})

export const normalizePersistedNotepadState = (
  value: unknown,
): PersistedNotepadState | null => {
  if (!isRecord(value)) {
    return null
  }
  const noteEntries = isRecord(value.notesById)
    ? Object.entries(value.notesById)
        .map(([noteId, note]) => {
          const normalizedNote = normalizeNote(noteId, note)
          return normalizedNote === null ? null : ([normalizedNote.id, normalizedNote] as const)
        })
        .filter((entry): entry is readonly [string, NotepadNote] => entry !== null)
    : []
  const notesById = Object.fromEntries(noteEntries)
  const noteOrder = Array.isArray(value.noteOrder)
    ? value.noteOrder.filter(
        (noteId): noteId is string => typeof noteId === 'string' && notesById[noteId] !== undefined,
      )
    : []
  for (const noteId of Object.keys(notesById)) {
    if (!noteOrder.includes(noteId)) {
      noteOrder.push(noteId)
    }
  }
  const activeNoteId =
    typeof value.activeNoteId === 'string' && notesById[value.activeNoteId] !== undefined
      ? value.activeNoteId
      : noteOrder[0] ?? null
  return {
    version: 1,
    notesById,
    noteOrder,
    activeNoteId,
  }
}

export const readPersistedNotepadState = (): PersistedNotepadState | null => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return null
  }
  try {
    const raw = window.localStorage.getItem(notepadStorageKey)
    if (raw === null) {
      return null
    }
    return normalizePersistedNotepadState(JSON.parse(raw))
  } catch {
    return null
  }
}

export const writePersistedNotepadState = (state: PersistedNotepadState): void => {
  if (typeof window === 'undefined' || typeof window.localStorage === 'undefined') {
    return
  }
  try {
    window.localStorage.setItem(notepadStorageKey, JSON.stringify(state))
  } catch {
    // Ignore localStorage write failures so the workspace stays usable.
  }
}
