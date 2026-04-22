import type { EditHistoryEntry, EditHistorySnapshot } from './editHistoryStore'

export type EditHistoryReaderStackKey = 'undo' | 'redo'

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
}

export type EditHistoryReaderStackModel = {
  key: EditHistoryReaderStackKey
  label: string
  entries: EditHistoryReaderEntryModel[]
}

export type EditHistoryReaderModel = {
  undo: EditHistoryReaderStackModel
  redo: EditHistoryReaderStackModel
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
  canUndo: snapshot.canUndo,
  canRedo: snapshot.canRedo,
})
