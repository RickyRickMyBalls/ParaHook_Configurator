import { useId, useState } from 'react'
import {
  selectHasDeterminateProgress,
  selectOverallProgress01,
  useBuildStatsStore,
} from '../store/buildStatsStore'
import {
  selectViewportRuntimeStats,
  useViewportRuntimeStatsStore,
} from '../store/viewportRuntimeStatsStore'

type TitleStatusBarProps = {
  viewportId: string
}

const formatRuntimeStatValue = (value: number | null): string =>
  value === null ? 'Unavailable' : value.toLocaleString()

export function TitleStatusBar(props: TitleStatusBarProps) {
  const { viewportId } = props
  const [isInspectorExpanded, setIsInspectorExpanded] = useState(false)
  const inspectorRegionId = useId()
  const overallState = useBuildStatsStore((state) => state.overallState)
  const pulseNonce = useBuildStatsStore((state) => state.pulseNonce)
  const pulseKind = useBuildStatsStore((state) => state.pulseKind)
  const overallProgress01 = useBuildStatsStore(selectOverallProgress01)
  const hasDeterminateProgress = useBuildStatsStore(selectHasDeterminateProgress)
  const runtimeStats = useViewportRuntimeStatsStore((state) =>
    selectViewportRuntimeStats(state, viewportId),
  )

  const shouldShowProgress = overallState === 'building' || overallState === 'assembling'
  const isIndeterminate = shouldShowProgress && !hasDeterminateProgress
  const progressWidth = shouldShowProgress ? `${Math.round(overallProgress01 * 100)}%` : '0%'
  const hasAnyRuntimeStats = Object.values(runtimeStats).some((value) => value !== null)

  return (
    <div className={`TitleStatusBarStack ${isInspectorExpanded ? 'isInspectorExpanded' : ''}`}>
      <button
        type="button"
        className={`TitleStatusBar state-${overallState}`}
        aria-expanded={isInspectorExpanded}
        aria-controls={inspectorRegionId}
        aria-label={isInspectorExpanded ? 'Collapse runtime inspector' : 'Expand runtime inspector'}
        onClick={() => setIsInspectorExpanded((current) => !current)}
      >
        {pulseKind === 'cache_hit' && pulseNonce > 0 ? (
          <span key={pulseNonce} className="TitleStatusPulseFlash" />
        ) : null}
        <div className="TitleStatusRow">
          <span className="TitleStatusName">ParaHook Generator v20</span>
          <span className="TitleStatusMeta">
            {overallState === 'idle' ? 'Idle' : overallState}
          </span>
        </div>
        <div className="TitleStatusProgressTrack">
          <span
            className={`TitleStatusProgressFill ${isIndeterminate ? 'isIndeterminate' : ''}`}
            style={{ width: isIndeterminate ? '100%' : progressWidth }}
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
            <span className="TitleStatusInspectorState">Viewport Stats</span>
          </div>
          <div className="TitleStatusInspectorStatsGrid" role="list" aria-label="Viewport runtime stats">
            <div className="TitleStatusInspectorStatCard" role="listitem">
              <span className="TitleStatusInspectorStatLabel">Triangles</span>
              <span className="TitleStatusInspectorStatValue">
                {formatRuntimeStatValue(runtimeStats.triangles)}
              </span>
            </div>
            <div className="TitleStatusInspectorStatCard" role="listitem">
              <span className="TitleStatusInspectorStatLabel">Lines</span>
              <span className="TitleStatusInspectorStatValue">
                {formatRuntimeStatValue(runtimeStats.lines)}
              </span>
            </div>
            <div className="TitleStatusInspectorStatCard" role="listitem">
              <span className="TitleStatusInspectorStatLabel">Points</span>
              <span className="TitleStatusInspectorStatValue">
                {formatRuntimeStatValue(runtimeStats.points)}
              </span>
            </div>
            <div className="TitleStatusInspectorStatCard" role="listitem">
              <span className="TitleStatusInspectorStatLabel">FPS</span>
              <span className="TitleStatusInspectorStatValue">
                {formatRuntimeStatValue(runtimeStats.fps)}
              </span>
            </div>
          </div>
          <p className="TitleStatusInspectorHint">
            {hasAnyRuntimeStats
              ? 'Active runtime task cards stay deferred until VRI-1.3.'
              : 'Waiting for the first viewer runtime sample. Active runtime task cards stay deferred until VRI-1.3.'}
          </p>
        </section>
      ) : null}
    </div>
  )
}
