import { beforeEach, describe, expect, it } from 'vitest'
import {
  normalizePersistedDashboardState,
  serializePersistedDashboardState,
} from './dashboardPersistence'
import { serializeDashboardState, useDashboardStore } from './useDashboardStore'

describe('useDashboardStore', () => {
  beforeEach(() => {
    useDashboardStore.setState(useDashboardStore.getInitialState(), true)
  })

  it('seeds default lanes and manages sticky-note layouts against dynamic lane ids', () => {
    let state = useDashboardStore.getState()
    expect(state.lanes.map((lane) => lane.id)).toEqual(['todo', 'completed'])

    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1', 'note-2'])

    state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toEqual(
      expect.objectContaining({
        noteId: 'note-1',
        laneId: 'todo',
        x: 24,
        y: 24,
      }),
    )

    const reviewLaneId = useDashboardStore.getState().createLane('Review')
    useDashboardStore.getState().setStickyNotePosition('note-2', 388, 222)
    useDashboardStore.getState().setStickyNoteLane('note-2', reviewLaneId)
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-2', 'note-3'])

    state = useDashboardStore.getState()
    expect(state.lanes.map((lane) => lane.title)).toEqual(['TO DO', 'Completed', 'Review'])
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toBeUndefined()
    expect(state.stickyNoteLayoutsByNoteId['note-2']).toEqual(
      expect.objectContaining({
        laneId: reviewLaneId,
        x: 388,
        y: 222,
      }),
    )
    expect(state.stickyNoteLayoutsByNoteId['note-3']).toEqual(
      expect.objectContaining({
        noteId: 'note-3',
        laneId: 'todo',
      }),
    )
  })

  it('renames lanes, preserves one minimum lane, and migrates note placement on lane delete', () => {
    const reviewLaneId = useDashboardStore.getState().createLane('Review')
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1'])
    useDashboardStore.getState().setStickyNotePlacement('note-1', reviewLaneId, 416, 152)
    useDashboardStore.getState().renameLane(reviewLaneId, 'In Review')

    let state = useDashboardStore.getState()
    expect(state.lanes.find((lane) => lane.id === reviewLaneId)?.title).toBe('In Review')

    useDashboardStore.getState().removeLane(reviewLaneId, 'completed')

    state = useDashboardStore.getState()
    expect(state.lanes.map((lane) => lane.id)).toEqual(['todo', 'completed'])
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toEqual(
      expect.objectContaining({
        noteId: 'note-1',
        laneId: 'completed',
        x: 416,
        y: 152,
      }),
    )

    useDashboardStore.getState().removeLane('todo', 'completed')
    state = useDashboardStore.getState()
    expect(state.lanes.map((lane) => lane.id)).toEqual(['completed'])

    useDashboardStore.getState().removeLane('completed', 'completed')
    state = useDashboardStore.getState()
    expect(state.lanes.map((lane) => lane.id)).toEqual(['completed'])
  })

  it('round-trips dashboard persistence with lanes and laneId-based layouts', () => {
    const reviewLaneId = useDashboardStore.getState().createLane('Review')
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1', 'note-2'])
    useDashboardStore.getState().setStickyNotePlacement('note-1', reviewLaneId, 420, 168)
    useDashboardStore.getState().setStickyNotePlacement('note-2', reviewLaneId, 640, 212)
    useDashboardStore.getState().setStickyNoteFrame('note-2', {
      x: 640,
      y: 212,
      width: 344,
      height: 260,
    })
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-2', 'note-1')

    const serialized = serializePersistedDashboardState(
      serializeDashboardState(useDashboardStore.getState()),
    )
    const normalized = normalizePersistedDashboardState(serialized)

    expect(normalized).not.toBeNull()
    expect(normalized?.lanes.map((lane) => lane.title)).toEqual(['TO DO', 'Completed', 'Review'])
    expect(normalized?.stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: reviewLaneId,
      x: 420,
      y: 168,
    })
    expect(normalized?.stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: reviewLaneId,
      x: 640,
      y: 212,
      width: 344,
      height: 260,
      parentNoteId: 'note-1',
    })
  })

  it('persists sticky-note width and height through the dashboard-owned frame seam', () => {
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1'])
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 88,
      y: 96,
      width: 320,
      height: 244,
    })

    const state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-1']).toEqual(
      expect.objectContaining({
        noteId: 'note-1',
        laneId: 'todo',
        x: 88,
        y: 96,
        width: 320,
        height: 244,
      }),
    )

    const normalized = normalizePersistedDashboardState(
      serializePersistedDashboardState(serializeDashboardState(state)),
    )

    expect(normalized?.stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'todo',
      x: 88,
      y: 96,
      width: 320,
      height: 244,
    })
  })

  it('updates adjacent lane widths and persists them with the lane records', () => {
    useDashboardStore.getState().setAdjacentLaneWidths('todo', 'completed', 1.45, 0.55)

    const state = useDashboardStore.getState()
    expect(state.lanes).toEqual([
      expect.objectContaining({ id: 'todo', width: 1.45 }),
      expect.objectContaining({ id: 'completed', width: 0.55 }),
    ])

    const serialized = serializePersistedDashboardState(
      serializeDashboardState(useDashboardStore.getState()),
    )
    const normalized = normalizePersistedDashboardState(serialized)

    expect(normalized?.lanes).toEqual([
      expect.objectContaining({ id: 'todo', width: 1.45 }),
      expect.objectContaining({ id: 'completed', width: 0.55 }),
    ])
  })

  it('detaches invalid sticky-note attachment links when notes cross lanes or disappear', () => {
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1', 'note-2', 'note-3'])
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-2', 'note-1')
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-3', 'note-2')

    let state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-2']?.parentNoteId).toBe('note-1')
    expect(state.stickyNoteLayoutsByNoteId['note-3']?.parentNoteId).toBe('note-2')

    useDashboardStore.getState().setStickyNoteLane('note-1', 'completed')
    state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-1']?.laneId).toBe('completed')
    expect(state.stickyNoteLayoutsByNoteId['note-2']?.parentNoteId).toBeUndefined()
    expect(state.stickyNoteLayoutsByNoteId['note-3']?.parentNoteId).toBe('note-2')

    useDashboardStore.getState().removeStickyNoteLayout('note-2')
    state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-2']).toBeUndefined()
    expect(state.stickyNoteLayoutsByNoteId['note-3']?.parentNoteId).toBeUndefined()
  })

  it('prevents sticky-note attachment cycles while allowing one-parent chains', () => {
    useDashboardStore.getState().reconcileStickyNoteLayouts(['note-1', 'note-2', 'note-3'])

    useDashboardStore.getState().setStickyNoteAttachmentParent('note-2', 'note-1')
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-3', 'note-2')
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-1', 'note-3')

    const state = useDashboardStore.getState()
    expect(state.stickyNoteLayoutsByNoteId['note-1']?.parentNoteId).toBeUndefined()
    expect(state.stickyNoteLayoutsByNoteId['note-2']?.parentNoteId).toBe('note-1')
    expect(state.stickyNoteLayoutsByNoteId['note-3']?.parentNoteId).toBe('note-2')
  })
})
