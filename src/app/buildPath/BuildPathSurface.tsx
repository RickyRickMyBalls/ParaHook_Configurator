import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  deriveBuildPathBranchProjection,
  type BuildPathBranchEventClassification,
  type BuildPathBranchProjection,
  type BuildPathMasterTimeline,
  type BuildPathTimelineStep,
  isBuildPathBuildEventTimelineStep,
} from './buildPathTimeline'
import {
  deriveBuildPathActionBoundaryRead,
  type BuildPathActionBoundaryRead,
} from './buildPathActions'
import { readBuildPathRuntimeMasterTimeline } from './buildPathRuntime'
import { useBuildPathRuntimeStore } from './useBuildPathRuntimeStore'

export type BuildPathSurfaceHostMode = 'viewport-dock' | 'workspace'
export type BuildPathViewportDockPlacement = 'top' | 'bottom'

type BuildPathTimelineStripProps = {
  timeline: BuildPathMasterTimeline
  hostMode: BuildPathSurfaceHostMode
  selectedTimelineStepId?: string | null
  onSelectTimelineStep?: (timelineStepId: string) => void
}

type BuildPathSurfaceProps = {
  surfaceInstanceId?: string
  hostMode?: BuildPathSurfaceHostMode
  timeline?: BuildPathMasterTimeline
}

type BuildPathViewportDockProps = {
  placement?: BuildPathViewportDockPlacement
  timeline?: BuildPathMasterTimeline
}

const readNearestBuildPathTimelineStepIdFromPointer = ({
  clientX,
  railElement,
  timeline,
}: {
  clientX: number
  railElement: HTMLElement | null
  timeline: BuildPathMasterTimeline
}): string | null => {
  if (railElement === null || timeline.steps.length === 0) {
    return null
  }

  const stepButtons = Array.from(
    railElement.querySelectorAll<HTMLElement>('[data-build-path-step-id]'),
  )

  if (stepButtons.length === 0) {
    return null
  }

  let nearestStepId: string | null = stepButtons[0]?.dataset.buildPathStepId ?? null
  let nearestDistance = Number.POSITIVE_INFINITY

  for (const stepButton of stepButtons) {
    const rect = stepButton.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const distance = Math.abs(clientX - centerX)

    if (distance < nearestDistance) {
      nearestDistance = distance
      nearestStepId = stepButton.dataset.buildPathStepId ?? null
    }
  }

  return nearestStepId
}

function BuildPathStepIcon({ step }: { step: BuildPathTimelineStep }) {
  if (step.display.icon === 'graph-created') {
    return (
      <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4.5 5.5h11v9h-11v-9Z" />
        <path d="M7 8.5h6" />
        <path d="M10 11.5v-6" />
      </svg>
    )
  }

  if (step.display.icon === 'graph-loaded') {
    return (
      <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4.5 5.5h11v9h-11v-9Z" />
        <path d="M7 10.5h6" />
        <path d="m8.5 8 1.5-1.5L11.5 8" />
        <path d="M10 6.5v6" />
      </svg>
    )
  }

  if (step.display.icon === 'extrude') {
    return (
      <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 7.5 10 5l5 2.5v5L10 15l-5-2.5v-5Z" />
        <path d="M5 7.5 10 10l5-2.5" />
        <path d="M10 10v5" />
      </svg>
    )
  }

  return (
    <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M5 14.5h10" />
      <path d="M6 13.5 13.5 6l1.5 1.5L7.5 15H6v-1.5Z" />
    </svg>
  )
}

const formatBuildResultState = (step: BuildPathTimelineStep): string => {
  if (!isBuildPathBuildEventTimelineStep(step)) {
    return 'structural'
  }

  const state = step.event.buildResultState

  if (state.kind === 'linked') {
    return `Linked result ${state.buildResultId}`
  }

  return state.kind
}

function BuildPathSelectedEventReadback({
  actionBoundaryRead,
  step,
}: {
  actionBoundaryRead?: BuildPathActionBoundaryRead
  step: BuildPathTimelineStep | null
}) {
  if (step === null) {
    return (
      <div className="BuildPathSelectedEventReadback" data-build-path-readback-state="empty">
        <span className="BuildPathReadbackMuted">No selected build step</span>
      </div>
    )
  }

  return (
    <div
      className="BuildPathSelectedEventReadback"
      data-build-path-readback-state="selected"
      data-build-path-selected-step-id={step.timelineStepId}
    >
      <div className="BuildPathReadbackPrimary">
        <span className="BuildPathReadbackFamily">{step.display.label}</span>
        <span className="BuildPathReadbackIndex">{`#${step.orderIndex + 1}`}</span>
      </div>
      {isBuildPathBuildEventTimelineStep(step) ? (
        <dl className="BuildPathReadbackGrid">
          <div>
            <dt>Graph</dt>
            <dd>{step.eventReference.graphDocumentId}</dd>
          </div>
          <div>
            <dt>Nodes</dt>
            <dd>{step.event.affectedNodeIds.length}</dd>
          </div>
          <div>
            <dt>Edges</dt>
            <dd>{step.event.affectedEdgeIds.length}</dd>
          </div>
          <div>
            <dt>Outputs</dt>
            <dd>{step.event.affectedOutputIds.length}</dd>
          </div>
          <div>
            <dt>Result</dt>
            <dd>{formatBuildResultState(step)}</dd>
          </div>
        </dl>
      ) : (
        <dl className="BuildPathReadbackGrid">
          <div>
            <dt>Graph</dt>
            <dd>{step.lifecycleCard.graphLabel}</dd>
          </div>
          <div>
            <dt>Kind</dt>
            <dd>Lifecycle</dd>
          </div>
          <div>
            <dt>Geometry</dt>
            <dd>None</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{step.lifecycleCard.sourceKind}</dd>
          </div>
        </dl>
      )}
      {actionBoundaryRead !== undefined ? (
        <BuildPathActionBoundaryPanel actionBoundaryRead={actionBoundaryRead} />
      ) : null}
    </div>
  )
}

function BuildPathActionBoundaryPanel({
  actionBoundaryRead,
}: {
  actionBoundaryRead: BuildPathActionBoundaryRead
}) {
  const readiness = actionBoundaryRead.checkpointReadiness

  return (
    <div
      className="BuildPathActionBoundaryPanel"
      data-build-path-action-boundary-state={readiness.status}
      data-build-path-restore-ready={readiness.isRestoreReady ? 'true' : 'false'}
    >
      <div className="BuildPathActionBoundarySummary">
        <span>Actions</span>
        <span>
          {readiness.isCheckpointCandidate
            ? 'Checkpoint candidate'
            : 'Read-only checkpoint'}
        </span>
      </div>
      <div className="BuildPathActionBoundaryReason">
        {readiness.missingRequirements[0]}
      </div>
      <div className="BuildPathActionButtonRow" aria-label="Planned Build Path actions">
        {actionBoundaryRead.actions.map((action) => (
          <button
            key={action.actionKind}
            type="button"
            className="BuildPathActionButton"
            disabled
            aria-disabled="true"
            data-build-path-action-kind={action.actionKind}
            data-build-path-restore-status={action.restoreReadiness?.status}
            data-build-path-restore-can-execute={
              action.restoreReadiness?.canExecuteRestore ? 'true' : 'false'
            }
            data-build-path-branch-status={action.branchFromHereReadiness?.status}
            data-build-path-branch-can-create={
              action.branchFromHereReadiness?.canCreateBranch ? 'true' : 'false'
            }
            data-build-path-branch-destination={
              action.branchFromHereReadiness?.destinationKind
            }
            data-build-path-compare-status={action.compareReadiness?.status}
            data-build-path-compare-can-run={
              action.compareReadiness?.canCompare ? 'true' : 'false'
            }
            data-build-path-pin-status={action.pinCheckpointReadiness?.status}
            data-build-path-pin-can-persist={
              action.pinCheckpointReadiness?.canPersistPin ? 'true' : 'false'
            }
            data-build-path-checkpoint-can-persist={
              action.pinCheckpointReadiness?.canPersistCheckpoint ? 'true' : 'false'
            }
            data-build-path-action-triggered-by-scrub={
              action.boundary.isTriggeredByScrub ? 'true' : 'false'
            }
            title={action.reason}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function BuildPathWorkspaceModeSwitch({
  isParallelModeEnabled,
  onSetParallelModeEnabled,
}: {
  isParallelModeEnabled: boolean
  onSetParallelModeEnabled: (isEnabled: boolean) => void
}) {
  return (
    <div className="BuildPathWorkspaceModeSwitch" aria-label="Build Path view mode">
      <button
        type="button"
        className={`BuildPathWorkspaceModeButton ${isParallelModeEnabled ? '' : 'isSelected'}`}
        aria-pressed={!isParallelModeEnabled}
        onClick={() => onSetParallelModeEnabled(false)}
      >
        Master
      </button>
      <button
        type="button"
        className={`BuildPathWorkspaceModeButton ${isParallelModeEnabled ? 'isSelected' : ''}`}
        aria-pressed={isParallelModeEnabled}
        onClick={() => onSetParallelModeEnabled(true)}
      >
        Parallel
      </button>
    </div>
  )
}

function BuildPathParallelModeRead({
  branchProjection,
  hasDependencyHints,
  onSelectBranchTimelineStep,
  selectedBranchTimelineStepIdByLaneId,
  timeline,
  timelineStepById,
}: {
  branchProjection: BuildPathBranchProjection
  hasDependencyHints: boolean
  onSelectBranchTimelineStep: (branchLaneId: string, timelineStepId: string) => void
  selectedBranchTimelineStepIdByLaneId: Record<string, string>
  timeline: BuildPathMasterTimeline
  timelineStepById: Map<string, BuildPathTimelineStep>
}) {
  const status =
    timeline.steps.length === 0
      ? 'empty'
      : timeline.steps.length === 1
        ? 'single-step'
        : !hasDependencyHints || branchProjection.lanes.length === 0
          ? 'dependency-hints-unavailable'
          : 'ready'
  const classificationByStepId = new Map(
    branchProjection.eventClassifications.map((classification) => [
      classification.timelineStepId,
      classification,
    ]),
  )

  return (
    <section
      className="BuildPathParallelModeRead"
      data-build-path-parallel-state={status}
    >
      <div className="BuildPathParallelModeHeader">
        <span>Parallel</span>
        <span>{`${timeline.steps.length} step${timeline.steps.length === 1 ? '' : 's'}`}</span>
      </div>
      <div className="BuildPathParallelModeBody">
        {status === 'empty' ? (
          <span>No build steps</span>
        ) : status === 'single-step' ? (
          <span>One master step</span>
        ) : status === 'dependency-hints-unavailable' ? (
          <span>Dependency hints unavailable</span>
        ) : (
          <ol className="BuildPathBranchLaneList" aria-label="Build Path branch lanes">
            {branchProjection.lanes.map((lane, laneIndex) => {
              const selectedTimelineStepId =
                selectedBranchTimelineStepIdByLaneId[lane.branchLaneId] ??
                lane.originTimelineStepId

              return (
                <li
                  key={lane.branchLaneId}
                  className="BuildPathBranchLane"
                  data-build-path-branch-lane-id={lane.branchLaneId}
                >
                  <div className="BuildPathBranchLaneHeader">
                    <span>{`Lane ${laneIndex + 1}`}</span>
                    <span>{`${lane.timelineStepIds.length} step${
                      lane.timelineStepIds.length === 1 ? '' : 's'
                    }`}</span>
                  </div>
                  <ol className="BuildPathBranchStepList">
                    {lane.timelineStepIds.map((timelineStepId) => {
                      const step = timelineStepById.get(timelineStepId)
                      const classification = classificationByStepId.get(timelineStepId)
                      if (step === undefined || classification === undefined) {
                        return null
                      }

                      return (
                        <BuildPathBranchStep
                          key={timelineStepId}
                          classification={classification}
                          isSelected={selectedTimelineStepId === timelineStepId}
                          onSelect={() =>
                            onSelectBranchTimelineStep(lane.branchLaneId, timelineStepId)
                          }
                          step={step}
                        />
                      )
                    })}
                  </ol>
                </li>
              )
            })}
          </ol>
        )}
      </div>
    </section>
  )
}

function BuildPathBranchStep({
  classification,
  isSelected,
  onSelect,
  step,
}: {
  classification: BuildPathBranchEventClassification
  isSelected: boolean
  onSelect: () => void
  step: BuildPathTimelineStep
}) {
  return (
    <li className="BuildPathBranchStepItem">
      <button
        type="button"
        className={`BuildPathBranchStep ${isSelected ? 'isSelected' : ''}`}
        aria-pressed={isSelected}
        data-build-path-branch-role={classification.role}
        data-build-path-branch-step-id={step.timelineStepId}
        onClick={onSelect}
      >
        <span className="BuildPathBranchStepName">{step.display.label}</span>
        <span className="BuildPathBranchStepRole">
          {classification.isCheckpointCandidate
            ? 'checkpoint'
            : classification.role}
        </span>
      </button>
    </li>
  )
}

export function BuildPathTimelineStrip({
  hostMode,
  onSelectTimelineStep,
  selectedTimelineStepId = null,
  timeline,
}: BuildPathTimelineStripProps) {
  const railRef = useRef<HTMLDivElement | null>(null)
  const activePointerIdRef = useRef<number | null>(null)
  const isDraggingCurrentPositionRef = useRef(false)
  const lastDraggedStepIdRef = useRef<string | null>(null)
  const [isDraggingCurrentPosition, setIsDraggingCurrentPosition] = useState(false)
  const [isTimelineOverflowing, setIsTimelineOverflowing] = useState(false)
  const isEmpty = timeline.steps.length === 0
  const selectedStepIndex = timeline.steps.findIndex(
    (step) => step.timelineStepId === selectedTimelineStepId,
  )
  const shouldRenderCurrentPositionLine = !isEmpty && selectedStepIndex >= 0
  const selectNearestStepFromPointer = (clientX: number) => {
    const nearestStepId = readNearestBuildPathTimelineStepIdFromPointer({
      clientX,
      railElement: railRef.current,
      timeline,
    })

    if (nearestStepId !== null && nearestStepId !== lastDraggedStepIdRef.current) {
      lastDraggedStepIdRef.current = nearestStepId
      onSelectTimelineStep?.(nearestStepId)
    }
  }
  const startCurrentPositionDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    event.preventDefault()
    activePointerIdRef.current = event.pointerId
    isDraggingCurrentPositionRef.current = true
    lastDraggedStepIdRef.current = selectedTimelineStepId
    setIsDraggingCurrentPosition(true)
    event.currentTarget.setPointerCapture?.(event.pointerId)
  }
  const moveCurrentPositionDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (
      !isDraggingCurrentPositionRef.current ||
      event.pointerId !== activePointerIdRef.current
    ) {
      return
    }

    event.preventDefault()
    selectNearestStepFromPointer(event.clientX)
  }
  const stopCurrentPositionDrag = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerId !== activePointerIdRef.current) {
      return
    }

    event.currentTarget.releasePointerCapture?.(event.pointerId)
    activePointerIdRef.current = null
    isDraggingCurrentPositionRef.current = false
    lastDraggedStepIdRef.current = null
    setIsDraggingCurrentPosition(false)
  }

  useLayoutEffect(() => {
    const railElement = railRef.current

    if (railElement === null) {
      setIsTimelineOverflowing(false)
      return
    }

    const updateTimelineOverflow = () => {
      setIsTimelineOverflowing(railElement.scrollWidth > railElement.clientWidth + 1)
    }

    updateTimelineOverflow()

    const resizeObserver =
      typeof ResizeObserver === 'undefined'
        ? null
        : new ResizeObserver(updateTimelineOverflow)

    resizeObserver?.observe(railElement)
    window.addEventListener('resize', updateTimelineOverflow)

    return () => {
      resizeObserver?.disconnect()
      window.removeEventListener('resize', updateTimelineOverflow)
    }
  }, [timeline.steps.length])

  return (
    <div
      className={`BuildPathTimelineStrip BuildPathTimelineStrip--${hostMode}`}
      data-build-path-timeline-status={timeline.status}
      data-build-path-current-position-dragging={
        isDraggingCurrentPosition ? 'true' : 'false'
      }
      aria-label="Build Path timeline"
    >
      {isEmpty ? (
        <div className="BuildPathTimelineEmpty" aria-label={timeline.emptyState?.title}>
          <span className="BuildPathTimelineEmptyGlyph" aria-hidden="true" />
        </div>
      ) : (
        <div
          className="BuildPathTimelineStepRail"
          data-build-path-timeline-overflow="horizontal-scroll"
          data-build-path-timeline-scrollbar-visible={
            isTimelineOverflowing ? 'true' : 'false'
          }
          ref={railRef}
        >
          <ol className="BuildPathTimelineStepList" aria-label="Accepted build events">
            {timeline.steps.map((step) => (
              <li key={step.timelineStepId} className="BuildPathTimelineStepItem">
                <button
                  type="button"
                  className={`BuildPathTimelineStep BuildPathTimelineStep--${step.display.icon} ${
                    selectedTimelineStepId === step.timelineStepId ? 'isSelected' : ''
                  }`}
                  title={`${step.orderIndex + 1}. ${step.display.label}`}
                  aria-label={`${step.orderIndex + 1}. ${step.display.iconLabel}`}
                  aria-pressed={selectedTimelineStepId === step.timelineStepId}
                  data-build-path-step-id={step.timelineStepId}
                  data-build-path-event-id={step.eventReference.buildPathEventId}
                  data-build-path-step-selected={
                    selectedTimelineStepId === step.timelineStepId ? 'true' : 'false'
                  }
                  onClick={() => onSelectTimelineStep?.(step.timelineStepId)}
                >
                  <BuildPathStepIcon step={step} />
                </button>
              </li>
            ))}
          </ol>
          {shouldRenderCurrentPositionLine ? (
            <button
              type="button"
              className="BuildPathCurrentPositionLine"
              aria-label="Drag Build Path current position"
              data-build-path-current-position-line="true"
              data-build-path-current-position-placement="after-step"
              data-build-path-current-step-id={selectedTimelineStepId ?? undefined}
              data-build-path-current-step-index={selectedStepIndex}
              style={
                {
                  '--build-path-current-step-index': selectedStepIndex,
                } as CSSProperties
              }
              onPointerDown={startCurrentPositionDrag}
              onPointerMove={moveCurrentPositionDrag}
              onPointerUp={stopCurrentPositionDrag}
              onPointerCancel={stopCurrentPositionDrag}
            >
              <span className="BuildPathCurrentPositionLineStem" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function BuildPathSurface({
  surfaceInstanceId = 'build-path-surface',
  hostMode = 'workspace',
  timeline,
}: BuildPathSurfaceProps) {
  const runtimeState = useBuildPathRuntimeStore((state) => state.runtimeState)
  const graphDependencies = useBuildPathRuntimeStore(
    (state) => state.runtimeState.graphDependencies,
  )
  const isParallelModeEnabled = useBuildPathRuntimeStore((state) => state.isParallelModeEnabled)
  const selectedBranchTimelineStepIdByLaneId = useBuildPathRuntimeStore(
    (state) => state.selectedBranchTimelineStepIdByLaneId,
  )
  const selectedTimelineStepId = useBuildPathRuntimeStore((state) => state.selectedTimelineStepId)
  const selectBranchTimelineStep = useBuildPathRuntimeStore(
    (state) => state.selectBranchTimelineStep,
  )
  const selectTimelineStep = useBuildPathRuntimeStore((state) => state.selectTimelineStep)
  const setParallelModeEnabled = useBuildPathRuntimeStore((state) => state.setParallelModeEnabled)
  const resolvedTimeline = timeline ?? readBuildPathRuntimeMasterTimeline(runtimeState)
  const resolvedSelectedStepId =
    selectedTimelineStepId ??
    (resolvedTimeline.status === 'ready' ? resolvedTimeline.steps[0]?.timelineStepId ?? null : null)
  const selectedStep =
    resolvedTimeline.steps.find((step) => step.timelineStepId === resolvedSelectedStepId) ?? null
  const branchProjection = deriveBuildPathBranchProjection({
    dependencies: graphDependencies,
    timeline: resolvedTimeline,
  })
  const branchClassificationByStepId = new Map(
    branchProjection.eventClassifications.map((classification) => [
      classification.timelineStepId,
      classification,
    ]),
  )
  const actionBoundaryRead =
    selectedStep !== null && isBuildPathBuildEventTimelineStep(selectedStep)
      ? deriveBuildPathActionBoundaryRead({
          classification: branchClassificationByStepId.get(selectedStep.timelineStepId) ?? null,
          selectedStep,
        })
      : undefined
  const timelineStepById = new Map(
    resolvedTimeline.steps.map((step) => [step.timelineStepId, step]),
  )

  return (
    <section
      className={`WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--buildPath BuildPathSurface BuildPathSurface--${hostMode}`}
      data-workspace-surface-instance-id={surfaceInstanceId}
      data-build-path-host-mode={hostMode}
    >
      <BuildPathTimelineStrip
        timeline={resolvedTimeline}
        hostMode={hostMode}
        selectedTimelineStepId={resolvedSelectedStepId}
        onSelectTimelineStep={selectTimelineStep}
      />
      {hostMode === 'workspace' ? (
        <>
          <BuildPathWorkspaceModeSwitch
            isParallelModeEnabled={isParallelModeEnabled}
            onSetParallelModeEnabled={setParallelModeEnabled}
          />
          {isParallelModeEnabled ? (
            <BuildPathParallelModeRead
              branchProjection={branchProjection}
              hasDependencyHints={graphDependencies.length > 0}
              onSelectBranchTimelineStep={selectBranchTimelineStep}
              selectedBranchTimelineStepIdByLaneId={selectedBranchTimelineStepIdByLaneId}
              timeline={resolvedTimeline}
              timelineStepById={timelineStepById}
            />
          ) : (
            <BuildPathSelectedEventReadback
              actionBoundaryRead={actionBoundaryRead}
              step={selectedStep}
            />
          )}
        </>
      ) : null}
    </section>
  )
}

export function BuildPathViewportDock({
  placement = 'bottom',
  timeline,
}: BuildPathViewportDockProps) {
  return (
    <div
      className={`BuildPathViewportDock BuildPathViewportDock--${placement}`}
      data-build-path-viewport-dock={placement}
      data-build-path-viewport-anchor={placement === 'bottom' ? 'bottom-left' : 'top-left'}
    >
      <BuildPathSurface hostMode="viewport-dock" timeline={timeline} />
    </div>
  )
}
