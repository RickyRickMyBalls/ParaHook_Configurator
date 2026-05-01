import type {
  EditHistoryEntry,
  EditHistorySnapshot,
  EditHistorySnapshotLogEntry,
} from './editHistoryStore'

export type EditHistoryReaderStackKey = 'undo' | 'redo'

export type EditHistoryReaderChildSummaryModel = {
  childId: string
  label: string
  kind: string | null
  sequence: number
}

export type EditHistoryReaderEntryModel = {
  entryId: string
  label: string
  sourceSurface: string
  sourceId: string | null
  sourceLabel: string | null
  targetId: string | null
  targetLabel: string | null
  timestamp: string | null
  transactionId: string | null
  coalesceKey: string | null
  childSummaries: EditHistoryReaderChildSummaryModel[]
}

export type EditHistoryReaderStackModel = {
  key: EditHistoryReaderStackKey
  label: string
  entries: EditHistoryReaderEntryModel[]
}

export type EditHistoryReaderTimelineSide = 'applied' | 'redoable'

export type EditHistoryReaderTimelineEntryModel = EditHistoryReaderEntryModel & {
  side: EditHistoryReaderTimelineSide
  timelineIndex: number
}

export type EditHistoryReaderTimelineModel = {
  entries: EditHistoryReaderTimelineEntryModel[]
  markerIndex: number
  appliedCount: number
  redoableCount: number
}

export type EditHistoryReaderSnapshotLogEntryModel = {
  logId: string
  sequence: number
  action: EditHistorySnapshotLogEntry['action']
  entryId: string
  label: string
  sourceSurface: string
  sourceId: string | null
  sourceLabel: string | null
  targetId: string | null
  targetLabel: string | null
  timestamp: string
  entryTimestamp: string | null
  transactionId: string | null
  coalesceKey: string | null
  undoDepth: number
  redoDepth: number
}

export type EditHistoryReaderModel = {
  undo: EditHistoryReaderStackModel
  redo: EditHistoryReaderStackModel
  timeline: EditHistoryReaderTimelineModel
  snapshotLog: EditHistoryReaderSnapshotLogEntryModel[]
  canUndo: boolean
  canRedo: boolean
}

export const createEditHistoryReaderEntryModel = (
  entry: EditHistoryEntry,
): EditHistoryReaderEntryModel => ({
  entryId: entry.entryId,
  label: entry.label,
  sourceSurface: entry.source.surface,
  sourceId: entry.source.sourceId ?? null,
  sourceLabel: entry.source.sourceLabel ?? null,
  targetId: entry.targetId ?? null,
  targetLabel: entry.targetLabel ?? null,
  timestamp: entry.timestamp ?? null,
  transactionId: entry.transactionId ?? null,
  coalesceKey: entry.coalesceKey ?? null,
  childSummaries: (entry.childSummaries ?? []).map((summary) => ({ ...summary })),
})

export const createEditHistoryReaderTimelineEntryModel = (
  entry: EditHistoryEntry,
  side: EditHistoryReaderTimelineSide,
  timelineIndex: number,
): EditHistoryReaderTimelineEntryModel => ({
  ...createEditHistoryReaderEntryModel(entry),
  side,
  timelineIndex,
})

export const createEditHistoryReaderTimelineModel = (
  snapshot: EditHistorySnapshot,
): EditHistoryReaderTimelineModel => {
  const appliedEntries = snapshot.undoEntries.map((entry, index) =>
    createEditHistoryReaderTimelineEntryModel(entry, 'applied', index),
  )
  const redoableEntries = [...snapshot.redoEntries].reverse().map((entry, index) =>
    createEditHistoryReaderTimelineEntryModel(
      entry,
      'redoable',
      appliedEntries.length + index,
    ),
  )

  return {
    entries: [...appliedEntries, ...redoableEntries],
    markerIndex: appliedEntries.length,
    appliedCount: appliedEntries.length,
    redoableCount: redoableEntries.length,
  }
}

export const createEditHistoryReaderSnapshotLogEntryModel = (
  entry: EditHistorySnapshotLogEntry,
): EditHistoryReaderSnapshotLogEntryModel => ({
  logId: entry.logId,
  sequence: entry.sequence,
  action: entry.action,
  entryId: entry.entryId,
  label: entry.label,
  sourceSurface: entry.source.surface,
  sourceId: entry.source.sourceId ?? null,
  sourceLabel: entry.source.sourceLabel ?? null,
  targetId: entry.targetId ?? null,
  targetLabel: entry.targetLabel ?? null,
  timestamp: entry.timestamp,
  entryTimestamp: entry.entryTimestamp,
  transactionId: entry.transactionId ?? null,
  coalesceKey: entry.coalesceKey ?? null,
  undoDepth: entry.undoDepth,
  redoDepth: entry.redoDepth,
})

export const createEditHistoryReaderModel = (
  snapshot: EditHistorySnapshot,
): EditHistoryReaderModel => ({
  undo: {
    key: 'undo',
    label: 'Undo',
    entries: snapshot.undoEntries.map(createEditHistoryReaderEntryModel),
  },
  redo: {
    key: 'redo',
    label: 'Redo',
    entries: snapshot.redoEntries.map(createEditHistoryReaderEntryModel),
  },
  timeline: createEditHistoryReaderTimelineModel(snapshot),
  snapshotLog: snapshot.snapshotLog.map(createEditHistoryReaderSnapshotLogEntryModel),
  canUndo: snapshot.canUndo,
  canRedo: snapshot.canRedo,
})
