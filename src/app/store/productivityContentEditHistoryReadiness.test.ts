import { beforeEach, describe, expect, it } from 'vitest'
import {
  normalizePersistedDashboardState,
  serializePersistedDashboardState,
} from '../dashboard/dashboardPersistence'
import { serializeDashboardState, useDashboardStore } from '../dashboard/useDashboardStore'
import {
  normalizePersistedNotepadState,
  serializePersistedNotepadState,
} from '../notepad/notepadPersistence'
import { serializeNotepadState, useNotepadStore } from '../notepad/useNotepadStore'
import { type EditHistoryEntry, editHistoryStore } from './editHistoryStore'

const seedRedoEntry = () => {
  const marker = { value: 'after' }
  const entry: EditHistoryEntry = {
    entryId: 'productivity-readiness-redo',
    label: 'Redo marker',
    source: {
      surface: 'productivity-readiness',
      sourceId: 'test',
      sourceLabel: 'Productivity readiness test',
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
  expect(editHistoryStore.getUndoEntries()).toEqual([])
  expect(editHistoryStore.getRedoEntries().map((redoEntry) => redoEntry.entryId)).toEqual([
    entry.entryId,
  ])

  return marker
}

const expectRedoPreserved = (marker: { value: string }) => {
  expect(marker.value).toBe('before')
  expect(editHistoryStore.getUndoEntries()).toEqual([])
  expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
    'productivity-readiness-redo',
  ])
  expect(editHistoryStore.canRedo()).toBe(true)
}

describe('productivity content edit-history readiness', () => {
  beforeEach(() => {
    editHistoryStore.clear()
    useNotepadStore.setState(useNotepadStore.getInitialState(), true)
    useDashboardStore.setState(useDashboardStore.getInitialState(), true)
  })

  it('keeps raw Notepad mutations durable and history-free before productivity wrappers exist', () => {
    const marker = seedRedoEntry()

    const firstNoteId = useNotepadStore.getState().createNote({
      title: 'Draft brief',
      body: 'Alpha',
    })
    const secondNoteId = useNotepadStore.getState().createNote({
      title: 'Follow-up',
      body: 'Beta',
    })
    useNotepadStore.getState().setActiveNoteId(firstNoteId)
    useNotepadStore.getState().renameNote(firstNoteId, 'Reviewed brief')
    useNotepadStore.getState().updateNoteBody(firstNoteId, 'Alpha with edits')
    useNotepadStore.getState().setNotePinned(firstNoteId, true)
    useNotepadStore.getState().setNoteColorPreset(firstNoteId, 'blue')
    useNotepadStore.getState().deleteNote(firstNoteId)

    const state = useNotepadStore.getState()
    expect(state.notesById[firstNoteId]).toBeUndefined()
    expect(state.notesById[secondNoteId]).toEqual(expect.objectContaining({
      title: 'Follow-up',
      body: 'Beta',
      isPinned: false,
      colorPreset: 'yellow',
    }))
    expect(state.noteOrder).toEqual([secondNoteId])
    expect(state.activeNoteId).toBe(secondNoteId)

    const persisted = normalizePersistedNotepadState(
      serializePersistedNotepadState(serializeNotepadState(state)),
    )
    expect(persisted).not.toBeNull()
    expect(persisted?.notesById).toEqual({
      [secondNoteId]: expect.objectContaining({
        id: secondNoteId,
        title: 'Follow-up',
        body: 'Beta',
      }),
    })
    expect(persisted?.noteOrder).toEqual([secondNoteId])
    expect(persisted?.activeNoteId).toBe(secondNoteId)

    expectRedoPreserved(marker)
  })

  it('keeps raw Dashboard organization mutations durable and history-free before productivity wrappers exist', () => {
    const marker = seedRedoEntry()

    const reviewLaneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    const archiveLaneId = useDashboardStore.getState().createLane('Archive')
    useDashboardStore.getState().renameLane(reviewLaneId, 'In Review')
    useDashboardStore.getState().setAdjacentLaneWidths('todo', reviewLaneId, 1.35, 0.65)
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1', 'note-2', 'note-3'])
    useDashboardStore.getState().setStickyNotePlacements([
      {
        noteId: 'note-1',
        laneId: reviewLaneId,
        x: 120.4,
        y: 88.6,
      },
      {
        noteId: 'note-2',
        laneId: reviewLaneId,
        x: 420,
        y: 140,
      },
    ])
    useDashboardStore.getState().setStickyNoteFrame('note-2', {
      x: 420,
      y: 140,
      width: 336,
      height: 248,
    })
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-2', 'note-1')
    useDashboardStore.getState().setStickyNotePlacement('note-1', archiveLaneId, 24, 24)
    useDashboardStore.getState().removeStickyNoteLayout('note-3')
    useDashboardStore.getState().removeLane(reviewLaneId, 'completed')

    const state = useDashboardStore.getState()
    expect(state.lanes.map((lane) => `${lane.id}:${lane.title}:${lane.order}`)).toEqual([
      'todo:TO DO:0',
      'completed:Completed:1',
      `${archiveLaneId}:Archive:2`,
    ])
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: archiveLaneId,
      x: 24,
      y: 24,
    })
    expect(state.stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: 'completed',
      x: 420,
      y: 140,
      width: 336,
      height: 248,
    })
    expect(state.stickyNoteLayoutsByNoteId['note-3']).toBeUndefined()

    const persisted = normalizePersistedDashboardState(
      serializePersistedDashboardState(serializeDashboardState(state)),
    )
    expect(persisted).not.toBeNull()
    expect(persisted?.lanes.map((lane) => `${lane.id}:${lane.title}:${lane.order}`)).toEqual([
      'todo:TO DO:0',
      'completed:Completed:1',
      `${archiveLaneId}:Archive:2`,
    ])
    expect(persisted?.stickyNoteLayoutsByNoteId).toEqual({
      'note-1': {
        noteId: 'note-1',
        laneId: archiveLaneId,
        x: 24,
        y: 24,
      },
      'note-2': {
        noteId: 'note-2',
        laneId: 'completed',
        x: 420,
        y: 140,
        width: 336,
        height: 248,
      },
    })

    expectRedoPreserved(marker)
  })

  it('keeps raw Dashboard lane-width writes scoped, history-free, and redo-preserving', () => {
    const reviewLaneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    useDashboardStore.getState().setStickyNotePlacement('note-1', 'completed', 48, 56)
    const marker = seedRedoEntry()

    useDashboardStore.getState().setAdjacentLaneWidths('todo', reviewLaneId, 1.4, 0.6)

    let state = useDashboardStore.getState()
    expect(state.lanes).toEqual([
      expect.objectContaining({ id: 'todo', width: 1.4 }),
      expect.objectContaining({ id: reviewLaneId, width: 0.6 }),
      expect.objectContaining({ id: 'completed', width: 1 }),
    ])
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'completed',
      x: 48,
      y: 56,
    })

    useDashboardStore.getState().setAdjacentLaneWidths('missing-lane', reviewLaneId, 2, 0.5)
    useDashboardStore.getState().setAdjacentLaneWidths('todo', 'completed', 2, 0.5)
    useDashboardStore.getState().setAdjacentLaneWidths('todo', reviewLaneId, 1.4, 0.6)

    state = useDashboardStore.getState()
    expect(state.lanes).toEqual([
      expect.objectContaining({ id: 'todo', width: 1.4 }),
      expect.objectContaining({ id: reviewLaneId, width: 0.6 }),
      expect.objectContaining({ id: 'completed', width: 1 }),
    ])
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'completed',
      x: 48,
      y: 56,
    })

    const persisted = normalizePersistedDashboardState(
      serializePersistedDashboardState(serializeDashboardState(state)),
    )
    expect(persisted?.lanes).toEqual([
      expect.objectContaining({ id: 'todo', width: 1.4 }),
      expect.objectContaining({ id: reviewLaneId, width: 0.6 }),
      expect.objectContaining({ id: 'completed', width: 1 }),
    ])
    expect(persisted?.stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'completed',
      x: 48,
      y: 56,
    })

    expectRedoPreserved(marker)
  })

  it('keeps raw Dashboard cleanup and reconciliation durable, history-free, and redo-preserving', () => {
    const reviewLaneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1', 'note-2', 'note-3'])
    useDashboardStore.getState().setStickyNotePlacements([
      {
        noteId: 'note-1',
        laneId: reviewLaneId,
        x: 120,
        y: 80,
      },
      {
        noteId: 'note-2',
        laneId: reviewLaneId,
        x: 340,
        y: 124,
      },
      {
        noteId: 'note-3',
        laneId: reviewLaneId,
        x: 560,
        y: 188,
      },
    ])
    useDashboardStore.getState().setStickyNoteFrame('note-2', {
      x: 340,
      y: 124,
      width: 320,
      height: 224,
    })
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-2', 'note-1')
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-3', 'note-2')
    const marker = seedRedoEntry()

    useDashboardStore.getState().reconcileStickyNoteLayouts([
      'note-2',
      'note-3',
      'note-4',
      'note-2',
      '',
    ])

    let state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toBeUndefined()
    expect(state.stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: reviewLaneId,
      x: 340,
      y: 124,
      width: 320,
      height: 224,
    })
    expect(state.stickyNoteLayoutsByNoteId['note-3']).toEqual({
      noteId: 'note-3',
      laneId: reviewLaneId,
      x: 560,
      y: 188,
      parentNoteId: 'note-2',
    })
    expect(state.stickyNoteLayoutsByNoteId['note-4']).toEqual({
      noteId: 'note-4',
      laneId: 'todo',
      x: 24,
      y: 24,
    })

    useDashboardStore.getState().removeStickyNoteLayout('note-2')
    useDashboardStore.getState().removeStickyNoteLayout('missing-note')

    state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-2']).toBeUndefined()
    expect(state.stickyNoteLayoutsByNoteId['note-3']).toEqual({
      noteId: 'note-3',
      laneId: reviewLaneId,
      x: 560,
      y: 188,
    })
    expect(state.stickyNoteLayoutsByNoteId['note-4']).toEqual({
      noteId: 'note-4',
      laneId: 'todo',
      x: 24,
      y: 24,
    })
    expect(state.lanes).toEqual([
      expect.objectContaining({ id: 'todo' }),
      expect.objectContaining({ id: reviewLaneId }),
      expect.objectContaining({ id: 'completed' }),
    ])

    const persisted = normalizePersistedDashboardState(
      serializePersistedDashboardState(serializeDashboardState(state)),
    )
    expect(persisted).not.toBeNull()
    expect(persisted?.lanes).toEqual([
      expect.objectContaining({ id: 'todo' }),
      expect.objectContaining({ id: reviewLaneId }),
      expect.objectContaining({ id: 'completed' }),
    ])
    expect(persisted?.stickyNoteLayoutsByNoteId).toEqual({
      'note-3': {
        noteId: 'note-3',
        laneId: reviewLaneId,
        x: 560,
        y: 188,
      },
      'note-4': {
        noteId: 'note-4',
        laneId: 'todo',
        x: 24,
        y: 24,
      },
    })

    expectRedoPreserved(marker)
  })

  it('keeps Dashboard persistence scoped to lanes and sticky-note layouts', () => {
    useDashboardStore.getState().setAdjacentLaneWidths('todo', 'completed', 1.2, 0.8)
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 64,
      y: 80,
      width: 320,
      height: 220,
    })

    const serialized = serializePersistedDashboardState(
      serializeDashboardState(useDashboardStore.getState()),
    )

    expect(Object.keys(serialized).sort()).toEqual([
      'lanes',
      'stickyNoteLayoutsByNoteId',
      'version',
    ])
    expect(serialized).not.toHaveProperty('laneCameras')
    expect(serialized).not.toHaveProperty('selectedNoteIds')
    expect(serialized).not.toHaveProperty('selectionBox')
    expect(serialized).not.toHaveProperty('dragPreview')
    expect(serialized).not.toHaveProperty('resizePreview')
    expect(serialized).not.toHaveProperty('menus')
    expect(serialized).not.toHaveProperty('floatingWindowRects')
    expect(serialized).not.toHaveProperty('shellPlacement')
  })
})
