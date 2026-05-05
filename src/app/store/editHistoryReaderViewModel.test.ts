import { describe, expect, it, vi } from 'vitest'
import type {
  EditHistoryEntry,
  EditHistorySnapshot,
  EditHistorySnapshotLogEntry,
} from './editHistoryStore'
import {
  createEditHistoryReaderModel,
  createEditHistoryReaderTimelineModel,
} from './editHistoryReaderViewModel'

const createEntry = (
  entryId: string,
  label: string,
  options: Partial<EditHistoryEntry> = {},
): EditHistoryEntry => ({
  entryId,
  label,
  source: {
    surface: options.source?.surface ?? 'test-surface',
    sourceId: options.source?.sourceId ?? `source-${entryId}`,
    sourceLabel: options.source?.sourceLabel ?? `Source ${entryId}`,
  },
  targetId: options.targetId ?? `target-${entryId}`,
  targetLabel: options.targetLabel ?? `Target ${entryId}`,
  timestamp: options.timestamp ?? `2026-04-30T22:20:0${entryId.slice(-1)}.000Z`,
  transactionId: options.transactionId ?? `transaction-${entryId}`,
  coalesceKey: options.coalesceKey ?? `coalesce-${entryId}`,
  childSummaries: options.childSummaries,
  childRestorePoints: options.childRestorePoints,
  undo: options.undo ?? vi.fn(),
  redo: options.redo ?? vi.fn(),
})

const createSnapshot = (
  undoEntries: EditHistoryEntry[] = [],
  redoEntries: EditHistoryEntry[] = [],
  snapshotLog: EditHistorySnapshotLogEntry[] = [],
): EditHistorySnapshot => ({
  undoEntries,
  redoEntries,
  snapshotLog,
  activeTransaction: null,
  canUndo: undoEntries.length > 0,
  canRedo: redoEntries.length > 0,
})

describe('editHistoryReaderViewModel', () => {
  it('returns an empty timeline for empty history', () => {
    expect(createEditHistoryReaderTimelineModel(createSnapshot())).toEqual({
      entries: [],
      markerIndex: 0,
      appliedCount: 0,
      redoableCount: 0,
    })
  })

  it('keeps committed entries applied and places the marker at the end', () => {
    const timeline = createEditHistoryReaderTimelineModel(
      createSnapshot([
        createEntry('entry-a', 'First edit'),
        createEntry('entry-b', 'Second edit'),
      ]),
    )

    expect(timeline.markerIndex).toBe(2)
    expect(timeline.appliedCount).toBe(2)
    expect(timeline.redoableCount).toBe(0)
    expect(timeline.entries.map((entry) => entry.entryId)).toEqual(['entry-a', 'entry-b'])
    expect(timeline.entries.map((entry) => entry.side)).toEqual(['applied', 'applied'])
    expect(timeline.entries.map((entry) => entry.timelineIndex)).toEqual([0, 1])
  })

  it('orders redoable entries by redo execution order after the marker', () => {
    const timeline = createEditHistoryReaderTimelineModel(
      createSnapshot(
        [
          createEntry('entry-a', 'First edit'),
          createEntry('entry-b', 'Second edit'),
        ],
        [
          createEntry('entry-d', 'Fourth edit'),
          createEntry('entry-c', 'Third edit', {
            source: {
              surface: 'graph',
              sourceId: 'graph-command',
              sourceLabel: 'Graph Command',
            },
            targetId: 'node-c',
            targetLabel: 'Node C',
            transactionId: 'transaction-c',
            coalesceKey: 'node-c:position',
          }),
        ],
      ),
    )

    expect(timeline.entries.map((entry) => entry.entryId)).toEqual([
      'entry-a',
      'entry-b',
      'entry-c',
      'entry-d',
    ])
    expect(timeline.entries.map((entry) => entry.side)).toEqual([
      'applied',
      'applied',
      'redoable',
      'redoable',
    ])
    expect(timeline.entries.map((entry) => entry.timelineIndex)).toEqual([0, 1, 2, 3])
    expect(timeline.markerIndex).toBe(2)
    expect(timeline.appliedCount).toBe(2)
    expect(timeline.redoableCount).toBe(2)
    expect(timeline.entries[2]).toMatchObject({
      entryId: 'entry-c',
      label: 'Third edit',
      sourceSurface: 'graph',
      sourceId: 'graph-command',
      sourceLabel: 'Graph Command',
      targetId: 'node-c',
      targetLabel: 'Node C',
      transactionId: 'transaction-c',
      coalesceKey: 'node-c:position',
    })
    expect('undo' in timeline.entries[2]).toBe(false)
    expect('redo' in timeline.entries[2]).toBe(false)
  })

  it('includes the unified timeline on the full reader model', () => {
    const snapshot = createSnapshot(
      [createEntry('entry-a', 'First edit')],
      [createEntry('entry-b', 'Second edit')],
    )

    expect(createEditHistoryReaderModel(snapshot).timeline).toEqual(
      createEditHistoryReaderTimelineModel(snapshot),
    )
  })

  it('keeps diagnostic snapshot activity out of the canonical timeline model', () => {
    const snapshot = createSnapshot(
      [createEntry('entry-a', 'First edit')],
      [],
      [
        {
          logId: 'activity-1',
          sequence: 1,
          action: 'commit',
          entryId: 'activity-only-entry',
          label: 'Activity-only edit',
          source: {
            surface: 'diagnostic',
            sourceId: 'diagnostic-activity',
            sourceLabel: 'Diagnostic Activity',
          },
          targetId: 'activity-target',
          targetLabel: 'Activity Target',
          timestamp: '2026-05-01T10:12:11.000Z',
          entryTimestamp: null,
          transactionId: 'activity-transaction',
          coalesceKey: 'activity-key',
          undoDepth: 1,
          redoDepth: 0,
        },
      ],
    )

    const model = createEditHistoryReaderModel(snapshot)

    expect(model.timeline.entries.map((entry) => entry.entryId)).toEqual(['entry-a'])
    expect(model.timeline.markerIndex).toBe(1)
    expect(model.timeline.appliedCount).toBe(1)
    expect(model.timeline.redoableCount).toBe(0)
    expect(model.snapshotLog.map((entry) => entry.entryId)).toEqual(['activity-only-entry'])
  })

  it('exposes cloned public child summaries on stack and timeline entries', () => {
    const sourceChildSummaries = [
      {
        childId: 'draw-command-1',
        label: 'Draw sketch line',
        kind: 'geometry' as const,
        sequence: 1,
      },
    ]
    const snapshot = createSnapshot([
      createEntry('entry-a', 'Commit sketch draw changes', {
        childSummaries: sourceChildSummaries,
      }),
    ])

    const model = createEditHistoryReaderModel(snapshot)

    expect(model.undo.entries[0].childSummaries).toEqual([
      {
        ...sourceChildSummaries[0],
        canRestore: false,
      },
    ])
    expect(model.timeline.entries[0].childSummaries).toEqual([
      {
        ...sourceChildSummaries[0],
        canRestore: false,
      },
    ])
    expect(model.undo.entries[0].childSummaries).not.toBe(sourceChildSummaries)
    expect(model.timeline.entries[0].childSummaries).not.toBe(sourceChildSummaries)
    expect('undo' in model.timeline.entries[0].childSummaries[0]).toBe(false)
    expect('redo' in model.timeline.entries[0].childSummaries[0]).toBe(false)
    expect('restore' in model.timeline.entries[0].childSummaries[0]).toBe(false)
    expect('beforeParams' in model.timeline.entries[0].childSummaries[0]).toBe(false)
    expect('afterParams' in model.timeline.entries[0].childSummaries[0]).toBe(false)
  })

  it('marks restorable public child summaries without exposing restore callbacks', () => {
    const snapshot = createSnapshot([
      createEntry('entry-a', 'Commit sketch draw changes', {
        childSummaries: [
          {
            childId: 'draw-command-1',
            label: 'Draw sketch line',
            kind: 'geometry',
            sequence: 1,
          },
          {
            childId: 'tool-command-1',
            label: 'Select sketch rectangle tool',
            kind: 'tool-selection',
            sequence: 2,
          },
        ],
        childRestorePoints: [
          {
            childId: 'draw-command-1',
            restore: vi.fn(),
          },
        ],
      }),
    ])

    const model = createEditHistoryReaderModel(snapshot)

    expect(model.timeline.entries[0].childSummaries).toMatchObject([
      {
        childId: 'draw-command-1',
        canRestore: true,
      },
      {
        childId: 'tool-command-1',
        canRestore: false,
      },
    ])
    expect('restore' in model.timeline.entries[0].childSummaries[0]).toBe(false)
  })

  it('keeps child summaries inside parent entries instead of adding child timeline entries', () => {
    const snapshot = createSnapshot([
      createEntry('entry-a', 'Commit sketch draw changes', {
        childSummaries: [
          {
            childId: 'draw-command-1',
            label: 'Draw sketch line',
            kind: 'geometry',
            sequence: 1,
          },
          {
            childId: 'tool-command-1',
            label: 'Select sketch rectangle tool',
            kind: 'tool-selection',
            sequence: 2,
          },
        ],
      }),
    ])

    const model = createEditHistoryReaderModel(snapshot)

    expect(model.timeline.entries).toHaveLength(1)
    expect(model.timeline.entries.map((entry) => entry.entryId)).toEqual(['entry-a'])
    expect(model.timeline.entries[0].childSummaries).toHaveLength(2)
    expect(model.timeline.appliedCount).toBe(1)
    expect(model.timeline.redoableCount).toBe(0)
  })
})
