import { describe, expect, it, vi } from 'vitest'
import {
  type EditHistoryEntry,
  createEditHistoryStore,
} from './editHistoryStore'

const createTestEntry = (
  entryId: string,
  label: string,
  events: string[],
  options: Partial<EditHistoryEntry> = {},
): EditHistoryEntry => ({
  entryId,
  label,
  source: {
    surface: 'test-surface',
    sourceId: 'test-source',
    sourceLabel: 'Test Source',
  },
  targetId: `target-${entryId}`,
  targetLabel: `Target ${entryId}`,
  undo: () => {
    events.push(`undo:${entryId}`)
  },
  redo: () => {
    events.push(`redo:${entryId}`)
  },
  ...options,
})

const createValueTransaction = (
  valueRef: { value: number },
  options: {
    transactionId?: string
    entryId?: string
    label?: string
    initialValue?: number
    currentValue?: number
    areValuesEqual?: (initialValue: number, currentValue: number) => boolean
  } = {},
) => ({
  transactionId: options.transactionId ?? 'transaction-1',
  entryId: options.entryId ?? 'entry-transaction-1',
  label: options.label ?? 'Move value',
  source: {
    surface: 'test-surface',
    sourceId: 'test-transaction-source',
    sourceLabel: 'Test Transaction Source',
  },
  targetId: 'target-transaction-1',
  targetLabel: 'Target Transaction 1',
  coalesceKey: 'target-transaction-1:value',
  initialValue: options.initialValue ?? valueRef.value,
  currentValue: options.currentValue,
  areValuesEqual: options.areValuesEqual,
  buildEntry: ({
    transactionId,
    entryId,
    label,
    source,
    targetId,
    targetLabel,
    coalesceKey,
    initialValue,
    currentValue,
  }: {
    transactionId: string
    entryId: string
    label: string
    source: EditHistoryEntry['source']
    targetId?: string
    targetLabel?: string
    coalesceKey?: string
    initialValue: number
    currentValue: number
  }): EditHistoryEntry => ({
    transactionId,
    entryId,
    label,
    source,
    targetId,
    targetLabel,
    coalesceKey,
    undo: () => {
      valueRef.value = initialValue
    },
    redo: () => {
      valueRef.value = currentValue
    },
  }),
})

describe('editHistoryStore', () => {
  it('commits entries in authored order and keeps metadata readable', () => {
    const store = createEditHistoryStore()
    const events: string[] = []

    expect(store.commitEntry(createTestEntry('entry-1', 'First edit', events))).toBe(true)
    expect(store.commitEntry(createTestEntry('entry-2', 'Second edit', events, {
      source: {
        surface: 'graph',
        sourceId: 'graph-command',
        sourceLabel: 'Graph command',
      },
      targetId: 'node-2',
      targetLabel: 'Node 2',
      transactionId: 'transaction-1',
      coalesceKey: 'node-2:position',
    }))).toBe(true)

    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1', 'entry-2'])
    expect(store.getRedoEntries()).toEqual([])
    expect(store.getUndoEntries()[1]).toMatchObject({
      entryId: 'entry-2',
      label: 'Second edit',
      timestamp: expect.any(String),
      source: {
        surface: 'graph',
        sourceId: 'graph-command',
        sourceLabel: 'Graph command',
      },
      targetId: 'node-2',
      targetLabel: 'Node 2',
      transactionId: 'transaction-1',
      coalesceKey: 'node-2:position',
    })
  })

  it('publishes stable read snapshots to subscribers when canonical stacks change', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const snapshots: Array<{ undo: string[]; redo: string[]; canUndo: boolean; canRedo: boolean }> =
      []
    const unsubscribe = store.subscribe(() => {
      const snapshot = store.getSnapshot()
      snapshots.push({
        undo: snapshot.undoEntries.map((entry) => entry.entryId),
        redo: snapshot.redoEntries.map((entry) => entry.entryId),
        canUndo: snapshot.canUndo,
        canRedo: snapshot.canRedo,
      })
    })

    expect(store.getSnapshot()).toBe(store.getSnapshot())

    expect(store.commitEntry(createTestEntry('entry-1', 'First edit', events))).toBe(true)
    const committedSnapshot = store.getSnapshot()
    expect(committedSnapshot).toBe(store.getSnapshot())
    expect(committedSnapshot.undoEntries.map((entry) => entry.entryId)).toEqual(['entry-1'])
    expect(committedSnapshot.canUndo).toBe(true)
    expect(committedSnapshot.canRedo).toBe(false)

    expect(store.undo()?.entryId).toBe('entry-1')
    expect(store.getSnapshot().redoEntries.map((entry) => entry.entryId)).toEqual(['entry-1'])
    expect(store.redo()?.entryId).toBe('entry-1')
    expect(store.getSnapshot().undoEntries.map((entry) => entry.entryId)).toEqual(['entry-1'])

    unsubscribe()
    expect(store.clear()).toBeUndefined()
    expect(snapshots).toEqual([
      {
        undo: ['entry-1'],
        redo: [],
        canUndo: true,
        canRedo: false,
      },
      {
        undo: [],
        redo: ['entry-1'],
        canUndo: false,
        canRedo: true,
      },
      {
        undo: ['entry-1'],
        redo: [],
        canUndo: true,
        canRedo: false,
      },
    ])
  })

  it('undo walks backward and moves committed entries onto redo', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))

    expect(store.undo()?.entryId).toBe('entry-2')
    expect(store.undo()?.entryId).toBe('entry-1')
    expect(events).toEqual(['undo:entry-2', 'undo:entry-1'])
    expect(store.getUndoEntries()).toEqual([])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['entry-2', 'entry-1'])
    expect(store.canUndo()).toBe(false)
    expect(store.canRedo()).toBe(true)
  })

  it('redo walks forward from the redo stack and restores committed order', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))
    store.undo()
    store.undo()

    expect(store.redo()?.entryId).toBe('entry-1')
    expect(store.redo()?.entryId).toBe('entry-2')
    expect(events).toEqual(['undo:entry-2', 'undo:entry-1', 'redo:entry-1', 'redo:entry-2'])
    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1', 'entry-2'])
    expect(store.getRedoEntries()).toEqual([])
    expect(store.canUndo()).toBe(true)
    expect(store.canRedo()).toBe(false)
  })

  it('clears redo entries when a new entry commits after undo', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))
    store.undo()

    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['entry-2'])

    store.commitEntry(createTestEntry('entry-3', 'Third edit', events))

    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1', 'entry-3'])
    expect(store.getRedoEntries()).toEqual([])
    expect(store.canRedo()).toBe(false)
  })

  it('ignores explicit no-op entries without invalidating redo', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const listener = vi.fn()
    store.subscribe(listener)
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))
    store.undo()
    listener.mockClear()

    expect(store.commitEntry(createTestEntry('noop-entry', 'No-op edit', events, {
      isNoop: true,
    }))).toBe(false)

    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1'])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['entry-2'])
    expect(listener).not.toHaveBeenCalled()
  })

  it('clear empties both stacks and empty undo or redo calls are safe', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))
    store.undo()

    store.clear()

    expect(store.getUndoEntries()).toEqual([])
    expect(store.getRedoEntries()).toEqual([])
    expect(store.canUndo()).toBe(false)
    expect(store.canRedo()).toBe(false)
    expect(store.undo()).toBeNull()
    expect(store.redo()).toBeNull()
  })

  it('clear also drops an active transaction draft', () => {
    const store = createEditHistoryStore()
    const valueRef = { value: 1 }

    expect(store.beginTransaction(createValueTransaction(valueRef))).toBe(true)
    expect(store.getActiveTransaction()).toMatchObject({
      transactionId: 'transaction-1',
      initialValue: 1,
      currentValue: 1,
    })

    store.clear()

    expect(store.getActiveTransaction()).toBeNull()
  })

  it('leaves stacks unchanged when an undo operation throws', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const undoError = new Error('undo failed')
    const undo = vi.fn(() => {
      throw undoError
    })
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events, {
      undo,
    }))

    expect(() => store.undo()).toThrow(undoError)

    expect(undo).toHaveBeenCalledTimes(1)
    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1', 'entry-2'])
    expect(store.getRedoEntries()).toEqual([])
  })

  it('leaves stacks unchanged when a redo operation throws', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const redoError = new Error('redo failed')
    const redo = vi.fn(() => {
      throw redoError
    })
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events, {
      redo,
    }))
    store.undo()

    expect(() => store.redo()).toThrow(redoError)

    expect(redo).toHaveBeenCalledTimes(1)
    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1'])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['entry-2'])
  })

  it('collapses multiple transaction updates into one committed entry', () => {
    const store = createEditHistoryStore()
    const valueRef = { value: 10 }

    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'drag-1',
      entryId: 'drag-entry-1',
      label: 'Drag value',
    }))).toBe(true)
    expect(store.updateTransaction('drag-1', 12)).toBe(true)
    expect(store.updateTransaction('drag-1', 18)).toBe(true)
    expect(store.updateTransaction('drag-1', 25)).toBe(true)

    const result = store.commitTransaction('drag-1')

    expect(result.status).toBe('committed')
    if (result.status === 'committed') {
      expect(result.entry.timestamp).toEqual(expect.any(String))
      expect(Number.isNaN(Date.parse(result.entry.timestamp ?? ''))).toBe(false)
    }
    expect(store.getActiveTransaction()).toBeNull()
    expect(store.getUndoEntries()).toHaveLength(1)
    expect(store.getUndoEntries()[0]).toMatchObject({
      transactionId: 'drag-1',
      entryId: 'drag-entry-1',
      label: 'Drag value',
      source: {
        surface: 'test-surface',
        sourceId: 'test-transaction-source',
        sourceLabel: 'Test Transaction Source',
      },
      targetId: 'target-transaction-1',
      targetLabel: 'Target Transaction 1',
      coalesceKey: 'target-transaction-1:value',
    })

    valueRef.value = 25
    expect(store.undo()?.entryId).toBe('drag-entry-1')
    expect(valueRef.value).toBe(10)
    expect(store.redo()?.entryId).toBe('drag-entry-1')
    expect(valueRef.value).toBe(25)
  })

  it('cancels a transaction without creating an entry', () => {
    const store = createEditHistoryStore()
    const valueRef = { value: 3 }

    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'cancel-1',
    }))).toBe(true)
    expect(store.updateTransaction('cancel-1', 9)).toBe(true)
    expect(store.cancelTransaction('cancel-1')).toBe(true)

    expect(store.getActiveTransaction()).toBeNull()
    expect(store.getUndoEntries()).toEqual([])
    expect(store.getRedoEntries()).toEqual([])
    expect(store.canUndo()).toBe(false)
  })

  it('commits no entry for unchanged transactions and preserves redo', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const valueRef = { value: 7 }
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))
    store.undo()

    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'unchanged-1',
      initialValue: 7,
      currentValue: 7,
    }))).toBe(true)

    const result = store.commitTransaction('unchanged-1')

    expect(result).toEqual({
      status: 'unchanged',
    })
    expect(store.getActiveTransaction()).toBeNull()
    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1'])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['entry-2'])
  })

  it('notifies subscribers when a changed transaction is cleared by an explicit no-op entry', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const valueRef = { value: 2 }
    const listener = vi.fn()
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))
    store.undo()
    store.subscribe(listener)

    expect(store.beginTransaction({
      ...createValueTransaction(valueRef, {
        transactionId: 'noop-transaction-1',
        initialValue: 2,
        currentValue: 5,
      }),
      buildEntry: ({
        transactionId,
        entryId,
        label,
        source,
        targetId,
        targetLabel,
        coalesceKey,
      }: {
        transactionId: string
        entryId: string
        label: string
        source: EditHistoryEntry['source']
        targetId?: string
        targetLabel?: string
        coalesceKey?: string
        initialValue: number
        currentValue: number
      }): EditHistoryEntry => ({
        transactionId,
        entryId,
        label,
        source,
        targetId,
        targetLabel,
        coalesceKey,
        isNoop: true,
        undo: vi.fn(),
        redo: vi.fn(),
      }),
    })).toBe(true)
    listener.mockClear()

    expect(store.commitTransaction('noop-transaction-1')).toEqual({
      status: 'ignored-noop',
    })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(store.getSnapshot().activeTransaction).toBeNull()
    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1'])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['entry-2'])
  })

  it('uses a transaction equality predicate for no-change commits', () => {
    const store = createEditHistoryStore()
    const valueRef = { value: 5 }

    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'equal-1',
      initialValue: 5,
      currentValue: 5.04,
      areValuesEqual: (initialValue, currentValue) => Math.abs(initialValue - currentValue) < 0.1,
    }))).toBe(true)

    expect(store.commitTransaction('equal-1')).toEqual({
      status: 'unchanged',
    })
    expect(store.getUndoEntries()).toEqual([])
  })

  it('invalidates redo after a changed transaction commits', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const valueRef = { value: 1 }
    store.commitEntry(createTestEntry('entry-1', 'First edit', events))
    store.commitEntry(createTestEntry('entry-2', 'Second edit', events))
    store.undo()

    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['entry-2'])
    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'changed-1',
      entryId: 'changed-entry-1',
    }))).toBe(true)
    expect(store.updateTransaction('changed-1', 4)).toBe(true)

    expect(store.commitTransaction('changed-1').status).toBe('committed')

    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['entry-1', 'changed-entry-1'])
    expect(store.getRedoEntries()).toEqual([])
  })

  it('protects active transactions from mismatched updates and commits', () => {
    const store = createEditHistoryStore()
    const valueRef = { value: 2 }

    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'active-1',
    }))).toBe(true)
    expect(store.updateTransaction('other-transaction', 8)).toBe(false)
    expect(store.getActiveTransaction()).toMatchObject({
      transactionId: 'active-1',
      currentValue: 2,
    })

    expect(store.commitTransaction('other-transaction')).toEqual({
      status: 'transaction-mismatch',
    })
    expect(store.getActiveTransaction()).toMatchObject({
      transactionId: 'active-1',
      currentValue: 2,
    })
    expect(store.getUndoEntries()).toEqual([])
  })

  it('rejects a second begin while a transaction is active', () => {
    const store = createEditHistoryStore()
    const valueRef = { value: 11 }

    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'active-1',
    }))).toBe(true)
    expect(store.beginTransaction(createValueTransaction(valueRef, {
      transactionId: 'active-2',
      entryId: 'active-entry-2',
    }))).toBe(false)

    expect(store.getActiveTransaction()).toMatchObject({
      transactionId: 'active-1',
      entryId: 'entry-transaction-1',
    })
    expect(store.getUndoEntries()).toEqual([])
  })

  it('does not infer history entries from runtime or view-like reads', () => {
    const store = createEditHistoryStore()
    const excludedRuntimeProbe = {
      cameraPoseLabel: 'viewer-camera-navigation',
      buildProgressLabel: 'build-runtime-progress',
      providerCacheLabel: 'preview-cache-provider-state',
      focusMenuLabel: 'focus-menu-state',
      commandTranscriptLabel: 'command-transcript',
      commandRecallLabel: 'command-recall',
    }

    expect(store.canUndo()).toBe(false)
    expect(store.canRedo()).toBe(false)
    expect(store.getUndoEntries()).toEqual([])
    expect(store.getRedoEntries()).toEqual([])
    expect(excludedRuntimeProbe).toEqual({
      cameraPoseLabel: 'viewer-camera-navigation',
      buildProgressLabel: 'build-runtime-progress',
      providerCacheLabel: 'preview-cache-provider-state',
      focusMenuLabel: 'focus-menu-state',
      commandTranscriptLabel: 'command-transcript',
      commandRecallLabel: 'command-recall',
    })
    expect(store.getUndoEntries()).toEqual([])
    expect(store.getRedoEntries()).toEqual([])
  })

  it('keeps canceled and no-change runtime-like transactions out of history without invalidating redo', () => {
    const store = createEditHistoryStore()
    const events: string[] = []
    const runtimeValue = { value: 1 }
    store.commitEntry(createTestEntry('authored-entry-1', 'Authored edit 1', events))
    store.commitEntry(createTestEntry('authored-entry-2', 'Authored edit 2', events))
    store.undo()

    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['authored-entry-1'])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['authored-entry-2'])

    expect(store.beginTransaction(createValueTransaction(runtimeValue, {
      transactionId: 'camera-navigation-probe',
      entryId: 'excluded-camera-navigation-entry',
      label: 'Excluded camera navigation probe',
      initialValue: 1,
      currentValue: 4,
    }))).toBe(true)
    expect(store.cancelTransaction('camera-navigation-probe')).toBe(true)
    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['authored-entry-1'])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['authored-entry-2'])

    expect(store.beginTransaction(createValueTransaction(runtimeValue, {
      transactionId: 'build-runtime-progress-probe',
      entryId: 'excluded-build-runtime-entry',
      label: 'Excluded build runtime progress probe',
      initialValue: 2,
      currentValue: 2,
    }))).toBe(true)
    expect(store.commitTransaction('build-runtime-progress-probe')).toEqual({
      status: 'unchanged',
    })
    expect(store.getUndoEntries().map((entry) => entry.entryId)).toEqual(['authored-entry-1'])
    expect(store.getRedoEntries().map((entry) => entry.entryId)).toEqual(['authored-entry-2'])
  })
})
