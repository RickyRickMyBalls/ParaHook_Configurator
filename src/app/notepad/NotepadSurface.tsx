import { useNotepadStore } from './useNotepadStore'

type NotepadSurfaceProps = {
  surfaceInstanceId: string
  hostMode?: 'slotted' | 'floating' | 'popout'
  onActivate?: () => void
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
  const createNote = useNotepadStore((state) => state.createNote)
  const deleteNote = useNotepadStore((state) => state.deleteNote)
  const renameNote = useNotepadStore((state) => state.renameNote)
  const setActiveNoteId = useNotepadStore((state) => state.setActiveNoteId)
  const setNotePinned = useNotepadStore((state) => state.setNotePinned)
  const updateNoteBody = useNotepadStore((state) => state.updateNoteBody)

  const activeNote =
    (activeNoteId !== null ? notesById[activeNoteId] : null) ??
    (noteOrder.length > 0 ? notesById[noteOrder[0] ?? ''] ?? null : null)

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
              createNote()
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
                  createNote()
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
                  onClick={() => setNotePinned(activeNote.id, !activeNote.isPinned)}
                >
                  {activeNote.isPinned ? 'Unpin' : 'Pin to Dashboard'}
                </button>
                <button
                  type="button"
                  className="NotepadSurfaceToolbarButton NotepadSurfaceToolbarButton--danger"
                  onClick={() => deleteNote(activeNote.id)}
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
              onChange={(event) => renameNote(activeNote.id, event.currentTarget.value)}
            />
            <textarea
              className="NotepadSurfaceBodyInput"
              value={activeNote.body}
              placeholder="Write here..."
              onChange={(event) => updateNoteBody(activeNote.id, event.currentTarget.value)}
            />
          </>
        )}
      </div>
    </div>
  )
}
