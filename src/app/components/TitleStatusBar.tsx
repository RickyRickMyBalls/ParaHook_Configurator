import { useId, useState } from 'react'
import {
  type RuntimeInspectorChangeImpactGroupVm,
  type RuntimeInspectorChangeImpactSummaryVm,
  type RuntimeInspectorQueueCardVm,
  useRuntimeInspectorVm,
} from '../store/runtimeInspectorVm'

type TitleStatusBarProps = {
  viewportId: string
}

export function TitleStatusBar(props: TitleStatusBarProps) {
  const { viewportId } = props
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(false)
  const inspectorRegionId = useId()
  const inspectorVm = useRuntimeInspectorVm(viewportId)

  const renderQueueCard = (
    task: RuntimeInspectorQueueCardVm,
    options?: {
      ariaLabel?: string
      extraClassName?: string
    },
  ) => (
    <div
      className={`TitleStatusInspectorTaskCard state-${task.tone}${options?.extraClassName ? ` ${options.extraClassName}` : ''}`}
      aria-label={options?.ariaLabel}
    >
      <div className="TitleStatusInspectorTaskHeader">
        <span className="TitleStatusInspectorTaskLabel">{task.title}</span>
        <span className="TitleStatusInspectorTaskState">{task.statusLabel}</span>
      </div>
      <div className="TitleStatusInspectorTaskMeta">
        <span>{task.progressLabel}</span>
        {task.graphDocumentId !== null ? <span>{task.graphDocumentId}</span> : null}
      </div>
      {task.progressPercent !== null ? (
        <div className="TitleStatusInspectorTaskProgressTrack">
          <span
            className="TitleStatusInspectorTaskProgressFill"
            style={{ width: `${task.progressPercent}%` }}
          />
        </div>
      ) : null}
      {task.detail !== null ? (
        <span className="TitleStatusInspectorTaskDetail">{task.detail}</span>
      ) : null}
    </div>
  )

  const renderChangeImpactSection = (
    summary: RuntimeInspectorChangeImpactSummaryVm,
    groups: RuntimeInspectorChangeImpactGroupVm[] | null,
  ) => (
    <div className="TitleStatusInspectorTaskSection">
      <div className="TitleStatusInspectorSubheader">
        <span className="TitleStatusInspectorSubheaderLabel">{summary.sectionLabel}</span>
        <span className="TitleStatusInspectorSubheaderValue">{summary.summaryLabel}</span>
      </div>
      <div className="TitleStatusInspectorImpactCard">
        <p className="TitleStatusInspectorImpactCopy">{summary.changedParamsText}</p>
        <div
          className="TitleStatusInspectorImpactMetrics"
          role="list"
          aria-label="Change impact summary"
        >
          {summary.metrics.map((metric) => (
            <div key={metric.label} className="TitleStatusInspectorImpactMetric" role="listitem">
              <span className="TitleStatusInspectorImpactMetricValue">{metric.value}</span>
              <span className="TitleStatusInspectorImpactMetricLabel">{metric.label}</span>
            </div>
          ))}
        </div>
        {groups !== null && groups.length > 0 ? (
          <div className="TitleStatusInspectorImpactGroups">
            {groups.map((group) => (
              <div
                key={group.key}
                className={`TitleStatusInspectorImpactGroup state-${group.tone}`}
              >
                <div className="TitleStatusInspectorImpactGroupHeader">
                  <span className="TitleStatusInspectorImpactGroupLabel">{group.label}</span>
                  <span className="TitleStatusInspectorImpactGroupValue">
                    {`${group.rows.length} ${group.rows.length === 1 ? 'row' : 'rows'}`}
                  </span>
                </div>
                <div
                  className="TitleStatusInspectorImpactRowList"
                  role="list"
                  aria-label={`${group.label} impact rows`}
                >
                  {group.rows.map((row) => (
                    <div
                      key={row.key}
                      className={`TitleStatusInspectorImpactRow state-${row.tone}`}
                      role="listitem"
                    >
                      <span className="TitleStatusInspectorImpactRowLabel">{row.label}</span>
                      {row.detail !== null ? (
                        <span className="TitleStatusInspectorImpactRowDetail">{row.detail}</span>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className={`TitleStatusBarStack ${isInspectorExpanded ? 'isInspectorExpanded' : ''}`}>
      <button
        type="button"
        className={`TitleStatusBar state-${inspectorVm.overallState}`}
        aria-expanded={isInspectorExpanded}
        aria-controls={inspectorRegionId}
        aria-label={isInspectorExpanded ? 'Collapse runtime inspector' : 'Expand runtime inspector'}
        onClick={() => setIsInspectorExpanded((current) => !current)}
      >
        {inspectorVm.pulseKind === 'cache_hit' && inspectorVm.pulseNonce > 0 ? (
          <span key={inspectorVm.pulseNonce} className="TitleStatusPulseFlash" />
        ) : null}
        <div className="TitleStatusRow">
          <span className="TitleStatusName">ParaHook Generator v20</span>
          <span className="TitleStatusMeta">
            {inspectorVm.overallState === 'idle' ? 'Idle' : inspectorVm.overallState}
          </span>
        </div>
        <div className="TitleStatusProgressTrack">
          <span
            className={`TitleStatusProgressFill ${inspectorVm.isIndeterminate ? 'isIndeterminate' : ''}`}
            style={{ width: inspectorVm.isIndeterminate ? '100%' : inspectorVm.progressWidth }}
          />
        </div>
      </button>
      {isInspectorExpanded ? (
        <section
          id={inspectorRegionId}
          className="TitleStatusInspectorShell"
          aria-label="Viewport runtime inspector"
        >
          <div className="TitleStatusInspectorHeader">
            <span className="TitleStatusInspectorEyebrow">Runtime Inspector</span>
            <span className="TitleStatusInspectorState">{inspectorVm.shellStateLabel}</span>
          </div>
          <div className="TitleStatusInspectorStatsGrid" role="list" aria-label="Viewport runtime stats">
            {inspectorVm.statCards.map((statCard) => (
              <div key={statCard.label} className="TitleStatusInspectorStatCard" role="listitem">
                <span className="TitleStatusInspectorStatLabel">{statCard.label}</span>
                <span className="TitleStatusInspectorStatValue">{statCard.value}</span>
              </div>
            ))}
          </div>
          <div className="TitleStatusInspectorTaskSection">
            <div className="TitleStatusInspectorSubheader">
              <span className="TitleStatusInspectorSubheaderLabel">Current Runtime Task</span>
              <span className="TitleStatusInspectorSubheaderValue">{inspectorVm.task.statusLabel}</span>
            </div>
            {inspectorVm.task.kind === 'idle' ? (
              <div className="TitleStatusInspectorTaskCard isIdle">
                <span className="TitleStatusInspectorTaskLabel">{inspectorVm.task.title}</span>
                <span className="TitleStatusInspectorTaskDetail">{inspectorVm.task.detail}</span>
              </div>
            ) : (
              renderQueueCard(
                {
                  title: inspectorVm.task.title,
                  statusLabel: inspectorVm.task.statusLabel,
                  progressLabel: inspectorVm.task.progressLabel,
                  graphDocumentId: inspectorVm.task.graphDocumentId,
                  detail: inspectorVm.task.detail,
                  progressPercent: inspectorVm.task.progressPercent,
                  tone: inspectorVm.task.tone,
                },
                {
                  ariaLabel: 'Current runtime task',
                },
              )
            )}
          </div>
          {inspectorVm.activeQueueCards.length > 0 ? (
            <div className="TitleStatusInspectorTaskSection">
              <div className="TitleStatusInspectorSubheader">
                <span className="TitleStatusInspectorSubheaderLabel">Active Queue</span>
                <span className="TitleStatusInspectorSubheaderValue">
                  {`${inspectorVm.activeQueueCards.length} queued`}
                </span>
              </div>
              <div className="TitleStatusInspectorQueueList" role="list" aria-label="Active queue">
                {inspectorVm.activeQueueCards.map((task, index) => (
                  <div key={`${index}:${task.title}:${task.graphDocumentId ?? 'unknown'}`} role="listitem">
                    {renderQueueCard(task, { extraClassName: 'isQueuedCard' })}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {inspectorVm.archiveCards.length > 0 ? (
            <div className="TitleStatusInspectorTaskSection">
              <div className="TitleStatusInspectorSubheader">
                <span className="TitleStatusInspectorSubheaderLabel">Archive</span>
                <span className="TitleStatusInspectorSubheaderValue">
                  {`${inspectorVm.archiveCards.length} recent`}
                </span>
              </div>
              <div className="TitleStatusInspectorArchiveList" role="list" aria-label="Recent archive">
                {inspectorVm.archiveCards.map((task, index) => (
                  <div
                    key={`${index}:${task.title}:${task.graphDocumentId ?? 'unknown'}`}
                    role="listitem"
                  >
                    {renderQueueCard(task, { extraClassName: 'isArchiveCard' })}
                  </div>
                ))}
              </div>
            </div>
          ) : null}
          {inspectorVm.changeImpactSummary !== null
            ? renderChangeImpactSection(
                inspectorVm.changeImpactSummary,
                inspectorVm.changeImpactGroups,
              )
            : null}
          <p className="TitleStatusInspectorHint">{inspectorVm.hint}</p>
        </section>
      ) : null}
    </div>
  )
}
