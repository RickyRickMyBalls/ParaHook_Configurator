export type EditHistoryOperation = () => void

export type EditHistorySourceMetadata = {
  surface: string
  sourceId?: string
  sourceLabel?: string
}

export type EditHistoryEntry = {
  entryId: string
  label: string
  source: EditHistorySourceMetadata
  targetId?: string
  targetLabel?: string
  timestamp?: string
  transactionId?: string
  coalesceKey?: string
  isNoop?: boolean
  undo: EditHistoryOperation
  redo: EditHistoryOperation
}

export type EditHistoryTransactionValues<TValue> = {
  transactionId: string
  entryId: string
  label: string
  source: EditHistorySourceMetadata
  targetId?: string
  targetLabel?: string
  coalesceKey?: string
  initialValue: TValue
  currentValue: TValue
}

export type EditHistoryTransactionEntryBuilder<TValue> = (
  values: EditHistoryTransactionValues<TValue>,
) => EditHistoryEntry

export type EditHistoryTransactionInput<TValue> = {
  transactionId: string
  entryId: string
  label: string
  source: EditHistorySourceMetadata
  targetId?: string
  targetLabel?: string
  coalesceKey?: string
  initialValue: TValue
  currentValue?: TValue
  areValuesEqual?: (initialValue: TValue, currentValue: TValue) => boolean
  buildEntry: EditHistoryTransactionEntryBuilder<TValue>
}

export type EditHistoryActiveTransaction = EditHistoryTransactionValues<unknown>

export type EditHistorySnapshot = {
  undoEntries: EditHistoryEntry[]
  redoEntries: EditHistoryEntry[]
  activeTransaction: EditHistoryActiveTransaction | null
  canUndo: boolean
  canRedo: boolean
}

export type EditHistoryTransactionCommitResult =
  | {
    status: 'committed'
    entry: EditHistoryEntry
  }
  | {
    status: 'unchanged' | 'no-active-transaction' | 'transaction-mismatch' | 'ignored-noop'
  }

export type EditHistoryOwner = {
  commitEntry: (entry: EditHistoryEntry) => boolean
  beginTransaction: <TValue>(input: EditHistoryTransactionInput<TValue>) => boolean
  updateTransaction: <TValue>(transactionId: string, currentValue: TValue) => boolean
  commitTransaction: (transactionId: string) => EditHistoryTransactionCommitResult
  cancelTransaction: (transactionId: string) => boolean
  undo: () => EditHistoryEntry | null
  redo: () => EditHistoryEntry | null
  clear: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  getUndoEntries: () => EditHistoryEntry[]
  getRedoEntries: () => EditHistoryEntry[]
  getActiveTransaction: () => EditHistoryActiveTransaction | null
  getSnapshot: () => EditHistorySnapshot
  subscribe: (listener: () => void) => () => void
}

type InternalEditHistoryTransaction = EditHistoryTransactionValues<unknown> & {
  areValuesEqual: (initialValue: unknown, currentValue: unknown) => boolean
  buildEntry: EditHistoryTransactionEntryBuilder<unknown>
}

const areTransactionValuesStrictlyEqual = (
  initialValue: unknown,
  currentValue: unknown,
): boolean => Object.is(initialValue, currentValue)

const withEntryTimestamp = (entry: EditHistoryEntry): EditHistoryEntry => ({
  ...entry,
  timestamp: entry.timestamp ?? new Date().toISOString(),
})

export const createEditHistoryStore = (): EditHistoryOwner => {
  let undoEntries: EditHistoryEntry[] = []
  let redoEntries: EditHistoryEntry[] = []
  let activeTransaction: InternalEditHistoryTransaction | null = null
  const listeners = new Set<() => void>()
  let cachedSnapshot: EditHistorySnapshot | null = null

  const emitChange = (): void => {
    cachedSnapshot = null
    listeners.forEach((listener) => listener())
  }

  const getActiveTransaction = (): EditHistoryActiveTransaction | null => {
    if (activeTransaction === null) {
      return null
    }

    return {
      transactionId: activeTransaction.transactionId,
      entryId: activeTransaction.entryId,
      label: activeTransaction.label,
      source: activeTransaction.source,
      targetId: activeTransaction.targetId,
      targetLabel: activeTransaction.targetLabel,
      coalesceKey: activeTransaction.coalesceKey,
      initialValue: activeTransaction.initialValue,
      currentValue: activeTransaction.currentValue,
    }
  }

  const getSnapshot = (): EditHistorySnapshot => {
    if (cachedSnapshot === null) {
      cachedSnapshot = {
        undoEntries: [...undoEntries],
        redoEntries: [...redoEntries],
        activeTransaction: getActiveTransaction(),
        canUndo: undoEntries.length > 0,
        canRedo: redoEntries.length > 0,
      }
    }
    return cachedSnapshot
  }

  const commitEntry = (entry: EditHistoryEntry): boolean => {
    if (entry.isNoop === true) {
      return false
    }

    undoEntries = [...undoEntries, withEntryTimestamp(entry)]
    redoEntries = []
    emitChange()
    return true
  }

  return {
    commitEntry,
    beginTransaction: (input) => {
      if (activeTransaction !== null) {
        return false
      }

      activeTransaction = {
        transactionId: input.transactionId,
        entryId: input.entryId,
        label: input.label,
        source: input.source,
        targetId: input.targetId,
        targetLabel: input.targetLabel,
        coalesceKey: input.coalesceKey,
        initialValue: input.initialValue,
        currentValue: input.currentValue ?? input.initialValue,
        areValuesEqual: input.areValuesEqual
          ? (initialValue, currentValue) => input.areValuesEqual?.(
            initialValue as typeof input.initialValue,
            currentValue as typeof input.initialValue,
          ) ?? false
          : areTransactionValuesStrictlyEqual,
        buildEntry: (values) => input.buildEntry({
          transactionId: values.transactionId,
          entryId: values.entryId,
          label: values.label,
          source: values.source,
          targetId: values.targetId,
          targetLabel: values.targetLabel,
          coalesceKey: values.coalesceKey,
          initialValue: values.initialValue as typeof input.initialValue,
          currentValue: values.currentValue as typeof input.initialValue,
        }),
      }
      emitChange()
      return true
    },
    updateTransaction: (transactionId, currentValue) => {
      if (activeTransaction?.transactionId !== transactionId) {
        return false
      }

      activeTransaction = {
        ...activeTransaction,
        currentValue,
      }
      emitChange()
      return true
    },
    commitTransaction: (transactionId) => {
      if (activeTransaction === null) {
        return {
          status: 'no-active-transaction',
        }
      }

      if (activeTransaction.transactionId !== transactionId) {
        return {
          status: 'transaction-mismatch',
        }
      }

      const transaction = activeTransaction
      activeTransaction = null

      if (transaction.areValuesEqual(transaction.initialValue, transaction.currentValue)) {
        emitChange()
        return {
          status: 'unchanged',
        }
      }

      const entry = withEntryTimestamp(transaction.buildEntry(transaction))
      if (!commitEntry(entry)) {
        emitChange()
        return {
          status: 'ignored-noop',
        }
      }

      return {
        status: 'committed',
        entry,
      }
    },
    cancelTransaction: (transactionId) => {
      if (activeTransaction?.transactionId !== transactionId) {
        return false
      }

      activeTransaction = null
      emitChange()
      return true
    },
    undo: () => {
      const entry = undoEntries.at(-1)
      if (entry === undefined) {
        return null
      }

      entry.undo()
      undoEntries = undoEntries.slice(0, -1)
      redoEntries = [...redoEntries, entry]
      emitChange()
      return entry
    },
    redo: () => {
      const entry = redoEntries.at(-1)
      if (entry === undefined) {
        return null
      }

      entry.redo()
      redoEntries = redoEntries.slice(0, -1)
      undoEntries = [...undoEntries, entry]
      emitChange()
      return entry
    },
    clear: () => {
      undoEntries = []
      redoEntries = []
      activeTransaction = null
      emitChange()
    },
    canUndo: () => undoEntries.length > 0,
    canRedo: () => redoEntries.length > 0,
    getUndoEntries: () => [...undoEntries],
    getRedoEntries: () => [...redoEntries],
    getActiveTransaction,
    getSnapshot,
    subscribe: (listener) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export const editHistoryStore = createEditHistoryStore()
