import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react'
import type { NotepadNote, NotepadNoteColorPreset } from '../notepad/notepadTypes'

type DashboardStickyNoteResizeDirection =
  | 'north'
  | 'south'
  | 'east'
  | 'west'
  | 'north-east'
  | 'north-west'
  | 'south-east'
  | 'south-west'

type DashboardStickyNoteCardProps = {
  note: NotepadNote
  laneTitle: string
  x: number
  y: number
  width: number
  height: number
  isDragging: boolean
  isSelected?: boolean
  autoFocusBody?: boolean
  onConsumeAutoFocusBody?: () => void
  onSelectNotePointerDown?: (event: ReactPointerEvent<HTMLElement>) => void
  onToggleFocusLift?: (noteId: string) => void
  onTitleBarPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
  onResizeHandlePointerDown: (
    direction: DashboardStickyNoteResizeDirection,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void
  onOpenInNotepad?: (noteId: string) => void
  onUnpin: (noteId: string) => void
  onRenameNote: (noteId: string, title: string) => void
  onUpdateNoteBody: (noteId: string, body: string) => void
  onSetNoteColorPreset: (noteId: string, colorPreset: NotepadNoteColorPreset) => void
}

const stickyNoteColorOptions: NotepadNoteColorPreset[] = [
  'yellow',
  'green',
  'pink',
  'purple',
  'blue',
  'white',
  'gray',
]

const stickyNoteResizeHandles: Array<{
  direction: DashboardStickyNoteResizeDirection
  className: string
  ariaLabel: string
}> = [
  { direction: 'north', className: 'DashboardStickyNoteResizeHandle--north', ariaLabel: 'Resize sticky note from top edge' },
  { direction: 'south', className: 'DashboardStickyNoteResizeHandle--south', ariaLabel: 'Resize sticky note from bottom edge' },
  { direction: 'east', className: 'DashboardStickyNoteResizeHandle--east', ariaLabel: 'Resize sticky note from right edge' },
  { direction: 'west', className: 'DashboardStickyNoteResizeHandle--west', ariaLabel: 'Resize sticky note from left edge' },
  { direction: 'north-east', className: 'DashboardStickyNoteResizeHandle--northEast', ariaLabel: 'Resize sticky note from top right corner' },
  { direction: 'north-west', className: 'DashboardStickyNoteResizeHandle--northWest', ariaLabel: 'Resize sticky note from top left corner' },
  { direction: 'south-east', className: 'DashboardStickyNoteResizeHandle--southEast', ariaLabel: 'Resize sticky note from bottom right corner' },
  { direction: 'south-west', className: 'DashboardStickyNoteResizeHandle--southWest', ariaLabel: 'Resize sticky note from bottom left corner' },
]

const focusTextControl = (element: HTMLInputElement | HTMLTextAreaElement | null) => {
  if (element === null) {
    return
  }
  element.focus()
  const nextValue = element.value
  element.setSelectionRange(nextValue.length, nextValue.length)
}

export function DashboardStickyNoteCard(props: DashboardStickyNoteCardProps) {
  const {
    note,
    laneTitle,
    x,
    y,
    width,
    height,
    isDragging,
    isSelected = false,
    autoFocusBody = false,
    onConsumeAutoFocusBody,
    onSelectNotePointerDown,
    onToggleFocusLift,
    onTitleBarPointerDown,
    onResizeHandlePointerDown,
    onOpenInNotepad,
    onUnpin,
    onRenameNote,
    onUpdateNoteBody,
    onSetNoteColorPreset,
  } = props
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [isEditingBody, setIsEditingBody] = useState(false)
  const [titleDraft, setTitleDraft] = useState(note.title)
  const [bodyDraft, setBodyDraft] = useState(note.body)
  const titleInputRef = useRef<HTMLInputElement | null>(null)
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null)
  const paletteRef = useRef<HTMLDivElement | null>(null)
  const overflowMenuRef = useRef<HTMLDivElement | null>(null)
  const didAutoFocusBodyRef = useRef(false)
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false)
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = useState(false)

  useEffect(() => {
    if (!isEditingTitle) {
      setTitleDraft(note.title)
    }
  }, [isEditingTitle, note.title])

  useEffect(() => {
    if (!isEditingBody) {
      setBodyDraft(note.body)
    }
  }, [isEditingBody, note.body])

  useLayoutEffect(() => {
    if (!autoFocusBody || didAutoFocusBodyRef.current) {
      return
    }
    didAutoFocusBodyRef.current = true
    setIsEditingBody(true)
    onConsumeAutoFocusBody?.()
  }, [autoFocusBody, onConsumeAutoFocusBody])

  useLayoutEffect(() => {
    if (!isEditingTitle) {
      return
    }
    focusTextControl(titleInputRef.current)
  }, [isEditingTitle])

  useLayoutEffect(() => {
    if (!isEditingBody) {
      return
    }
    focusTextControl(bodyTextareaRef.current)
  }, [isEditingBody])

  useEffect(() => {
    if (!isColorMenuOpen && !isOverflowMenuOpen) {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      if (
        paletteRef.current?.contains(event.target as Node) === true ||
        overflowMenuRef.current?.contains(event.target as Node) === true
      ) {
        return
      }
      setIsColorMenuOpen(false)
      setIsOverflowMenuOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsColorMenuOpen(false)
        setIsOverflowMenuOpen(false)
      }
    }
    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isColorMenuOpen, isOverflowMenuOpen])

  const commitTitle = () => {
    setIsEditingTitle(false)
    if (titleDraft !== note.title) {
      onRenameNote(note.id, titleDraft)
    }
  }

  const cancelTitle = () => {
    setTitleDraft(note.title)
    setIsEditingTitle(false)
  }

  const commitBody = () => {
    setIsEditingBody(false)
    if (bodyDraft !== note.body) {
      onUpdateNoteBody(note.id, bodyDraft)
    }
  }

  const cancelBody = () => {
    setBodyDraft(note.body)
    setIsEditingBody(false)
  }

  const handleTitleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancelTitle()
    }
  }

  const handleBodyKeyDown = (event: ReactKeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      cancelBody()
    }
  }

  return (
    <article
      className={`DashboardStickyNote${isDragging ? ' isDragging' : ''}${isSelected ? ' isSelected' : ''}`}
      data-note-id={note.id}
      data-dashboard-note-selected={isSelected}
      data-dashboard-note-menu-open={isColorMenuOpen || isOverflowMenuOpen}
      data-dashboard-lane-title={laneTitle}
      data-note-color-preset={note.colorPreset}
      onPointerDownCapture={(event) => {
        if (event.button !== 0) {
          return
        }
        if (
          event.target instanceof Element &&
          event.target.closest('[data-dashboard-sticky-note-skip-selection="true"]') !== null
        ) {
          return
        }
        onSelectNotePointerDown?.(event)
      }}
      onDoubleClick={(event) => {
        if (!(event.target instanceof Element)) {
          return
        }
        if (
          event.target.closest('[data-dashboard-sticky-note-skip-selection="true"]') !== null ||
          event.target.closest('input, textarea, button') !== null
        ) {
          return
        }
        onToggleFocusLift?.(note.id)
      }}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        left: `${x}px`,
        top: `${y}px`,
      }}
    >
      {stickyNoteResizeHandles.map((handle) => (
        <button
          key={handle.direction}
          type="button"
          className={`DashboardStickyNoteResizeHandle ${handle.className}`}
          data-dashboard-sticky-note-skip-selection="true"
          data-dashboard-sticky-note-resize-handle={handle.direction}
          aria-label={handle.ariaLabel}
          onPointerDown={(event) => {
            onResizeHandlePointerDown(handle.direction, event)
          }}
        />
      ))}
      <div
        className="DashboardStickyNoteTitleBar"
        aria-label={`Drag ${note.title.trim().length > 0 ? note.title : 'untitled note'}`}
        onPointerDown={(event) => {
          if (event.target instanceof Element && event.target.closest('button') !== null) {
            return
          }
          onTitleBarPointerDown(event)
        }}
        onContextMenu={(event: ReactMouseEvent<HTMLDivElement>) => {
          event.preventDefault()
          setIsOverflowMenuOpen(false)
          setIsColorMenuOpen(true)
        }}
      >
        <div className="DashboardStickyNoteTitleBarLaneLabel">
          {laneTitle}
        </div>
        <div className="DashboardStickyNoteActions">
          <button
            type="button"
            className="DashboardStickyNoteActionButton DashboardStickyNoteActionButton--icon"
            data-dashboard-sticky-note-skip-selection="true"
            data-dashboard-sticky-note-menu-button="true"
            aria-label={`Open sticky note menu for ${note.title.trim().length > 0 ? note.title : 'untitled note'}`}
            aria-expanded={isOverflowMenuOpen}
            onPointerDown={(event) => {
              event.stopPropagation()
            }}
            onClick={() => {
              setIsOverflowMenuOpen((currentValue) => !currentValue)
              setIsColorMenuOpen(false)
            }}
          >
            <span className="DashboardStickyNoteMenuIcon" aria-hidden="true">
              ⋯
            </span>
          </button>
          <button
            type="button"
            className="DashboardStickyNoteActionButton DashboardStickyNoteActionButton--secondary"
            data-dashboard-sticky-note-skip-selection="true"
            data-dashboard-sticky-note-unpin-button="true"
            onClick={() => onUnpin(note.id)}
          >
            Unpin
          </button>
        </div>
        {isOverflowMenuOpen ? (
          <div
            ref={overflowMenuRef}
            className="DashboardStickyNoteOverflowMenu"
            data-dashboard-sticky-note-menu="true"
          >
            <button
              type="button"
              className="DashboardStickyNoteOverflowAction"
              data-dashboard-sticky-note-skip-selection="true"
              data-dashboard-sticky-note-menu-action="open-in-notepad"
              onPointerDown={(event) => {
                event.stopPropagation()
              }}
              onClick={() => {
                onOpenInNotepad?.(note.id)
                setIsOverflowMenuOpen(false)
              }}
            >
              Open in Notepad
            </button>
            <div
              className="DashboardStickyNoteOverflowGroup"
              data-dashboard-sticky-note-skip-selection="true"
            >
              <span className="DashboardStickyNoteOverflowLabel">Color</span>
              <div className="DashboardStickyNoteOverflowSwatches">
                {stickyNoteColorOptions.map((colorPreset) => (
                  <button
                    key={colorPreset}
                    type="button"
                    className={`DashboardStickyNoteColorSwatch${
                      note.colorPreset === colorPreset ? ' isSelected' : ''
                    }`}
                    data-dashboard-sticky-note-skip-selection="true"
                    data-note-color-option={colorPreset}
                    aria-label={`Set sticky note color to ${colorPreset}`}
                    onPointerDown={(event) => {
                      event.stopPropagation()
                    }}
                    onClick={() => {
                      onSetNoteColorPreset(note.id, colorPreset)
                      setIsOverflowMenuOpen(false)
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        ) : null}
        {isColorMenuOpen ? (
          <div
            ref={paletteRef}
            className="DashboardStickyNoteColorMenu"
            data-dashboard-sticky-note-color-menu="true"
          >
            {stickyNoteColorOptions.map((colorPreset) => (
              <button
                key={colorPreset}
                type="button"
                className={`DashboardStickyNoteColorSwatch${
                  note.colorPreset === colorPreset ? ' isSelected' : ''
                }`}
                data-dashboard-sticky-note-skip-selection="true"
                data-note-color-option={colorPreset}
                aria-label={`Set sticky note color to ${colorPreset}`}
                onPointerDown={(event) => {
                  event.stopPropagation()
                }}
                onClick={() => {
                  onSetNoteColorPreset(note.id, colorPreset)
                  setIsColorMenuOpen(false)
                }}
              />
            ))}
          </div>
        ) : null}
      </div>
      <div className="DashboardStickyNoteHeader">
        <div className="DashboardStickyNoteTitleBlock">
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              className="DashboardStickyNoteTitleInput"
              data-dashboard-sticky-note-title-input="true"
              type="text"
              value={titleDraft}
              placeholder="Untitled note"
              onChange={(event) => setTitleDraft(event.currentTarget.value)}
              onBlur={commitTitle}
              onKeyDown={handleTitleKeyDown}
            />
          ) : (
            <button
              type="button"
              className="DashboardStickyNoteTitleButton"
              data-dashboard-sticky-note-title-button="true"
              onClick={() => setIsEditingTitle(true)}
            >
              <span className="DashboardStickyNoteTitle">
                {note.title.trim().length > 0 ? note.title : 'Untitled note'}
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="DashboardStickyNoteBody">
        {isEditingBody ? (
          <textarea
            ref={bodyTextareaRef}
            className="DashboardStickyNoteBodyInput"
            data-dashboard-sticky-note-body-input="true"
            value={bodyDraft}
            placeholder="Write here..."
            onChange={(event) => setBodyDraft(event.currentTarget.value)}
            onBlur={commitBody}
            onKeyDown={handleBodyKeyDown}
          />
        ) : (
          <button
            type="button"
            className="DashboardStickyNoteBodyButton"
            data-dashboard-sticky-note-body-button="true"
            onClick={() => setIsEditingBody(true)}
          >
            <p>{note.body.trim().length > 0 ? note.body : 'Empty note'}</p>
          </button>
        )}
      </div>
    </article>
  )
}
