import { beforeEach, describe, expect, it } from 'vitest'
import { useDashboardStore } from '../dashboard/useDashboardStore'
import { type EditHistoryEntry, editHistoryStore } from './editHistoryStore'
import {
  commitDashboardBoardPlacementCommandWithHistory,
  commitDashboardStickyNoteFrameWithHistory,
  commitDashboardStickyNotePlacementsWithHistory,
  createDashboardLaneAfterWithHistory,
  removeDashboardLaneWithHistory,
  renameDashboardLaneWithHistory,
} from './dashboardBoardEditHistory'

const resetStores = () => {
  editHistoryStore.clear()
  useDashboardStore.setState(useDashboardStore.getInitialState(), true)
}

const seedRedoEntry = () => {
  const marker = { value: 'after' }
  const entry: EditHistoryEntry = {
    entryId: 'dashboard-board-redo-sentinel',
    label: 'Redo sentinel',
    source: {
      surface: 'dashboard-board-test',
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
    'dashboard-board-redo-sentinel',
  ])
  expect(editHistoryStore.canRedo()).toBe(true)
}

describe('dashboard board edit history', () => {
  beforeEach(() => {
    resetStores()
  })

  it('commits one undoable create entry and redoes with the original generated lane id', () => {
    const laneId = createDashboardLaneAfterWithHistory('todo', 'Review', {
      entryId: 'dashboard-lane-create-test',
    })

    expect(laneId).toBe('lane-1')
    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-lane-create-test',
        label: 'Create Dashboard lane',
        source: {
          surface: 'dashboard',
          sourceId: 'board',
          sourceLabel: 'Dashboard board',
        },
        targetId: `dashboard-lane:${laneId}`,
        targetLabel: 'Review',
      },
    ])
    expect(useDashboardStore.getState().lanes.map((lane) => lane.id)).toEqual([
      'todo',
      laneId,
      'completed',
    ])

    const laterLaneId = useDashboardStore.getState().createLaneAfter(laneId, 'Later raw lane')
    useDashboardStore.getState().setStickyNotePlacement('later-note', laterLaneId, 120, 160)

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-lane-create-test')
    expect(useDashboardStore.getState().lanes.map((lane) => lane.id)).toEqual([
      'todo',
      'completed',
      laterLaneId,
    ])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['later-note']).toEqual({
      noteId: 'later-note',
      laneId: laterLaneId,
      x: 120,
      y: 160,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-lane-create-test')
    expect(useDashboardStore.getState().lanes.map((lane) => lane.id)).toEqual([
      'todo',
      laneId,
      'completed',
      laterLaneId,
    ])
    expect(useDashboardStore.getState().lanes.find((lane) => lane.id === laneId)).toEqual({
      id: laneId,
      title: 'Review',
      order: 1,
      width: 1,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['later-note']).toEqual({
      noteId: 'later-note',
      laneId: laterLaneId,
      x: 120,
      y: 160,
    })
  })

  it('commits lane rename with targeted title restore only', () => {
    const laneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    useDashboardStore.getState().setStickyNotePlacement('note-1', laneId, 88, 96)

    expect(renameDashboardLaneWithHistory(laneId, 'In Review', {
      entryId: 'dashboard-lane-rename-test',
    })).toBe(true)

    useDashboardStore.getState().setAdjacentLaneWidths('todo', laneId, 1.3, 0.7)
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 112,
      y: 128,
      width: 320,
      height: 220,
    })

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-lane-rename-test',
        label: 'Rename Dashboard lane',
        targetId: `dashboard-lane:${laneId}:title`,
        targetLabel: 'Dashboard lane title',
      },
    ])

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-lane-rename-test')
    expect(useDashboardStore.getState().lanes.find((lane) => lane.id === laneId)).toEqual({
      id: laneId,
      title: 'Review',
      order: 1,
      width: 0.7,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId,
      x: 112,
      y: 128,
      width: 320,
      height: 220,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-lane-rename-test')
    expect(useDashboardStore.getState().lanes.find((lane) => lane.id === laneId)?.title).toBe(
      'In Review',
    )
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId,
      x: 112,
      y: 128,
      width: 320,
      height: 220,
    })
  })

  it('commits lane remove with owned layout fallout and preserves unrelated later lanes and layouts', () => {
    const reviewLaneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    const archiveLaneId = useDashboardStore.getState().createLaneAfter(reviewLaneId, 'Archive')
    useDashboardStore.getState().setStickyNotePlacement('review-note', reviewLaneId, 220, 140)
    useDashboardStore.getState().setStickyNotePlacement('archive-note', archiveLaneId, 64, 80)

    expect(removeDashboardLaneWithHistory(reviewLaneId, 'completed', {
      entryId: 'dashboard-lane-remove-test',
    })).toBe(true)
    const laterLaneId = useDashboardStore.getState().createLaneAfter('completed', 'Later raw lane')
    useDashboardStore.getState().setStickyNotePlacement('later-note', laterLaneId, 340, 180)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-lane-remove-test',
        label: 'Delete Dashboard lane',
        targetId: `dashboard-lane:${reviewLaneId}`,
        targetLabel: 'Review',
      },
    ])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['review-note']).toEqual({
      noteId: 'review-note',
      laneId: 'completed',
      x: 220,
      y: 140,
    })

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-lane-remove-test')
    expect(useDashboardStore.getState().lanes.map((lane) => lane.id)).toEqual([
      'todo',
      reviewLaneId,
      archiveLaneId,
      'completed',
      laterLaneId,
    ])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['review-note']).toEqual({
      noteId: 'review-note',
      laneId: reviewLaneId,
      x: 220,
      y: 140,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['later-note']).toEqual({
      noteId: 'later-note',
      laneId: laterLaneId,
      x: 340,
      y: 180,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-lane-remove-test')
    expect(useDashboardStore.getState().lanes.map((lane) => lane.id)).toEqual([
      'todo',
      archiveLaneId,
      'completed',
      laterLaneId,
    ])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['review-note']).toEqual({
      noteId: 'review-note',
      laneId: 'completed',
      x: 220,
      y: 140,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['archive-note']).toEqual({
      noteId: 'archive-note',
      laneId: archiveLaneId,
      x: 64,
      y: 80,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['later-note']).toEqual({
      noteId: 'later-note',
      laneId: laterLaneId,
      x: 340,
      y: 180,
    })
  })

  it('keeps missing or unchanged lane operations out of history and preserves redo', () => {
    const laneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    const marker = seedRedoEntry()

    expect(renameDashboardLaneWithHistory('missing-lane', 'Missing')).toBe(false)
    expect(renameDashboardLaneWithHistory(laneId, 'Review')).toBe(false)
    expect(removeDashboardLaneWithHistory('missing-lane', 'completed')).toBe(false)
    expect(removeDashboardLaneWithHistory(laneId, 'missing-lane')).toBe(false)
    expect(removeDashboardLaneWithHistory(laneId, laneId)).toBe(false)

    expectRedoPreserved(marker)
  })

  it('keeps raw Dashboard lane methods history-free after wrappers are available', () => {
    const marker = seedRedoEntry()

    const laneId = useDashboardStore.getState().createLaneAfter('todo', 'Raw lane')
    useDashboardStore.getState().renameLane(laneId, 'Raw renamed')
    useDashboardStore.getState().setStickyNotePlacement('raw-note', laneId, 48, 56)
    useDashboardStore.getState().removeLane(laneId, 'completed')

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['raw-note']).toEqual({
      noteId: 'raw-note',
      laneId: 'completed',
      x: 48,
      y: 56,
    })
    expectRedoPreserved(marker)
  })

  it('commits one undoable sticky-note placement entry and preserves unrelated layouts and frames', () => {
    const laneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 24,
      y: 32,
      width: 320,
      height: 240,
    })
    useDashboardStore.getState().setStickyNotePlacement('unrelated-note', 'todo', 44, 52)

    expect(commitDashboardStickyNotePlacementsWithHistory([
      {
        noteId: 'note-1',
        laneId,
        x: 180,
        y: 96,
      },
    ], {
      entryId: 'dashboard-note-placement-test',
    })).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-note-placement-test',
        label: 'Move sticky note',
        source: {
          surface: 'dashboard',
          sourceId: 'board',
          sourceLabel: 'Dashboard board',
        },
        targetId: 'dashboard-note-layout:note-1',
        targetLabel: 'Sticky note layout',
      },
    ])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId,
      x: 180,
      y: 96,
      width: 320,
      height: 240,
    })

    useDashboardStore.getState().setStickyNotePlacement('unrelated-note', 'completed', 300, 312)
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 180,
      y: 96,
      width: 360,
      height: 260,
    })

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-note-placement-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'todo',
      x: 24,
      y: 32,
      width: 360,
      height: 260,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['unrelated-note']).toEqual({
      noteId: 'unrelated-note',
      laneId: 'completed',
      x: 300,
      y: 312,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-note-placement-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId,
      x: 180,
      y: 96,
      width: 360,
      height: 260,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['unrelated-note']).toEqual({
      noteId: 'unrelated-note',
      laneId: 'completed',
      x: 300,
      y: 312,
    })
  })

  it('commits selected sticky-note placement as one multi-note entry', () => {
    const laneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    useDashboardStore.getState().setStickyNotePlacement('note-1', 'todo', 24, 32)
    useDashboardStore.getState().setStickyNotePlacement('note-2', 'todo', 180, 200)

    expect(commitDashboardStickyNotePlacementsWithHistory([
      {
        noteId: 'note-1',
        laneId,
        x: 64,
        y: 72,
      },
      {
        noteId: 'note-2',
        laneId,
        x: 220,
        y: 240,
      },
    ], {
      entryId: 'dashboard-note-selection-placement-test',
    })).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-note-selection-placement-test',
        label: 'Move sticky notes',
        targetId: 'dashboard-note-layout:selection',
        targetLabel: 'Sticky note layouts',
      },
    ])

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-note-selection-placement-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'todo',
      x: 24,
      y: 32,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: 'todo',
      x: 180,
      y: 200,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-note-selection-placement-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId,
      x: 64,
      y: 72,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId,
      x: 220,
      y: 240,
    })
  })

  it('captures same-drop attachment parent changes in the placement entry', () => {
    useDashboardStore.getState().setStickyNotePlacement('parent-note', 'todo', 48, 56)
    useDashboardStore.getState().setStickyNotePlacement('child-note', 'todo', 280, 300)

    expect(commitDashboardStickyNotePlacementsWithHistory([
      {
        noteId: 'child-note',
        laneId: 'todo',
        x: 72,
        y: 80,
      },
    ], {
      attachmentParentChange: {
        noteId: 'child-note',
        parentNoteId: 'parent-note',
      },
      entryId: 'dashboard-note-attachment-placement-test',
    })).toBe(true)

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['child-note']).toEqual({
      noteId: 'child-note',
      laneId: 'todo',
      x: 72,
      y: 80,
      parentNoteId: 'parent-note',
    })

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-note-attachment-placement-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['child-note']).toEqual({
      noteId: 'child-note',
      laneId: 'todo',
      x: 280,
      y: 300,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-note-attachment-placement-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['child-note']).toEqual({
      noteId: 'child-note',
      laneId: 'todo',
      x: 72,
      y: 80,
      parentNoteId: 'parent-note',
    })
  })

  it('commits board align commands as x/y-only entries and preserves later lane, parent, and frame changes', () => {
    const reviewLaneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    useDashboardStore.getState().setStickyNotePlacement('parent-note', 'todo', 8, 12)
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 24,
      y: 32,
      width: 320,
      height: 220,
    })
    useDashboardStore.getState().setStickyNoteFrame('note-2', {
      x: 180,
      y: 200,
      width: 340,
      height: 240,
    })
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-2', 'parent-note')

    expect(commitDashboardBoardPlacementCommandWithHistory('align-vertical', [
      {
        noteId: 'note-1',
        laneId: 'todo',
        x: 24,
        y: 32,
      },
      {
        noteId: 'note-2',
        laneId: 'todo',
        x: 24,
        y: 200,
      },
    ], {
      entryId: 'dashboard-align-command-test',
      laneId: 'todo',
    })).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-align-command-test',
        label: 'Align sticky notes',
        source: {
          surface: 'dashboard',
          sourceId: 'board',
          sourceLabel: 'Dashboard board',
        },
        targetId: 'dashboard-board-command:align-vertical:todo',
        targetLabel: 'Vertical alignment',
      },
    ])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: 'todo',
      x: 24,
      y: 200,
      width: 340,
      height: 240,
      parentNoteId: 'parent-note',
    })

    useDashboardStore.getState().setStickyNoteAttachmentParent('note-2', null)
    useDashboardStore.getState().setStickyNotePlacement('note-2', reviewLaneId, 420, 440)
    useDashboardStore.getState().setStickyNoteFrame('note-2', {
      x: 420,
      y: 440,
      width: 360,
      height: 260,
    })

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-align-command-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: reviewLaneId,
      x: 180,
      y: 200,
      width: 360,
      height: 260,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-align-command-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: reviewLaneId,
      x: 24,
      y: 200,
      width: 360,
      height: 260,
    })
  })

  it('commits board grid commands as one grouped entry', () => {
    useDashboardStore.getState().setStickyNotePlacement('note-1', 'todo', 24, 32)
    useDashboardStore.getState().setStickyNotePlacement('note-2', 'todo', 180, 200)
    useDashboardStore.getState().setStickyNotePlacement('note-3', 'todo', 360, 420)

    expect(commitDashboardBoardPlacementCommandWithHistory('arrange-grid', [
      {
        noteId: 'note-1',
        laneId: 'todo',
        x: 24,
        y: 32,
      },
      {
        noteId: 'note-2',
        laneId: 'todo',
        x: 296,
        y: 32,
      },
      {
        noteId: 'note-3',
        laneId: 'todo',
        x: 568,
        y: 32,
      },
    ], {
      entryId: 'dashboard-grid-command-test',
      laneId: 'todo',
    })).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-grid-command-test',
        label: 'Arrange sticky notes',
        targetId: 'dashboard-board-command:grid:todo',
        targetLabel: 'Sticky note grid',
      },
    ])

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-grid-command-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: 'todo',
      x: 180,
      y: 200,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-3']).toEqual({
      noteId: 'note-3',
      laneId: 'todo',
      x: 360,
      y: 420,
    })

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-grid-command-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-2']).toEqual({
      noteId: 'note-2',
      laneId: 'todo',
      x: 296,
      y: 32,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-3']).toEqual({
      noteId: 'note-3',
      laneId: 'todo',
      x: 568,
      y: 32,
    })
  })

  it('keeps no-op or ineffective board command commits out of history and preserves redo', () => {
    useDashboardStore.getState().setStickyNotePlacement('note-1', 'todo', 24, 32)
    useDashboardStore.getState().setStickyNotePlacement('note-2', 'todo', 180, 200)
    const marker = seedRedoEntry()

    expect(commitDashboardBoardPlacementCommandWithHistory('align-horizontal', [], {
      laneId: 'todo',
    })).toBe(false)
    expect(commitDashboardBoardPlacementCommandWithHistory('align-horizontal', [
      {
        noteId: 'note-1',
        laneId: 'todo',
        x: 24,
        y: 32,
      },
    ], {
      laneId: 'todo',
    })).toBe(false)
    expect(commitDashboardBoardPlacementCommandWithHistory('align-horizontal', [
      {
        noteId: 'missing-note',
        laneId: 'todo',
        x: 24,
        y: 32,
      },
      {
        noteId: 'note-1',
        laneId: 'todo',
        x: 24,
        y: 32,
      },
    ], {
      laneId: 'todo',
    })).toBe(false)
    expect(commitDashboardBoardPlacementCommandWithHistory('align-horizontal', [
      {
        noteId: 'note-1',
        laneId: 'todo',
        x: 24,
        y: 32,
      },
      {
        noteId: 'note-2',
        laneId: 'todo',
        x: 180,
        y: 200,
      },
    ], {
      laneId: 'todo',
    })).toBe(false)

    expectRedoPreserved(marker)
  })

  it('commits one undoable sticky-note frame resize entry and preserves unrelated layout state', () => {
    const laneId = useDashboardStore.getState().createLaneAfter('todo', 'Review')
    useDashboardStore.getState().setStickyNotePlacement('parent-note', laneId, 8, 12)
    useDashboardStore.getState().setStickyNotePlacement('note-1', laneId, 24, 32)
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 24,
      y: 32,
      width: 320,
      height: 240,
    })
    useDashboardStore.getState().setStickyNoteAttachmentParent('note-1', 'parent-note')
    useDashboardStore.getState().setStickyNoteFrame('unrelated-note', {
      x: 64,
      y: 72,
      width: 280,
      height: 180,
    })

    expect(commitDashboardStickyNoteFrameWithHistory('note-1', {
      x: 72,
      y: 88,
      width: 360,
      height: 260,
    }, {
      entryId: 'dashboard-note-frame-test',
    })).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        entryId: 'dashboard-note-frame-test',
        label: 'Resize sticky note',
        source: {
          surface: 'dashboard',
          sourceId: 'board',
          sourceLabel: 'Dashboard board',
        },
        targetId: 'dashboard-note-frame:note-1',
        targetLabel: 'Sticky note frame',
      },
    ])
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId,
      x: 72,
      y: 88,
      width: 360,
      height: 260,
      parentNoteId: 'parent-note',
    })

    useDashboardStore.getState().setStickyNoteAttachmentParent('note-1', null)
    useDashboardStore.getState().setStickyNotePlacement('note-1', 'completed', 400, 420)
    useDashboardStore.getState().setStickyNoteFrame('unrelated-note', {
      x: 96,
      y: 104,
      width: 300,
      height: 190,
    })
    useDashboardStore.getState().setAdjacentLaneWidths('todo', laneId, 1.2, 0.8)

    expect(editHistoryStore.undo()?.entryId).toBe('dashboard-note-frame-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'completed',
      x: 24,
      y: 32,
      width: 320,
      height: 240,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['unrelated-note']).toEqual({
      noteId: 'unrelated-note',
      laneId: 'todo',
      x: 96,
      y: 104,
      width: 300,
      height: 190,
    })
    expect(useDashboardStore.getState().lanes.find((lane) => lane.id === laneId)?.width).toBe(0.8)

    expect(editHistoryStore.redo()?.entryId).toBe('dashboard-note-frame-test')
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['note-1']).toEqual({
      noteId: 'note-1',
      laneId: 'completed',
      x: 72,
      y: 88,
      width: 360,
      height: 260,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['unrelated-note']).toEqual({
      noteId: 'unrelated-note',
      laneId: 'todo',
      x: 96,
      y: 104,
      width: 300,
      height: 190,
    })
    expect(useDashboardStore.getState().lanes.find((lane) => lane.id === laneId)?.width).toBe(0.8)
  })

  it('keeps missing or unchanged sticky-note frame commits out of history and preserves redo', () => {
    useDashboardStore.getState().setStickyNoteFrame('note-1', {
      x: 24,
      y: 32,
      width: 320,
      height: 240,
    })
    const marker = seedRedoEntry()

    expect(commitDashboardStickyNoteFrameWithHistory('missing-note', {
      x: 48,
      y: 56,
      width: 360,
      height: 260,
    })).toBe(false)
    expect(commitDashboardStickyNoteFrameWithHistory('note-1', {
      x: 24,
      y: 32,
      width: 320,
      height: 240,
    })).toBe(false)
    useDashboardStore.getState().setStickyNotePlacement('default-size-note', 'todo', 48, 56)
    expect(commitDashboardStickyNoteFrameWithHistory('default-size-note', {
      x: 48,
      y: 56,
      width: 248,
      height: 196,
    })).toBe(false)

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['missing-note']).toBeUndefined()
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['default-size-note']).toEqual({
      noteId: 'default-size-note',
      laneId: 'todo',
      x: 48,
      y: 56,
    })
    expectRedoPreserved(marker)
  })

  it('keeps no-op or ineffective sticky-note placement commits out of history and preserves redo', () => {
    useDashboardStore.getState().setStickyNotePlacement('note-1', 'todo', 24, 32)
    const marker = seedRedoEntry()

    expect(commitDashboardStickyNotePlacementsWithHistory([])).toBe(false)
    expect(commitDashboardStickyNotePlacementsWithHistory([
      {
        noteId: 'note-1',
        laneId: 'todo',
        x: 24,
        y: 32,
      },
    ])).toBe(false)
    expect(commitDashboardStickyNotePlacementsWithHistory([
      {
        noteId: 'missing-note',
        laneId: 'completed',
        x: 48,
        y: 56,
      },
    ])).toBe(false)

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['missing-note']).toEqual({
      noteId: 'missing-note',
      laneId: 'completed',
      x: 48,
      y: 56,
    })
    expectRedoPreserved(marker)
  })

  it('keeps raw Dashboard layout methods history-free after placement wrappers are available', () => {
    const marker = seedRedoEntry()

    useDashboardStore.getState().setStickyNotePlacement('raw-note', 'todo', 48, 56)
    useDashboardStore.getState().setStickyNoteFrame('raw-frame-note', {
      x: 120,
      y: 136,
      width: 320,
      height: 240,
    })
    useDashboardStore.getState().setStickyNotePlacements([
      {
        noteId: 'raw-note',
        laneId: 'completed',
        x: 88,
        y: 96,
      },
    ])
    useDashboardStore.getState().setStickyNoteAttachmentParent('raw-note', 'missing-parent')

    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['raw-note']).toEqual({
      noteId: 'raw-note',
      laneId: 'completed',
      x: 88,
      y: 96,
    })
    expect(useDashboardStore.getState().stickyNoteLayoutsByNoteId['raw-frame-note']).toEqual({
      noteId: 'raw-frame-note',
      laneId: 'todo',
      x: 120,
      y: 136,
      width: 320,
      height: 240,
    })
    expectRedoPreserved(marker)
  })
})
