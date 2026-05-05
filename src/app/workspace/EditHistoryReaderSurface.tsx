import {
  useMemo,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
  type PointerEvent,
} from 'react'
import { editHistoryStore } from '../store/editHistoryStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import {
  createEditHistoryReaderModel,
  type EditHistoryReaderChildSummaryModel,
  type EditHistoryReaderEntryModel,
  type EditHistoryReaderSnapshotLogEntryModel,
  type EditHistoryReaderStackKey,
  type EditHistoryReaderTimelineEntryModel,
} from '../store/editHistoryReaderViewModel'

type EditHistoryReaderSurfaceProps = {
  surfaceInstanceId: string
}

type EditHistoryReaderTabKey = 'timeline' | EditHistoryReaderStackKey | 'sketchDraw'

type SourceFilterChoice = {
  sourceSurface: string
  label: string
  count: number
}

type TimelineScrubPreviewState = {
  pointerId: number
  previewMarkerIndex: number
  dragPercent: number
  previewChildTarget: TimelineChildTarget | null
}

type TimelineRailDotState = {
  entryId: string
  percent: number
}

type TimelineChildTarget = {
  entryId: string
  childId: string
  restored: boolean
}

type TimelineChildTargetMeasurement = Pick<TimelineChildTarget, 'entryId' | 'childId'> & {
  percent: number
}

const allSourceFilter = 'all'
const timelineMarkerSelectionId = 'timeline-marker'
const timelineChildPreviewSnapThresholdPercent = 6

const renderMetadataValue = (value: string | null): string => value ?? 'Not set'

const renderSnapshotLogAction = (entry: EditHistoryReaderSnapshotLogEntryModel): string => {
  switch (entry.action) {
    case 'commit':
      return 'Captured'
    case 'undo':
      return 'Undo'
    case 'redo':
      return 'Redo'
  }
}

const resolveEntrySummary = (
  entry: Pick<EditHistoryReaderEntryModel, 'sourceLabel' | 'sourceSurface' | 'targetLabel' | 'targetId'>,
): string => {
  const source = entry.sourceLabel ?? entry.sourceSurface
  const target = entry.targetLabel ?? entry.targetId
  return target === null ? source : `${source} -> ${target}`
}

const renderStackLabel = (
  stack: EditHistoryReaderStackKey,
  undoCount: number,
  redoCount: number,
): string => (stack === 'undo' ? `Undo (${undoCount})` : `Redo (${redoCount})`)

const renderHistoryTabLabel = (
  tab: EditHistoryReaderTabKey,
  undoCount: number,
  redoCount: number,
  timelineCount: number,
  sketchDrawCount: number,
): string => {
  if (tab === 'timeline') {
    return `Timeline (${timelineCount})`
  }

  if (tab === 'sketchDraw') {
    return `Sketch Draw (${sketchDrawCount})`
  }

  return renderStackLabel(tab, undoCount, redoCount)
}

const renderTimelineSideLabel = (entry: EditHistoryReaderTimelineEntryModel): string =>
  entry.side === 'applied' ? 'Applied' : 'Redoable'

const isTimelineGroupExpandable = (entry: EditHistoryReaderTimelineEntryModel): boolean =>
  entry.label === 'Commit sketch draw changes'

const resolveTimelineEntryTargetMarkerIndex = (
  entry: EditHistoryReaderTimelineEntryModel,
): number => (entry.side === 'applied' ? entry.timelineIndex : entry.timelineIndex + 1)

const resolveTimelineRailTargetMarkerIndex = (
  railRect: DOMRect,
  clientY: number,
  timelineEntryCount: number,
): number => {
  if (timelineEntryCount <= 0 || railRect.height <= 0) {
    return 0
  }

  const normalizedPosition = (clientY - railRect.top) / railRect.height
  const clampedPosition = Math.min(1, Math.max(0, normalizedPosition))
  return Math.max(0, timelineEntryCount - Math.floor(clampedPosition * (timelineEntryCount + 1)))
}

const resolveTimelineRailDragPercent = (railRect: DOMRect, clientY: number): number => {
  if (railRect.height <= 0) {
    return 0
  }

  const normalizedPosition = (clientY - railRect.top) / railRect.height
  const clampedPosition = Math.min(1, Math.max(0, normalizedPosition))
  return clampedPosition * 100
}

const resolveElementCenterPercent = (
  containerRect: DOMRect,
  measuredHeight: number,
  element: Element,
): number | null => {
  const elementRect = element.getBoundingClientRect()
  if (measuredHeight <= 0 || elementRect.height <= 0) {
    return null
  }

  const elementCenter = elementRect.top - containerRect.top + elementRect.height / 2
  const normalizedPosition = elementCenter / measuredHeight
  const clampedPosition = Math.min(1, Math.max(0, normalizedPosition))
  return clampedPosition * 100
}

const areTimelineRailDotsEqual = (
  left: TimelineRailDotState[],
  right: TimelineRailDotState[],
): boolean =>
  left.length === right.length &&
  left.every((leftDot, index) => {
    const rightDot = right[index]
    return rightDot?.entryId === leftDot.entryId && rightDot.percent === leftDot.percent
  })

const areTimelineChildTargetMeasurementsEqual = (
  left: TimelineChildTargetMeasurement[],
  right: TimelineChildTargetMeasurement[],
): boolean =>
  left.length === right.length &&
  left.every((leftTarget, index) => {
    const rightTarget = right[index]
    return (
      rightTarget?.entryId === leftTarget.entryId &&
      rightTarget.childId === leftTarget.childId &&
      rightTarget.percent === leftTarget.percent
    )
  })

const sortTimelineEntriesNewestFirst = (
  entries: EditHistoryReaderTimelineEntryModel[],
): EditHistoryReaderTimelineEntryModel[] =>
  [...entries].sort((left, right) => right.timelineIndex - left.timelineIndex)

const renderTimelineEntryNumberedLabel = (
  entry: EditHistoryReaderTimelineEntryModel,
): string => `#${entry.timelineIndex + 1} ${entry.label}`

const resolveSketchDrawHistoryScrubNodeId = (
  entry: EditHistoryReaderTimelineEntryModel,
): string | null => {
  if (entry.sourceId !== 'geometry-sketch-draw' || entry.targetId === null) {
    return null
  }

  const [nodeId] = entry.targetId.split(':')
  return nodeId === undefined || nodeId.length === 0 ? null : nodeId
}

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
  const geometrySketchSession = useSpaghettiStore((state) => state.geometrySketchSession)
  const geometrySketchHistoryScrub = useSpaghettiStore((state) => state.geometrySketchHistoryScrub)
  const activeGraphDocumentId = useSpaghettiStore((state) => state.activeGraphDocumentId)
  const openGeometrySketchHistoryScrub = useSpaghettiStore(
    (state) => state.openGeometrySketchHistoryScrub,
  )
  const clearGeometrySketchHistoryScrub = useSpaghettiStore(
    (state) => state.clearGeometrySketchHistoryScrub,
  )
  const model = useMemo(() => createEditHistoryReaderModel(snapshot), [snapshot])
  const sketchDrawEntries =
    geometrySketchSession?.mode === 'draw'
      ? geometrySketchSession.sessionUndoCommands.map((entry, index) => ({
        commandId: entry.commandId,
        label: entry.label,
        kind: entry.kind,
        sequence: index + 1,
      }))
      : []
  const hasPendingSketchDrawHistory = sketchDrawEntries.length > 0
  const [activeTab, setActiveTab] = useState<EditHistoryReaderTabKey>('timeline')
  const [activeSourceFilter, setActiveSourceFilter] = useState<string>(allSourceFilter)
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
  const [selectedChildTarget, setSelectedChildTarget] = useState<TimelineChildTarget | null>(null)
  const [timelineScrubPreview, setTimelineScrubPreview] =
    useState<TimelineScrubPreviewState | null>(null)
  const [timelineRailHeight, setTimelineRailHeight] = useState<number | null>(null)
  const [timelineMeasuredMarkerPercent, setTimelineMeasuredMarkerPercent] =
    useState<number | null>(null)
  const [timelineMeasuredRailDots, setTimelineMeasuredRailDots] =
    useState<TimelineRailDotState[] | null>(null)
  const [timelineMeasuredChildTargets, setTimelineMeasuredChildTargets] =
    useState<TimelineChildTargetMeasurement[] | null>(null)
  const [expandedTimelineEntryIds, setExpandedTimelineEntryIds] = useState<Set<string>>(
    () => new Set(),
  )
  const timelineRailRef = useRef<HTMLButtonElement | null>(null)
  const timelineListRef = useRef<HTMLOListElement | null>(null)
  const suppressNextTimelineRailClickRef = useRef(false)
  const activeStack: EditHistoryReaderStackKey = activeTab === 'redo' ? 'redo' : 'undo'
  const isTimelineTab = activeTab === 'timeline'
  const isSketchDrawTab = activeTab === 'sketchDraw'
  const activeEntries = isTimelineTab ? model.timeline.entries : model[activeStack].entries
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
  const filteredTimelineEntries = filteredEntries as EditHistoryReaderTimelineEntryModel[]
  const displayedTimelineMarkerIndex =
    timelineScrubPreview?.previewMarkerIndex ?? model.timeline.markerIndex
  const appliedTimelineEntries = isTimelineTab
    ? filteredTimelineEntries.filter((entry) =>
      timelineScrubPreview === null
        ? entry.side === 'applied'
        : entry.timelineIndex < displayedTimelineMarkerIndex,
    )
    : []
  const redoableTimelineEntries = isTimelineTab
    ? filteredTimelineEntries.filter((entry) =>
      timelineScrubPreview === null
        ? entry.side === 'redoable'
        : entry.timelineIndex >= displayedTimelineMarkerIndex,
    )
    : []
  const showPendingSketchDrawEntry =
    !isSketchDrawTab && activeStack === 'undo' && hasPendingSketchDrawHistory
  const selectedEntry =
    isSketchDrawTab
      ? null
      : filteredEntries.find((entry) => entry.entryId === selectedEntryId) ?? filteredEntries[0] ?? null
  const selectedTimelineEntry =
    isTimelineTab && selectedEntryId !== timelineMarkerSelectionId
      ? filteredTimelineEntries.find((entry) => entry.entryId === selectedEntryId) ?? null
      : null
  const selectedChildParentEntry =
    isTimelineTab && selectedChildTarget !== null
      ? filteredTimelineEntries.find((entry) => entry.entryId === selectedChildTarget.entryId) ?? null
      : null
  const selectedChildSummary =
    selectedChildParentEntry?.childSummaries.find(
      (summary) => summary.childId === selectedChildTarget?.childId,
    ) ?? null
  const isTimelineMarkerSelected = isTimelineTab && selectedEntryId === timelineMarkerSelectionId
  const emptyStateMessage =
    activeEntries.length === 0
      ? `No ${model[activeStack].label.toLowerCase()} entries`
      : `No ${model[activeStack].label.toLowerCase()} entries for this source`
  const timelineRenderedSlotCount = model.timeline.entries.length + 1
  const fallbackTimelineMarkerPercent =
    ((model.timeline.entries.length - displayedTimelineMarkerIndex + 0.5) / timelineRenderedSlotCount) * 100
  const timelineMarkerPercent =
    timelineScrubPreview?.dragPercent ??
    (
      selectedChildTarget === null
        ? timelineMeasuredMarkerPercent
        : timelineMeasuredChildTargets?.find(
          (target) =>
            target.entryId === selectedChildTarget.entryId &&
            target.childId === selectedChildTarget.childId,
        )?.percent ?? timelineMeasuredMarkerPercent
    ) ??
    fallbackTimelineMarkerPercent
  const fallbackTimelineRailDots = isTimelineTab
    ? filteredTimelineEntries.map((entry) => ({
      entryId: entry.entryId,
      percent: ((model.timeline.entries.length - entry.timelineIndex - 0.5) / timelineRenderedSlotCount) * 100,
    }))
    : []
  const timelineRailDots = timelineMeasuredRailDots ?? fallbackTimelineRailDots
  const displayedAppliedTimelineEntries = sortTimelineEntriesNewestFirst(appliedTimelineEntries)
  const displayedRedoableTimelineEntries = sortTimelineEntriesNewestFirst(redoableTimelineEntries)
  const renderDisplayedTimelineSideLabel = (
    entry: EditHistoryReaderTimelineEntryModel,
  ): string => {
    if (timelineScrubPreview === null) {
      return renderTimelineSideLabel(entry)
    }

    return entry.timelineIndex < displayedTimelineMarkerIndex ? 'Applied' : 'Redoable'
  }
  useLayoutEffect(() => {
    if (selectedChildTarget === null) {
      return
    }

    if (!isTimelineTab) {
      clearGeometrySketchHistoryScrub()
      setSelectedChildTarget(null)
      return
    }

    const parentEntry = filteredTimelineEntries.find(
      (entry) => entry.entryId === selectedChildTarget.entryId,
    )
    if (
      parentEntry === undefined ||
      parentEntry.timelineIndex + 1 !== model.timeline.markerIndex
    ) {
      clearGeometrySketchHistoryScrub()
      setSelectedChildTarget(null)
    }
  }, [
    clearGeometrySketchHistoryScrub,
    filteredTimelineEntries,
    isTimelineTab,
    model.timeline.markerIndex,
    selectedChildTarget,
  ])
  const toggleTimelineEntryExpansion = (
    event: MouseEvent<HTMLButtonElement>,
    entryId: string,
  ): void => {
    event.preventDefault()
    event.stopPropagation()
    clearGeometrySketchHistoryScrub()
    setSelectedChildTarget(null)
    setExpandedTimelineEntryIds((currentEntryIds) => {
      const nextEntryIds = new Set(currentEntryIds)
      if (nextEntryIds.has(entryId)) {
        nextEntryIds.delete(entryId)
      } else {
        nextEntryIds.add(entryId)
      }
      return nextEntryIds
    })
  }
  const jumpToTimelineChildTarget = (
    entry: EditHistoryReaderTimelineEntryModel,
    child: Pick<EditHistoryReaderChildSummaryModel, 'childId' | 'label' | 'sequence'>,
  ) => {
    jumpToTimelineMarkerIndex(entry.timelineIndex + 1)
    const restoredEntry = editHistoryStore.restoreChild(entry.entryId, child.childId)
    const nodeId = resolveSketchDrawHistoryScrubNodeId(entry)
    if (restoredEntry !== null && nodeId !== null) {
      openGeometrySketchHistoryScrub({
        parentEntryId: entry.entryId,
        childId: child.childId,
        graphDocumentId: activeGraphDocumentId,
        nodeId,
        childLabel: child.label,
        childSequence: child.sequence,
      })
    } else {
      clearGeometrySketchHistoryScrub()
    }
    setSelectedEntryId(null)
    setSelectedChildTarget({
      entryId: entry.entryId,
      childId: child.childId,
      restored: restoredEntry !== null,
    })
  }
  const renderTimelineEntryCard = (entry: EditHistoryReaderTimelineEntryModel) => {
    const isExpandable = isTimelineGroupExpandable(entry)
    const isExpanded = expandedTimelineEntryIds.has(entry.entryId)
    const sideClassName =
      entry.side === 'applied'
        ? 'EditHistoryReaderTimelineEntryCard--applied'
        : 'EditHistoryReaderTimelineEntryCard--redoable'

    return (
      <div
        data-timeline-rail-entry-id={entry.entryId}
        className={[
          'EditHistoryReaderTimelineEntryCard',
          sideClassName,
          selectedTimelineEntry?.entryId === entry.entryId ? 'isSelected' : '',
          isExpanded ? 'isExpanded' : '',
        ].filter(Boolean).join(' ')}
      >
        {isExpandable ? (
          <button
            type="button"
            className="EditHistoryReaderTimelineExpandButton"
            aria-expanded={isExpanded}
            aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${entry.label}`}
            onClick={(event) => toggleTimelineEntryExpansion(event, entry.entryId)}
          >
            <span aria-hidden="true" />
          </button>
        ) : null}
        <button
          type="button"
          className={[
            'EditHistoryReaderTimelineEntryMain',
            isExpandable ? 'EditHistoryReaderTimelineEntryMain--withExpandControl' : '',
          ].filter(Boolean).join(' ')}
          onClick={() => jumpToTimelineMarkerIndex(
            resolveTimelineEntryTargetMarkerIndex(entry),
          )}
        >
          <strong>{renderTimelineEntryNumberedLabel(entry)}</strong>
          <span>{resolveEntrySummary(entry)}</span>
          <span>{renderDisplayedTimelineSideLabel(entry)}</span>
          <time>{renderMetadataValue(entry.timestamp)}</time>
        </button>
        {isExpandable && isExpanded ? (
          <div className="EditHistoryReaderTimelineChildList" aria-label={`${entry.label} details`}>
            {entry.childSummaries.length === 0 ? (
              <div className="EditHistoryReaderTimelineChildCard">
                <span>No committed command details available</span>
              </div>
            ) : (
              entry.childSummaries.map((summary) => (
                <button
                  key={summary.childId}
                  type="button"
                  className={[
                    'EditHistoryReaderTimelineChildCard',
                    selectedChildTarget?.entryId === entry.entryId &&
                    selectedChildTarget.childId === summary.childId
                      ? 'isSelected'
                      : '',
                    timelineScrubPreview?.previewChildTarget?.entryId === entry.entryId &&
                    timelineScrubPreview.previewChildTarget.childId === summary.childId
                      ? 'isPreviewTarget'
                      : '',
                  ].filter(Boolean).join(' ')}
                  data-timeline-rail-child-entry-id={entry.entryId}
                  data-timeline-rail-child-id={summary.childId}
                  onClick={() => jumpToTimelineChildTarget(entry, summary)}
                >
                  <strong>{`#${summary.sequence} ${summary.label}`}</strong>
                  <span>{summary.kind ?? 'Command'}</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    )
  }

  useLayoutEffect(() => {
    if (!isTimelineTab || timelineListRef.current === null) {
      setTimelineRailHeight(null)
      return undefined
    }

    const timelineListElement = timelineListRef.current
    const updateTimelineRailHeight = () => {
      const listRect = timelineListElement.getBoundingClientRect()
      const measuredHeight = timelineListElement.scrollHeight > 0
        ? timelineListElement.scrollHeight
        : listRect.height
      const nextRailHeight = measuredHeight > 0 ? measuredHeight : null
      setTimelineRailHeight(nextRailHeight)

      if (nextRailHeight === null) {
        setTimelineMeasuredMarkerPercent(null)
        setTimelineMeasuredRailDots(null)
        setTimelineMeasuredChildTargets(null)
        return
      }

      const markerElement = timelineListElement.querySelector('[data-timeline-rail-marker="true"]')
      const nextMarkerPercent =
        markerElement === null
          ? null
          : resolveElementCenterPercent(listRect, measuredHeight, markerElement)
      setTimelineMeasuredMarkerPercent(nextMarkerPercent)

      const nextRailDots = Array.from(
        timelineListElement.querySelectorAll('[data-timeline-rail-entry-id]'),
      ).flatMap((element) => {
        const entryId = element.getAttribute('data-timeline-rail-entry-id')
        const percent = resolveElementCenterPercent(listRect, measuredHeight, element)
        return entryId === null || percent === null ? [] : [{ entryId, percent }]
      })
      setTimelineMeasuredRailDots((currentRailDots) =>
        currentRailDots !== null && areTimelineRailDotsEqual(currentRailDots, nextRailDots)
          ? currentRailDots
          : nextRailDots,
      )

      const nextChildTargets = Array.from(
        timelineListElement.querySelectorAll('[data-timeline-rail-child-id]'),
      ).flatMap((element) => {
        const entryId = element.getAttribute('data-timeline-rail-child-entry-id')
        const childId = element.getAttribute('data-timeline-rail-child-id')
        const percent = resolveElementCenterPercent(listRect, measuredHeight, element)
        return entryId === null || childId === null || percent === null
          ? []
          : [{ entryId, childId, percent }]
      })
      setTimelineMeasuredChildTargets((currentTargets) =>
        currentTargets !== null &&
        areTimelineChildTargetMeasurementsEqual(currentTargets, nextChildTargets)
          ? currentTargets
          : nextChildTargets,
      )
    }

    updateTimelineRailHeight()

    if (typeof ResizeObserver === 'undefined') {
      return undefined
    }

    const resizeObserver = new ResizeObserver(updateTimelineRailHeight)
    resizeObserver.observe(timelineListElement)
    return () => resizeObserver.disconnect()
  }, [
    isTimelineTab,
    filteredTimelineEntries.length,
    expandedTimelineEntryIds,
    model.timeline.markerIndex,
    displayedTimelineMarkerIndex,
  ])

  const jumpToTimelineMarkerIndex = (targetMarkerIndex: number) => {
    clearGeometrySketchHistoryScrub()
    const clampedTargetMarkerIndex = Math.max(
      0,
      Math.min(targetMarkerIndex, model.timeline.entries.length),
    )
    const delta = clampedTargetMarkerIndex - model.timeline.markerIndex
    const stepCount = Math.abs(delta)
    for (let index = 0; index < stepCount; index += 1) {
      const movedEntry = delta < 0 ? editHistoryStore.undo() : editHistoryStore.redo()
      if (movedEntry === null) {
        break
      }
    }
    setSelectedEntryId(timelineMarkerSelectionId)
    setSelectedChildTarget(null)
  }
  const handleTimelineRailClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (suppressNextTimelineRailClickRef.current) {
      suppressNextTimelineRailClickRef.current = false
      return
    }

    if (model.timeline.entries.length === 0) {
      setSelectedEntryId(timelineMarkerSelectionId)
      return
    }

    const targetMarkerIndex = resolveTimelineRailTargetMarkerIndex(
      event.currentTarget.getBoundingClientRect(),
      event.clientY,
      model.timeline.entries.length,
    )
    jumpToTimelineMarkerIndex(targetMarkerIndex)
  }
  const releaseTimelineScrubPointerCapture = (
    target: EventTarget & HTMLElement,
    pointerId: number,
  ) => {
    if (
      typeof target.hasPointerCapture === 'function' &&
      typeof target.releasePointerCapture === 'function' &&
      target.hasPointerCapture(pointerId)
    ) {
      target.releasePointerCapture(pointerId)
    }
  }
  const resolveTimelineScrubPreviewState = (
    pointerId: number,
    clientY: number,
  ): TimelineScrubPreviewState => {
    const railElement = timelineRailRef.current
    if (railElement === null) {
      return {
        pointerId,
        previewMarkerIndex: model.timeline.markerIndex,
        dragPercent: timelineMarkerPercent,
        previewChildTarget: null,
      }
    }

    const railRect = railElement.getBoundingClientRect()
    const dragPercent = resolveTimelineRailDragPercent(railRect, clientY)
    const liveChildTargets = (() => {
      const timelineListElement = timelineListRef.current
      if (timelineListElement === null) {
        return timelineMeasuredChildTargets ?? []
      }

      const listRect = timelineListElement.getBoundingClientRect()
      const measuredHeight = timelineListElement.scrollHeight > 0
        ? timelineListElement.scrollHeight
        : listRect.height
      return Array.from(
        timelineListElement.querySelectorAll('[data-timeline-rail-child-id]'),
      ).flatMap((element) => {
        const entryId = element.getAttribute('data-timeline-rail-child-entry-id')
        const childId = element.getAttribute('data-timeline-rail-child-id')
        const percent = resolveElementCenterPercent(listRect, measuredHeight, element)
        return entryId === null || childId === null || percent === null
          ? []
          : [{ entryId, childId, percent }]
      })
    })()
    const nearestChildTarget =
      liveChildTargets.reduce<TimelineChildTargetMeasurement | null>(
        (nearestTarget, target) => {
          const targetDistance = Math.abs(target.percent - dragPercent)
          const nearestDistance =
            nearestTarget === null ? Number.POSITIVE_INFINITY : Math.abs(nearestTarget.percent - dragPercent)
          return targetDistance < nearestDistance ? target : nearestTarget
        },
        null,
      )
    const previewChildTarget =
      nearestChildTarget !== null &&
      Math.abs(nearestChildTarget.percent - dragPercent) <= timelineChildPreviewSnapThresholdPercent
        ? nearestChildTarget
        : null
    return {
      pointerId,
      previewMarkerIndex: previewChildTarget === null
        ? resolveTimelineRailTargetMarkerIndex(
        railRect,
        clientY,
        model.timeline.entries.length,
        )
        : (filteredTimelineEntries.find((entry) => entry.entryId === previewChildTarget.entryId)
          ?.timelineIndex ?? model.timeline.markerIndex) + 1,
      dragPercent,
      previewChildTarget: previewChildTarget === null
        ? null
        : {
          entryId: previewChildTarget.entryId,
          childId: previewChildTarget.childId,
          restored: false,
        },
    }
  }
  const handleTimelineScrubPointerDown = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setSelectedEntryId(timelineMarkerSelectionId)
    setSelectedChildTarget(null)

    if (model.timeline.entries.length === 0) {
      return
    }

    if (typeof event.currentTarget.setPointerCapture === 'function') {
      event.currentTarget.setPointerCapture(event.pointerId)
    }

    setTimelineScrubPreview(resolveTimelineScrubPreviewState(event.pointerId, event.clientY))
  }
  const handleTimelineScrubPointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (timelineScrubPreview?.pointerId !== event.pointerId) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    setTimelineScrubPreview(resolveTimelineScrubPreviewState(event.pointerId, event.clientY))
  }
  const handleTimelineScrubPointerUp = (event: PointerEvent<HTMLButtonElement>) => {
    if (timelineScrubPreview?.pointerId !== event.pointerId) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    suppressNextTimelineRailClickRef.current = true
    releaseTimelineScrubPointerCapture(event.currentTarget, event.pointerId)

    const nextPreviewState = resolveTimelineScrubPreviewState(
      event.pointerId,
      event.clientY,
    )
    setTimelineScrubPreview(null)
    jumpToTimelineMarkerIndex(nextPreviewState.previewMarkerIndex)
    if (nextPreviewState.previewChildTarget !== null) {
      const restoredEntry = editHistoryStore.restoreChild(
        nextPreviewState.previewChildTarget.entryId,
        nextPreviewState.previewChildTarget.childId,
      )
      const parentEntry = filteredTimelineEntries.find(
        (entry) => entry.entryId === nextPreviewState.previewChildTarget?.entryId,
      )
      const childSummary = parentEntry?.childSummaries.find(
        (summary) => summary.childId === nextPreviewState.previewChildTarget?.childId,
      ) ?? null
      const nodeId =
        parentEntry === undefined ? null : resolveSketchDrawHistoryScrubNodeId(parentEntry)
      if (restoredEntry !== null && parentEntry !== undefined && childSummary !== null && nodeId !== null) {
        openGeometrySketchHistoryScrub({
          parentEntryId: parentEntry.entryId,
          childId: childSummary.childId,
          graphDocumentId: activeGraphDocumentId,
          nodeId,
          childLabel: childSummary.label,
          childSequence: childSummary.sequence,
        })
      } else {
        clearGeometrySketchHistoryScrub()
      }
      setSelectedEntryId(null)
      setSelectedChildTarget({
        ...nextPreviewState.previewChildTarget,
        restored: restoredEntry !== null,
      })
    }
  }
  const handleTimelineScrubPointerCancel = (event: PointerEvent<HTMLButtonElement>) => {
    if (timelineScrubPreview?.pointerId !== event.pointerId) {
      return
    }

    event.preventDefault()
    event.stopPropagation()
    suppressNextTimelineRailClickRef.current = true
    releaseTimelineScrubPointerCapture(event.currentTarget, event.pointerId)
    setTimelineScrubPreview(null)
    setSelectedEntryId(timelineMarkerSelectionId)
    setSelectedChildTarget(null)
  }

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
              onClick={() => {
                clearGeometrySketchHistoryScrub()
                editHistoryStore.undo()
              }}
              disabled={!model.canUndo}
            >
              Undo
            </button>
            <button
              type="button"
              onClick={() => {
                clearGeometrySketchHistoryScrub()
                editHistoryStore.redo()
              }}
              disabled={!model.canRedo}
            >
              Redo
            </button>
          </div>
        </header>

        <div className="EditHistoryReaderStackTabs" role="tablist" aria-label="History stack">
          {(['timeline', 'undo', 'redo', 'sketchDraw'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              className={activeTab === tab ? 'isActive' : undefined}
              onClick={() => {
                clearGeometrySketchHistoryScrub()
                setActiveTab(tab)
                setActiveSourceFilter(allSourceFilter)
                setSelectedEntryId(null)
                setSelectedChildTarget(null)
              }}
            >
              {renderHistoryTabLabel(
                tab,
                model.undo.entries.length,
                model.redo.entries.length,
                model.timeline.entries.length,
                sketchDrawEntries.length,
              )}
            </button>
          ))}
        </div>

        {!isSketchDrawTab && sourceFilterChoices.length > 1 ? (
          <div className="EditHistoryReaderStackTabs" aria-label="History source filter">
            <button
              type="button"
              aria-pressed={effectiveSourceFilter === allSourceFilter}
              className={effectiveSourceFilter === allSourceFilter ? 'isActive' : undefined}
              onClick={() => {
                clearGeometrySketchHistoryScrub()
                setActiveSourceFilter(allSourceFilter)
                setSelectedEntryId(null)
                setSelectedChildTarget(null)
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
                  clearGeometrySketchHistoryScrub()
                  setActiveSourceFilter(choice.sourceSurface)
                  setSelectedEntryId(null)
                  setSelectedChildTarget(null)
                }}
              >
                {`${choice.label} (${choice.count})`}
              </button>
            ))}
          </div>
        ) : null}

        <div className="EditHistoryReaderSurfaceBody">
          {isSketchDrawTab ? (
            <ol className="EditHistoryReaderEntryList" aria-label="Sketch Draw local history">
              {sketchDrawEntries.length === 0 ? (
                <li className="EditHistoryReaderEmptyState">
                  No active sketch draw history
                </li>
              ) : (
                sketchDrawEntries.map((entry) => (
                  <li key={entry.commandId}>
                    <button type="button" className="isSelected">
                      <strong>{`#${entry.sequence} ${entry.label}`}</strong>
                      <span>{entry.kind === 'geometry' ? 'Local geometry command' : 'Local tool command'}</span>
                      <span>Not committed yet</span>
                    </button>
                  </li>
                ))
              )}
            </ol>
          ) : isTimelineTab ? (
            <div
              className={[
                'EditHistoryReaderTimelineScrub',
                timelineScrubPreview !== null ? 'isScrubbing' : '',
              ].filter(Boolean).join(' ')}
              data-preview-marker-index={timelineScrubPreview?.previewMarkerIndex}
            >
              <button
                ref={timelineRailRef}
                type="button"
                className="EditHistoryReaderTimelineRail"
                aria-label="Timeline scrub rail"
                style={timelineRailHeight === null ? undefined : { height: `${timelineRailHeight}px` }}
                onClick={handleTimelineRailClick}
                onPointerDown={handleTimelineScrubPointerDown}
                onPointerMove={handleTimelineScrubPointerMove}
                onPointerUp={handleTimelineScrubPointerUp}
                onPointerCancel={handleTimelineScrubPointerCancel}
              >
                {timelineRailDots.map((dot) => (
                  <span
                    key={dot.entryId}
                    className="EditHistoryReaderTimelineRailDot"
                    style={{ top: `${dot.percent}%` }}
                    aria-hidden="true"
                  />
                ))}
                <span
                  className="EditHistoryReaderTimelineRailHandle"
                  style={{ top: `${timelineMarkerPercent}%` }}
                  aria-hidden="true"
                />
              </button>
              <ol
                ref={timelineListRef}
                className="EditHistoryReaderEntryList EditHistoryReaderTimelineList"
                aria-label="Timeline history"
              >
                {displayedRedoableTimelineEntries.map((entry) => (
                  <li key={entry.entryId}>
                    {renderTimelineEntryCard(entry)}
                  </li>
                ))}
                <li>
                  <button
                    type="button"
                    data-timeline-rail-marker="true"
                    className={[
                      'EditHistoryReaderTimelineMarker',
                      'EditHistoryReaderTimelineMarker--compact',
                      isTimelineMarkerSelected || selectedEntryId === null ? 'isSelected' : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => setSelectedEntryId(timelineMarkerSelectionId)}
                    onPointerDown={handleTimelineScrubPointerDown}
                    onPointerMove={handleTimelineScrubPointerMove}
                    onPointerUp={handleTimelineScrubPointerUp}
                    onPointerCancel={handleTimelineScrubPointerCancel}
                  >
                    <span className="EditHistoryReaderTimelineMarkerGrip" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </span>
                    <strong>Current position</strong>
                    <span className="EditHistoryReaderTimelineMarkerIndex">
                      {`Marker index ${model.timeline.markerIndex}`}
                    </span>
                  </button>
                </li>
                {displayedAppliedTimelineEntries.map((entry) => (
                  <li key={entry.entryId}>
                    {renderTimelineEntryCard(entry)}
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <ol className="EditHistoryReaderEntryList" aria-label={`${model[activeStack].label} stack`}>
              {showPendingSketchDrawEntry ? (
                <li>
                  <button
                    type="button"
                    className="EditHistoryReaderPendingEntry"
                  onClick={() => {
                      clearGeometrySketchHistoryScrub()
                      setActiveTab('sketchDraw')
                      setActiveSourceFilter(allSourceFilter)
                      setSelectedEntryId(null)
                      setSelectedChildTarget(null)
                    }}
                  >
                    <strong>Sketch Draw changes</strong>
                    <span>Sketch Draw to Active draft</span>
                    <span>Not committed yet</span>
                  </button>
                </li>
              ) : null}
              {filteredEntries.length === 0 && !showPendingSketchDrawEntry ? (
                <li className="EditHistoryReaderEmptyState">
                  {emptyStateMessage}
                </li>
              ) : (
                filteredEntries.map((entry) => (
                  <li key={entry.entryId}>
                    <button
                      type="button"
                      className={selectedEntry?.entryId === entry.entryId ? 'isSelected' : undefined}
                      onClick={() => {
                        clearGeometrySketchHistoryScrub()
                        setSelectedEntryId(entry.entryId)
                      }}
                    >
                      <strong>{entry.label}</strong>
                      <span>{resolveEntrySummary(entry)}</span>
                      <time>{renderMetadataValue(entry.timestamp)}</time>
                    </button>
                  </li>
                ))
              )}
            </ol>
          )}

          <aside className="EditHistoryReaderInspector" aria-label="History entry details">
            {isSketchDrawTab ? (
              <>
                <h3>Sketch Draw local history</h3>
                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>{hasPendingSketchDrawHistory ? 'Not committed yet' : 'No active local commands'}</dd>
                  </div>
                  <div>
                    <dt>Node ID</dt>
                    <dd>{renderMetadataValue(geometrySketchSession?.nodeId ?? null)}</dd>
                  </div>
                  <div>
                    <dt>Local undo commands</dt>
                    <dd>{sketchDrawEntries.length}</dd>
                  </div>
                  <div>
                    <dt>Local redo commands</dt>
                    <dd>{geometrySketchSession?.sessionRedoCommands.length ?? 0}</dd>
                  </div>
                </dl>
              </>
            ) : selectedChildParentEntry !== null && selectedChildSummary !== null ? (
              <>
                <h3>{selectedChildSummary.label}</h3>
                <dl>
                  <div>
                    <dt>Status</dt>
                    <dd>
                      {geometrySketchHistoryScrub !== null &&
                      geometrySketchHistoryScrub.parentEntryId === selectedChildParentEntry.entryId &&
                      geometrySketchHistoryScrub.childId === selectedChildSummary.childId
                        ? 'Sketch Draw history scrub'
                        : selectedChildTarget?.restored === true
                        ? 'Restored child marker'
                        : 'Read only child marker'}
                    </dd>
                  </div>
                  <div>
                    <dt>Parent entry</dt>
                    <dd>{selectedChildParentEntry.label}</dd>
                  </div>
                  <div>
                    <dt>Child sequence</dt>
                    <dd>{selectedChildSummary.sequence}</dd>
                  </div>
                  <div>
                    <dt>Child kind</dt>
                    <dd>{selectedChildSummary.kind ?? 'Command'}</dd>
                  </div>
                  <div>
                    <dt>Canonical marker index</dt>
                    <dd>{model.timeline.markerIndex}</dd>
                  </div>
                </dl>
              </>
            ) : isTimelineMarkerSelected || (isTimelineTab && selectedEntryId === null) ? (
              <>
                <h3>Current position</h3>
                <dl>
                  <div>
                    <dt>Marker index</dt>
                    <dd>{model.timeline.markerIndex}</dd>
                  </div>
                  <div>
                    <dt>Applied entries</dt>
                    <dd>{model.timeline.appliedCount}</dd>
                  </div>
                  <div>
                    <dt>Redoable entries</dt>
                    <dd>{model.timeline.redoableCount}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>Read only marker</dd>
                  </div>
                </dl>
              </>
            ) : selectedEntry === null ? (
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
            <section className="EditHistoryReaderSnapshotLog" aria-label="Diagnostic activity log">
              <h3>Diagnostic activity</h3>
              {model.snapshotLog.length === 0 ? (
                <p className="EditHistoryReaderEmptyState">No diagnostic activity recorded</p>
              ) : (
                <ol>
                  {model.snapshotLog.map((entry) => (
                    <li key={entry.logId}>
                      <strong>{`#${entry.sequence} ${renderSnapshotLogAction(entry)}: ${entry.label}`}</strong>
                      <span>{resolveEntrySummary(entry)}</span>
                      <time>{entry.timestamp}</time>
                      <span>{`Undo ${entry.undoDepth} / Redo ${entry.redoDepth}`}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          </aside>
        </div>
      </div>
    </section>
  )
}
