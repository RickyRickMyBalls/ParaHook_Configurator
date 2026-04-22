import { useMemo, useState, useSyncExternalStore } from 'react'
import { editHistoryStore } from '../store/editHistoryStore'
import {
  createEditHistoryReaderModel,
  type EditHistoryReaderEntryModel,
  type EditHistoryReaderStackKey,
} from '../store/editHistoryReaderViewModel'

type EditHistoryReaderSurfaceProps = {
  surfaceInstanceId: string
}

type SourceFilterChoice = {
  sourceSurface: string
  label: string
  count: number
}

const allSourceFilter = 'all'

const renderMetadataValue = (value: string | null): string => value ?? 'Not set'

const resolveEntrySummary = (entry: EditHistoryReaderEntryModel): string => {
  const source = entry.sourceLabel ?? entry.sourceSurface
  const target = entry.targetLabel ?? entry.targetId
  return target === null ? source : `${source} -> ${target}`
}

const renderStackLabel = (
  stack: EditHistoryReaderStackKey,
  undoCount: number,
  redoCount: number,
): string => (stack === 'undo' ? `Undo (${undoCount})` : `Redo (${redoCount})`)

const createSourceFilterChoices = (
  entries: EditHistoryReaderEntryModel[],
): SourceFilterChoice[] => {
  const choices = new Map<string, SourceFilterChoice>()

  for (const entry of entries) {
    const existingChoice = choices.get(entry.sourceSurface)
    if (existingChoice === undefined) {
      choices.set(entry.sourceSurface, {
        sourceSurface: entry.sourceSurface,
        label: entry.sourceLabel ?? entry.sourceSurface,
        count: 1,
      })
    } else {
      existingChoice.count += 1
    }
  }

  return Array.from(choices.values()).sort((left, right) =>
    left.label.localeCompare(right.label),
  )
}

export function EditHistoryReaderSurface({ surfaceInstanceId }: EditHistoryReaderSurfaceProps) {
  const snapshot = useSyncExternalStore(
    editHistoryStore.subscribe,
    editHistoryStore.getSnapshot,
    editHistoryStore.getSnapshot,
  )
  const model = useMemo(() => createEditHistoryReaderModel(snapshot), [snapshot])
  const [activeStack, setActiveStack] = useState<EditHistoryReaderStackKey>('undo')
  const [activeSourceFilter, setActiveSourceFilter] = useState<string>(allSourceFilter)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
  const activeEntries = model[activeStack].entries
  const sourceFilterChoices = useMemo(() => createSourceFilterChoices(activeEntries), [activeEntries])
  const effectiveSourceFilter =
    activeSourceFilter === allSourceFilter ||
    sourceFilterChoices.some((choice) => choice.sourceSurface === activeSourceFilter)
      ? activeSourceFilter
      : allSourceFilter
  const filteredEntries =
    effectiveSourceFilter === allSourceFilter
      ? activeEntries
      : activeEntries.filter((entry) => entry.sourceSurface === effectiveSourceFilter)
  const selectedEntry =
    filteredEntries.find((entry) => entry.entryId === selectedEntryId) ?? filteredEntries[0] ?? null
  const emptyStateMessage =
    activeEntries.length === 0
      ? `No ${model[activeStack].label.toLowerCase()} entries`
      : `No ${model[activeStack].label.toLowerCase()} entries for this source`

  return (
    <section
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--editHistory EditHistoryReaderSurface"
      data-workspace-surface-instance-id={surfaceInstanceId}
      aria-label="Edit History"
    >
      <div className="EditHistoryReaderSurfacePanel">
        <header className="EditHistoryReaderSurfaceHeader">
          <div>
            <p className="EditHistoryReaderSurfaceEyebrow">Canonical history</p>
            <h2>Edit History</h2>
          </div>
          <div className="EditHistoryReaderSurfaceActions" aria-label="Canonical history actions">
            <button
              type="button"
              onClick={() => editHistoryStore.undo()}
              disabled={!model.canUndo}
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => editHistoryStore.redo()}
              disabled={!model.canRedo}
            >
              Redo
            </button>
          </div>
        </header>

        <div className="EditHistoryReaderStackTabs" role="tablist" aria-label="History stack">
          {(['undo', 'redo'] as const).map((stack) => (
            <button
              key={stack}
              type="button"
              role="tab"
              aria-selected={activeStack === stack}
              className={activeStack === stack ? 'isActive' : undefined}
              onClick={() => {
                setActiveStack(stack)
                setActiveSourceFilter(allSourceFilter)
                setSelectedEntryId(null)
              }}
            >
              {renderStackLabel(stack, model.undo.entries.length, model.redo.entries.length)}
            </button>
          ))}
        </div>

        {sourceFilterChoices.length > 1 ? (
          <div className="EditHistoryReaderStackTabs" aria-label="History source filter">
            <button
              type="button"
              aria-pressed={effectiveSourceFilter === allSourceFilter}
              className={effectiveSourceFilter === allSourceFilter ? 'isActive' : undefined}
              onClick={() => {
                setActiveSourceFilter(allSourceFilter)
                setSelectedEntryId(null)
              }}
            >
              {`All (${activeEntries.length})`}
            </button>
            {sourceFilterChoices.map((choice) => (
              <button
                key={choice.sourceSurface}
                type="button"
                aria-pressed={effectiveSourceFilter === choice.sourceSurface}
                className={effectiveSourceFilter === choice.sourceSurface ? 'isActive' : undefined}
                onClick={() => {
                  setActiveSourceFilter(choice.sourceSurface)
                  setSelectedEntryId(null)
                }}
              >
                {`${choice.label} (${choice.count})`}
              </button>
            ))}
          </div>
        ) : null}

        <div className="EditHistoryReaderSurfaceBody">
          <ol className="EditHistoryReaderEntryList" aria-label={`${model[activeStack].label} stack`}>
            {filteredEntries.length === 0 ? (
              <li className="EditHistoryReaderEmptyState">
                {emptyStateMessage}
              </li>
            ) : (
              filteredEntries.map((entry) => (
                <li key={entry.entryId}>
                  <button
                    type="button"
                    className={selectedEntry?.entryId === entry.entryId ? 'isSelected' : undefined}
                    onClick={() => setSelectedEntryId(entry.entryId)}
                  >
                    <strong>{entry.label}</strong>
                    <span>{resolveEntrySummary(entry)}</span>
                    <time>{renderMetadataValue(entry.timestamp)}</time>
                  </button>
                </li>
              ))
            )}
          </ol>

          <aside className="EditHistoryReaderInspector" aria-label="History entry details">
            {selectedEntry === null ? (
              <p className="EditHistoryReaderEmptyState">
                Select an entry to inspect its public metadata.
              </p>
            ) : (
              <>
                <h3>{selectedEntry.label}</h3>
                <dl>
                  <div>
                    <dt>Entry ID</dt>
                    <dd>{selectedEntry.entryId}</dd>
                  </div>
                  <div>
                    <dt>Source surface</dt>
                    <dd>{selectedEntry.sourceSurface}</dd>
                  </div>
                  <div>
                    <dt>Source ID</dt>
                    <dd>{renderMetadataValue(selectedEntry.sourceId)}</dd>
                  </div>
                  <div>
                    <dt>Source label</dt>
                    <dd>{renderMetadataValue(selectedEntry.sourceLabel)}</dd>
                  </div>
                  <div>
                    <dt>Target ID</dt>
                    <dd>{renderMetadataValue(selectedEntry.targetId)}</dd>
                  </div>
                  <div>
                    <dt>Target label</dt>
                    <dd>{renderMetadataValue(selectedEntry.targetLabel)}</dd>
                  </div>
                  <div>
                    <dt>Timestamp</dt>
                    <dd>{renderMetadataValue(selectedEntry.timestamp)}</dd>
                  </div>
                  <div>
                    <dt>Transaction ID</dt>
                    <dd>{renderMetadataValue(selectedEntry.transactionId)}</dd>
                  </div>
                  <div>
                    <dt>Coalesce key</dt>
                    <dd>{renderMetadataValue(selectedEntry.coalesceKey)}</dd>
                  </div>
                </dl>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
