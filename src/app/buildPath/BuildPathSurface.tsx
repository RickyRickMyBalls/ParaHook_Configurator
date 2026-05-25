import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import {
  deriveBuildPathBranchProjection,
  deriveBuildPathTopologyLayout,
  type BuildPathBranchEventClassification,
  type BuildPathBranchProjection,
  type BuildPathMasterTimeline,
  type BuildPathTimelineStep,
  type BuildPathTopologyLayout,
  type BuildPathTopologyNode,
  isBuildPathBuildEventTimelineStep,
} from './buildPathTimeline'
import {
  deriveBuildPathActionBoundaryRead,
  type BuildPathActionBoundaryRead,
} from './buildPathActions'
import { readBuildPathRuntimeMasterTimeline } from './buildPathRuntime'
import {
  useBuildPathRuntimeStore,
  type BuildPathTopologyAlignment,
} from './useBuildPathRuntimeStore'

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

type BuildPathTemporalState = 'past' | 'current' | 'future'

const readBuildPathTemporalState = (
  step: Pick<BuildPathTimelineStep, 'orderIndex'> | null,
  selectedStepIndex: number,
): BuildPathTemporalState => {
  if (step === null || selectedStepIndex < 0) {
    return 'past'
  }

  if (step.orderIndex < selectedStepIndex) {
    return 'past'
  }

  if (step.orderIndex > selectedStepIndex) {
    return 'future'
  }

  return 'current'
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
  alignment,
  branchProjection,
  hasDependencyHints,
  isLaneReadbackExpanded,
  onSelectBranchTimelineStep,
  onSetAlignment,
  onSetLaneReadbackExpanded,
  selectedBranchTimelineStepIdByLaneId,
  selectedMasterStepIndex,
  timeline,
  timelineStepById,
  topologyLayout,
}: {
  alignment: BuildPathTopologyAlignment
  branchProjection: BuildPathBranchProjection
  hasDependencyHints: boolean
  isLaneReadbackExpanded: boolean
  onSelectBranchTimelineStep: (branchLaneId: string, timelineStepId: string) => void
  onSetAlignment: (alignment: BuildPathTopologyAlignment) => void
  onSetLaneReadbackExpanded: (isExpanded: boolean) => void
  selectedBranchTimelineStepIdByLaneId: Record<string, string>
  selectedMasterStepIndex: number
  timeline: BuildPathMasterTimeline
  timelineStepById: Map<string, BuildPathTimelineStep>
  topologyLayout: BuildPathTopologyLayout
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
      data-build-path-lane-readback-expanded={isLaneReadbackExpanded}
    >
      <div className="BuildPathParallelModeBody">
        <BuildPathTopologyAlignmentControls
          alignment={alignment}
          onSetAlignment={onSetAlignment}
        />
        <BuildPathTopologyRead
          alignment={alignment}
          classificationByStepId={classificationByStepId}
          onSelectBranchTimelineStep={onSelectBranchTimelineStep}
          selectedBranchTimelineStepIdByLaneId={selectedBranchTimelineStepIdByLaneId}
          selectedMasterStepIndex={selectedMasterStepIndex}
          timelineStepById={timelineStepById}
          topologyLayout={topologyLayout}
        />
        {status === 'empty' ? (
          <span>No build steps</span>
        ) : status === 'single-step' ? (
          <span>One master step</span>
        ) : status === 'dependency-hints-unavailable' ? (
          <span>Dependency hints unavailable</span>
        ) : (
          <div className="BuildPathParallelLaneReadback">
            <button
              type="button"
              className="BuildPathParallelLaneReadbackToggle"
              aria-expanded={isLaneReadbackExpanded}
              aria-controls="build-path-parallel-lane-readback"
              onClick={() => onSetLaneReadbackExpanded(!isLaneReadbackExpanded)}
            >
              <span>Lane readback</span>
              <span>{isLaneReadbackExpanded ? 'Hide' : 'Show'}</span>
            </button>
            {isLaneReadbackExpanded ? (
              <ol
                id="build-path-parallel-lane-readback"
                className="BuildPathBranchLaneList"
                aria-label="Build Path branch lanes"
              >
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
            ) : null}
          </div>
        )}
      </div>
    </section>
  )
}

function BuildPathTopologyAlignmentControls({
  alignment,
  onSetAlignment,
}: {
  alignment: BuildPathTopologyAlignment
  onSetAlignment: (alignment: BuildPathTopologyAlignment) => void
}) {
  const controls: ReadonlyArray<{
    alignment: BuildPathTopologyAlignment
    label: string
    icon: 'top' | 'center' | 'bottom'
  }> = [
    { alignment: 'top', label: 'Align Top', icon: 'top' },
    { alignment: 'center', label: 'Align Center', icon: 'center' },
    { alignment: 'bottom', label: 'Align Bottom', icon: 'bottom' },
  ]

  return (
    <div className="BuildPathTopologyAlignmentControls" aria-label="Topology alignment">
      {controls.map((control) => (
        <button
          key={control.alignment}
          type="button"
          className={`BuildPathTopologyAlignmentButton ${
            alignment === control.alignment ? 'isSelected' : ''
          }`}
          aria-label={control.label}
          aria-pressed={alignment === control.alignment}
          title={control.label}
          data-build-path-topology-align-control={control.alignment}
          onClick={() => onSetAlignment(control.alignment)}
        >
          <BuildPathTopologyAlignmentIcon icon={control.icon} />
        </button>
      ))}
    </div>
  )
}

function BuildPathTopologyAlignmentIcon({ icon }: { icon: 'top' | 'center' | 'bottom' }) {
  const y = icon === 'top' ? 5 : icon === 'center' ? 10 : 15

  return (
    <svg className="BuildPathTopologyAlignmentGlyph" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4 4h12" />
      <path d="M4 10h12" />
      <path d="M4 16h12" />
      <path className="BuildPathTopologyAlignmentGlyphActive" d={`M6 ${y}h8`} />
    </svg>
  )
}

function BuildPathTopologyRead({
  alignment,
  classificationByStepId,
  onSelectBranchTimelineStep,
  selectedBranchTimelineStepIdByLaneId,
  selectedMasterStepIndex,
  timelineStepById,
  topologyLayout,
}: {
  alignment: BuildPathTopologyAlignment
  classificationByStepId: Map<string, BuildPathBranchEventClassification>
  onSelectBranchTimelineStep: (branchLaneId: string, timelineStepId: string) => void
  selectedBranchTimelineStepIdByLaneId: Record<string, string>
  selectedMasterStepIndex: number
  timelineStepById: Map<string, BuildPathTimelineStep>
  topologyLayout: BuildPathTopologyLayout
}) {
  const columnCount = Math.max(topologyLayout.columns.length, 1)
  const laneCount = Math.max(
    1,
    ...topologyLayout.columns.map((column) => column.topologyNodeIds.length),
  )
  const nodeById = new Map(
    topologyLayout.nodes.map((node) => [node.topologyNodeId, node] as const),
  )
  const readCommandNodeTemporalState = (node: BuildPathTopologyNode): BuildPathTemporalState => {
    if (node.timelineStepId === null) {
      return 'past'
    }

    return readBuildPathTemporalState(
      timelineStepById.get(node.timelineStepId) ?? null,
      selectedMasterStepIndex,
    )
  }
  const nodeTemporalStateById = new Map<string, BuildPathTemporalState>()

  topologyLayout.nodes.forEach((node) => {
    if (node.timelineStepId !== null) {
      nodeTemporalStateById.set(node.topologyNodeId, readCommandNodeTemporalState(node))
    }
  })

  topologyLayout.nodes.forEach((node) => {
    if (node.timelineStepId !== null) {
      return
    }

    const incomingStates = topologyLayout.connectors
      .filter((connector) => connector.toTopologyNodeId === node.topologyNodeId)
      .map((connector) => nodeTemporalStateById.get(connector.fromTopologyNodeId) ?? 'past')

    if (incomingStates.length === 0) {
      nodeTemporalStateById.set(node.topologyNodeId, 'past')
      return
    }

    if (incomingStates.every((temporalState) => temporalState === 'future')) {
      nodeTemporalStateById.set(node.topologyNodeId, 'future')
      return
    }

    if (incomingStates.some((temporalState) => temporalState === 'current')) {
      nodeTemporalStateById.set(node.topologyNodeId, 'current')
      return
    }

    nodeTemporalStateById.set(node.topologyNodeId, 'past')
  })
  const readConnectorTemporalState = (
    connector: BuildPathTopologyLayout['connectors'][number],
  ): BuildPathTemporalState => {
    const fromState = nodeTemporalStateById.get(connector.fromTopologyNodeId) ?? 'past'
    const toState = nodeTemporalStateById.get(connector.toTopologyNodeId) ?? 'past'

    if (fromState === 'future' || toState === 'future') {
      return 'future'
    }

    if (fromState === 'current' || toState === 'current') {
      return 'current'
    }

    return 'past'
  }
  const readNodeLaneRatio = (node: BuildPathTopologyNode): number => {
    const column = topologyLayout.columns.find(
      (candidate) => candidate.columnIndex === node.columnIndex,
    )
    const columnNodeCount = column?.topologyNodeIds.length ?? 1

    if (columnNodeCount === 1 && laneCount > 1) {
      if (alignment === 'top') {
        return 0.5 / laneCount
      }
      if (alignment === 'bottom') {
        return (laneCount - 0.5) / laneCount
      }
      return 0.5
    }

    if (alignment === 'bottom') {
      return (laneCount - node.laneIndex - 0.5) / laneCount
    }

    return (node.laneIndex + 0.5) / laneCount
  }
  const readNodeColumnRatio = (node: BuildPathTopologyNode): number =>
    columnCount <= 1 ? 0.5 : node.columnIndex / (columnCount - 1)
  const readConnectorPath = (
    fromNode: BuildPathTopologyNode,
    toNode: BuildPathTopologyNode,
  ): string => {
    const leftInset = 13
    const usableWidth = 74
    const fromX = leftInset + readNodeColumnRatio(fromNode) * usableWidth
    const toX = leftInset + readNodeColumnRatio(toNode) * usableWidth
    const fromY = readNodeLaneRatio(fromNode) * 100
    const toY = readNodeLaneRatio(toNode) * 100
    const curve = Math.max(8, Math.abs(toX - fromX) * 0.45)

    return [
      `M ${fromX.toFixed(2)} ${fromY.toFixed(2)}`,
      `C ${(fromX + curve).toFixed(2)} ${fromY.toFixed(2)}`,
      `${(toX - curve).toFixed(2)} ${toY.toFixed(2)}`,
      `${toX.toFixed(2)} ${toY.toFixed(2)}`,
    ].join(' ')
  }

  return (
    <div
      className="BuildPathTopologyRead"
      data-build-path-topology-state={topologyLayout.status}
      data-build-path-topology-column-count={topologyLayout.columns.length}
      data-build-path-topology-node-count={topologyLayout.nodes.length}
      data-build-path-topology-connector-count={topologyLayout.connectors.length}
      data-build-path-topology-alignment={alignment}
      style={
        {
          '--build-path-topology-column-count': columnCount,
          '--build-path-topology-lane-count': laneCount,
        } as CSSProperties
      }
      aria-label="Build Path topology"
    >
      {topologyLayout.status === 'ready' ? (
        <svg
          className="BuildPathTopologyConnectorLayer"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {topologyLayout.connectors.map((connector) => {
            const fromNode = nodeById.get(connector.fromTopologyNodeId)
            const toNode = nodeById.get(connector.toTopologyNodeId)

            if (fromNode === undefined || toNode === undefined) {
              return null
            }

            return (
              <path
                key={connector.connectorId}
                className="BuildPathTopologyConnector"
                d={readConnectorPath(fromNode, toNode)}
                stroke={connector.connectorColor}
                data-build-path-topology-connector-id={connector.connectorId}
                data-build-path-topology-edge-id={connector.edgeId}
                data-build-path-topology-from-node-id={connector.fromTopologyNodeId}
                data-build-path-topology-to-node-id={connector.toTopologyNodeId}
                data-build-path-topology-from-port-id={connector.fromPortId ?? undefined}
                data-build-path-topology-to-port-id={connector.toPortId ?? undefined}
                data-build-path-topology-connector-kind={connector.connectorKind ?? undefined}
                data-build-path-topology-connector-color={connector.connectorColor}
                data-build-path-topology-temporal-state={
                  readConnectorTemporalState(connector)
                }
                vectorEffect="non-scaling-stroke"
              />
            )
          })}
        </svg>
      ) : null}
      <div className="BuildPathTopologyGrid">
        {topologyLayout.nodes.map((node) => {
          const classification =
            node.timelineStepId === null
              ? undefined
              : classificationByStepId.get(node.timelineStepId)
          const selectedTimelineStepId =
            classification === undefined
              ? null
              : selectedBranchTimelineStepIdByLaneId[classification.branchLaneId] ??
                classification.timelineStepId
          const isSelected =
            node.timelineStepId !== null &&
            selectedTimelineStepId === node.timelineStepId
          const temporalState = nodeTemporalStateById.get(node.topologyNodeId) ?? 'past'
          const gridRow =
            topologyLayout.columns.find(
              (column) => column.columnIndex === node.columnIndex,
            )?.topologyNodeIds.length === 1 && laneCount > 1
              ? alignment === 'top'
                ? 1
                : alignment === 'bottom'
                  ? laneCount
                  : `1 / span ${laneCount}`
              : alignment === 'bottom'
                ? laneCount - node.laneIndex
                : node.laneIndex + 1
          const cardStyle = {
            '--build-path-topology-column': node.columnIndex + 1,
            '--build-path-topology-row': gridRow,
          } as CSSProperties
          const card = (
            <>
              <BuildPathTopologyIcon node={node} />
              <span className="BuildPathTopologyCardLabel">{node.display.label}</span>
            </>
          )

          if (node.timelineStepId !== null && classification !== undefined) {
            return (
              <button
                key={node.topologyNodeId}
                type="button"
                className={`BuildPathTopologyCard ${isSelected ? 'isSelected' : ''}`}
                aria-label={node.display.iconLabel}
                aria-pressed={isSelected}
                data-build-path-topology-node-id={node.topologyNodeId}
                data-build-path-topology-node-kind={node.nodeKind}
                data-build-path-topology-graph-node-id={node.graphNodeId}
                data-build-path-topology-timeline-step-id={node.timelineStepId}
                data-build-path-topology-column-index={node.columnIndex}
                data-build-path-topology-lane-index={node.laneIndex}
                data-build-path-topology-icon={node.display.icon}
                data-build-path-topology-temporal-state={temporalState}
                style={cardStyle}
                onClick={() =>
                  onSelectBranchTimelineStep(
                    classification.branchLaneId,
                    node.timelineStepId ?? classification.timelineStepId,
                  )
                }
              >
                {card}
              </button>
            )
          }

          return (
            <div
              key={node.topologyNodeId}
              className="BuildPathTopologyCard BuildPathTopologyCard--static"
              role="img"
              aria-label={node.display.iconLabel}
              data-build-path-topology-node-id={node.topologyNodeId}
              data-build-path-topology-node-kind={node.nodeKind}
              data-build-path-topology-graph-node-id={node.graphNodeId}
              data-build-path-topology-timeline-step-id={node.timelineStepId ?? undefined}
              data-build-path-topology-column-index={node.columnIndex}
              data-build-path-topology-lane-index={node.laneIndex}
              data-build-path-topology-icon={node.display.icon}
              data-build-path-topology-temporal-state={temporalState}
              style={cardStyle}
            >
              {card}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function BuildPathTopologyIcon({ node }: { node: BuildPathTopologyNode }) {
  if (node.display.icon === 'graph-created') {
    return (
      <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4.5 5.5h11v9h-11v-9Z" />
        <path d="M7 8.5h6" />
        <path d="M10 11.5v-6" />
      </svg>
    )
  }

  if (node.display.icon === 'graph-loaded') {
    return (
      <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4.5 5.5h11v9h-11v-9Z" />
        <path d="M7 10.5h6" />
        <path d="m8.5 8 1.5-1.5L11.5 8" />
        <path d="M10 6.5v6" />
      </svg>
    )
  }

  if (node.display.icon === 'extrude') {
    return (
      <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M5 7.5 10 5l5 2.5v5L10 15l-5-2.5v-5Z" />
        <path d="M5 7.5 10 10l5-2.5" />
        <path d="M10 10v5" />
      </svg>
    )
  }

  if (node.display.icon === 'output-preview') {
    return (
      <svg className="BuildPathStepGlyph" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M4.5 6.5h11v7h-11v-7Z" />
        <path d="M7 9h6" />
        <path d="M7 11.5h6" />
        <path d="M15.5 10h2" />
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
                  data-build-path-step-temporal-state={
                    readBuildPathTemporalState(step, selectedStepIndex)
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
  const topologyAlignment = useBuildPathRuntimeStore((state) => state.topologyAlignment)
  const isParallelLaneReadbackExpanded = useBuildPathRuntimeStore(
    (state) => state.isParallelLaneReadbackExpanded,
  )
  const selectedBranchTimelineStepIdByLaneId = useBuildPathRuntimeStore(
    (state) => state.selectedBranchTimelineStepIdByLaneId,
  )
  const selectedTimelineStepId = useBuildPathRuntimeStore((state) => state.selectedTimelineStepId)
  const selectBranchTimelineStep = useBuildPathRuntimeStore(
    (state) => state.selectBranchTimelineStep,
  )
  const selectTimelineStep = useBuildPathRuntimeStore((state) => state.selectTimelineStep)
  const setParallelModeEnabled = useBuildPathRuntimeStore((state) => state.setParallelModeEnabled)
  const setTopologyAlignment = useBuildPathRuntimeStore((state) => state.setTopologyAlignment)
  const setParallelLaneReadbackExpanded = useBuildPathRuntimeStore(
    (state) => state.setParallelLaneReadbackExpanded,
  )
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
  const topologyLayout = deriveBuildPathTopologyLayout({
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
              alignment={topologyAlignment}
              branchProjection={branchProjection}
              hasDependencyHints={graphDependencies.length > 0}
              isLaneReadbackExpanded={isParallelLaneReadbackExpanded}
              onSelectBranchTimelineStep={selectBranchTimelineStep}
              onSetAlignment={setTopologyAlignment}
              onSetLaneReadbackExpanded={setParallelLaneReadbackExpanded}
              selectedBranchTimelineStepIdByLaneId={selectedBranchTimelineStepIdByLaneId}
              selectedMasterStepIndex={selectedStep?.orderIndex ?? -1}
              timeline={resolvedTimeline}
              timelineStepById={timelineStepById}
              topologyLayout={topologyLayout}
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
