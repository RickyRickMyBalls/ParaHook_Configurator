import { useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import {
  commitNoteTextFieldWithHistory,
  createNoteWithHistory,
  deleteNoteWithHistory,
  setNotePinnedWithHistory,
} from '../store/notepadEditHistory'
import { useNotepadStore } from './useNotepadStore'

type NotepadSurfaceProps = {
  surfaceInstanceId: string
  hostMode?: 'slotted' | 'floating' | 'popout'
  onActivate?: () => void
}

type NotepadTextFieldSession = {
  noteId: string
  field: 'title' | 'body'
  beforeValue: string
  updatedAtBefore: string
}

const formatTimestamp = (value: string): string => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return 'Saved'
  }
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function NotepadSurface(props: NotepadSurfaceProps) {
  const { surfaceInstanceId, hostMode = 'slotted', onActivate } = props
  const noteOrder = useNotepadStore((state) => state.noteOrder)
  const notesById = useNotepadStore((state) => state.notesById)
  const activeNoteId = useNotepadStore((state) => state.activeNoteId)
  const renameNote = useNotepadStore((state) => state.renameNote)
  const setActiveNoteId = useNotepadStore((state) => state.setActiveNoteId)
  const updateNoteBody = useNotepadStore((state) => state.updateNoteBody)
  const textSessionRef = useRef<NotepadTextFieldSession | null>(null)
  const [, setTextSessionVersion] = useState(0)

  const activeNote =
    (activeNoteId !== null ? notesById[activeNoteId] : null) ??
    (noteOrder.length > 0 ? notesById[noteOrder[0] ?? ''] ?? null : null)

  const beginTextSession = (field: 'title' | 'body', note = activeNote) => {
    if (note === null) {
      return
    }
    textSessionRef.current = {
      noteId: note.id,
      field,
      beforeValue: note[field],
      updatedAtBefore: note.updatedAt,
    }
  }

  const clearTextSession = () => {
    textSessionRef.current = null
    setTextSessionVersion((version) => version + 1)
  }

  const commitTextSession = (field: 'title' | 'body', note = activeNote) => {
    const session = textSessionRef.current
    if (session === null || note === null || session.noteId !== note.id || session.field !== field) {
      clearTextSession()
      return
    }
    const afterValue = note[field]
    const updatedAtAfter = note.updatedAt
    clearTextSession()
    commitNoteTextFieldWithHistory(note.id, field, session.beforeValue, afterValue, {
      updatedAtBefore: session.updatedAtBefore,
      updatedAtAfter,
    })
  }

  const cancelTextSession = (
    event: ReactKeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: 'title' | 'body',
    note = activeNote,
  ) => {
    const session = textSessionRef.current
    if (event.key !== 'Escape' || session === null || note === null || session.noteId !== note.id || session.field !== field) {
      return
    }
    event.preventDefault()
    if (field === 'title') {
      renameNote(note.id, session.beforeValue)
    } else {
      updateNoteBody(note.id, session.beforeValue)
    }
    clearTextSession()
    event.currentTarget.blur()
  }

  return (
    <div
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--notepad NotepadSurface"
      data-workspace-surface-instance-id={surfaceInstanceId}
      data-notepad-host-mode={hostMode}
      onPointerDownCapture={onActivate}
    >
      <div className="NotepadSurfaceSidebar">
        <div className="NotepadSurfaceSidebarHeader">
          <div>
            <span className="NotepadSurfaceEyebrow">Workspace Surface</span>
            <h2 className="NotepadSurfaceTitle">Notepad</h2>
          </div>
          <button
            type="button"
            className="NotepadSurfaceCreateButton"
            onClick={() => {
              createNoteWithHistory()
            }}
          >
            New Note
          </button>
        </div>
        <div className="NotepadSurfaceNoteList" role="list" aria-label="Notes">
          {noteOrder.length === 0 ? (
            <div className="NotepadSurfaceEmptyList">
              <p>Write the first note for this workspace.</p>
              <button
                type="button"
                className="NotepadSurfaceCreateButton"
                onClick={() => {
                  createNoteWithHistory()
                }}
              >
                Create First Note
              </button>
            </div>
          ) : (
            noteOrder.map((noteId) => {
              const note = notesById[noteId] ?? null
              if (note === null) {
                return null
              }
              const isActive = note.id === activeNote?.id
              return (
                <button
                  key={note.id}
                  type="button"
                  className={`NotepadSurfaceNoteListItem${isActive ? ' isActive' : ''}`}
                  onClick={() => setActiveNoteId(note.id)}
                >
                  <div className="NotepadSurfaceNoteListTitleRow">
                    <span className="NotepadSurfaceNoteListTitle">
                      {note.title.trim().length > 0 ? note.title : 'Untitled note'}
                    </span>
                    {note.isPinned ? (
                      <span className="NotepadSurfacePinnedBadge" aria-label="Pinned note">
                        Pinned
                      </span>
                    ) : null}
                  </div>
                  <p className="NotepadSurfaceNoteListPreview">
                    {note.body.trim().length > 0 ? note.body : 'Empty note'}
                  </p>
                  <span className="NotepadSurfaceNoteListMeta">
                    {formatTimestamp(note.updatedAt)}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      <div className="NotepadSurfaceEditor">
        {activeNote === null ? (
          <div className="NotepadSurfaceEmptyEditor">
            <div className="NotepadSurfaceEmptyEditorCard">
              <span className="NotepadSurfaceEyebrow">Ready</span>
              <h3>Focused notes land here.</h3>
              <p>
                This first pass keeps the model small and shared so later dashboard widgets can read
                the same notes without inventing a second system.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="NotepadSurfaceToolbar">
              <span className="NotepadSurfaceSavedState">
                Last updated {formatTimestamp(activeNote.updatedAt)}
              </span>
              <div className="NotepadSurfaceToolbarActions">
                <button
                  type="button"
                  className="NotepadSurfaceToolbarButton"
                  onClick={() => setNotePinnedWithHistory(activeNote.id, !activeNote.isPinned)}
                >
                  {activeNote.isPinned ? 'Unpin' : 'Pin to Dashboard'}
                </button>
                <button
                  type="button"
                  className="NotepadSurfaceToolbarButton NotepadSurfaceToolbarButton--danger"
                  onClick={() => deleteNoteWithHistory(activeNote.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <input
              className="NotepadSurfaceTitleInput"
              type="text"
              value={activeNote.title}
              placeholder="Untitled note"
              onFocus={() => beginTextSession('title', activeNote)}
              onChange={(event) => renameNote(activeNote.id, event.currentTarget.value)}
              onBlur={() => commitTextSession('title', activeNote)}
              onKeyDown={(event) => cancelTextSession(event, 'title', activeNote)}
            />
            <textarea
              className="NotepadSurfaceBodyInput"
              value={activeNote.body}
              placeholder="Write here..."
              onFocus={() => beginTextSession('body', activeNote)}
              onChange={(event) => updateNoteBody(activeNote.id, event.currentTarget.value)}
              onBlur={() => commitTextSession('body', activeNote)}
              onKeyDown={(event) => cancelTextSession(event, 'body', activeNote)}
            />
          </>
        )}
      </div>
    </div>
  )
}
