import { useEffect, useId, useState } from 'react'
import {
  type RuntimeInspectorChangeImpactGroupVm,
  type RuntimeInspectorChangeImpactSummaryVm,
  type RuntimeInspectorQueueCardVm,
  useRuntimeInspectorVm,
} from '../store/runtimeInspectorVm'
import {
  selectViewportPresentationSettings,
  useAppStore,
  type ViewportPresentationStateId,
} from '../store/useAppStore'

type TitleStatusBarProps = {
  viewportId: string
}

export function TitleStatusBar(props: TitleStatusBarProps) {
  const { viewportId } = props
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(false)
  const [isPresentationMenuOpen, setIsPresentationMenuOpen] = useState(false)
  const inspectorRegionId = useId()
  const presentationMenuId = useId()
  const inspectorVm = useRuntimeInspectorVm(viewportId)
  const viewportPresentationSettings = useAppStore(selectViewportPresentationSettings)
  const setViewportPresentationOpacity = useAppStore(
    (state) => state.setViewportPresentationOpacity,
  )
  const setViewportPresentationColor = useAppStore((state) => state.setViewportPresentationColor)

  useEffect(() => {
    if (!isInspectorExpanded) {
      setIsPresentationMenuOpen(false)
    }
  }, [isInspectorExpanded])

  const presentationRows: Array<{
    id: ViewportPresentationStateId
    label: string
    description: string
  }> = [
    {
      id: 'lastLoaded',
      label: 'Last loaded geometry',
      description: 'Retained accepted truth during churn',
    },
    {
      id: 'previewMesh',
      label: 'Preview mesh while changing param',
      description: 'Live draft mesh preview',
    },
    {
      id: 'previewBrep',
      label: 'Preview B-rep while changing param',
      description: 'Ready authoritative preview before acceptance',
    },
  ]

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
            <div className="TitleStatusInspectorHeaderText">
              <span className="TitleStatusInspectorEyebrow">Runtime Inspector</span>
              <span className="TitleStatusInspectorState">{inspectorVm.shellStateLabel}</span>
            </div>
            <div className="TitleStatusInspectorHeaderActions">
              <button
                type="button"
                className={`TitleStatusInspectorInfoButton ${isPresentationMenuOpen ? 'isOpen' : ''}`}
                aria-label={
                  isPresentationMenuOpen
                    ? 'Hide viewport presentation settings'
                    : 'Show viewport presentation settings'
                }
                aria-expanded={isPresentationMenuOpen}
                aria-controls={presentationMenuId}
                onClick={(event) => {
                  event.stopPropagation()
                  setIsPresentationMenuOpen((current) => !current)
                }}
              >
                i
              </button>
            </div>
          </div>
          {isPresentationMenuOpen ? (
            <section
              id={presentationMenuId}
              className="TitleStatusInspectorInfoMenu"
              aria-label="Viewport presentation settings"
            >
              <div className="TitleStatusInspectorSubheader">
                <span className="TitleStatusInspectorSubheaderLabel">Viewport Presentation</span>
                <span className="TitleStatusInspectorSubheaderValue">Visual only</span>
              </div>
              <div className="TitleStatusInspectorPresentationList">
                {presentationRows.map((row) => {
                  const settings = viewportPresentationSettings[row.id]
                  return (
                    <div key={row.id} className="TitleStatusInspectorPresentationCard">
                      <div className="TitleStatusInspectorPresentationCopy">
                        <span className="TitleStatusInspectorPresentationLabel">{row.label}</span>
                        <span className="TitleStatusInspectorPresentationDetail">
                          {row.description}
                        </span>
                      </div>
                      <label className="TitleStatusInspectorPresentationControl">
                        <span className="TitleStatusInspectorPresentationControlLabel">
                          Opacity
                        </span>
                        <div className="TitleStatusInspectorPresentationControlRow">
                          <input
                            className="TitleStatusInspectorPresentationRange"
                            type="range"
                            min={0}
                            max={100}
                            step={1}
                            value={Math.round(settings.opacity * 100)}
                            aria-label={`${row.label} opacity`}
                            onChange={(event) => {
                              setViewportPresentationOpacity(
                                row.id,
                                Number(event.currentTarget.value) / 100,
                              )
                            }}
                          />
                          <span className="TitleStatusInspectorPresentationValue">
                            {`${Math.round(settings.opacity * 100)}%`}
                          </span>
                        </div>
                      </label>
                      <label className="TitleStatusInspectorPresentationControl">
                        <span className="TitleStatusInspectorPresentationControlLabel">Color</span>
                        <div className="TitleStatusInspectorPresentationColorRow">
                          <input
                            className="TitleStatusInspectorPresentationColorPicker"
                            type="color"
                            value={settings.color}
                            aria-label={`${row.label} color`}
                            onChange={(event) => {
                              setViewportPresentationColor(row.id, event.currentTarget.value)
                            }}
                          />
                          <span className="TitleStatusInspectorPresentationColorValue">
                            {settings.color}
                          </span>
                        </div>
                      </label>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null}
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
