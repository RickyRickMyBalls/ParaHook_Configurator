export type NotepadNoteColorPreset =
  | 'yellow'
  | 'green'
  | 'pink'
  | 'purple'
  | 'blue'
  | 'white'
  | 'gray'

export type NotepadNote = {
  id: string
  title: string
  body: string
  createdAt: string
  updatedAt: string
  isPinned: boolean
  colorPreset: NotepadNoteColorPreset
}

export type PersistedNotepadState = {
  version: 1
  notesById: Record<string, NotepadNote>
  noteOrder: string[]
  activeNoteId: string | null
}
