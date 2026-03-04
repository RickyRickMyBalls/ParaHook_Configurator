import {
  selectHasDeterminateProgress,
  selectOverallProgress01,
  useBuildStatsStore,
} from '../store/buildStatsStore'

export function TitleStatusBar() {
  const statsExpanded = useBuildStatsStore((state) => state.statsExpanded)
  const overallState = useBuildStatsStore((state) => state.overallState)
  const pulseNonce = useBuildStatsStore((state) => state.pulseNonce)
  const pulseKind = useBuildStatsStore((state) => state.pulseKind)
  const toggleStatsExpanded = useBuildStatsStore((state) => state.toggleStatsExpanded)
  const overallProgress01 = useBuildStatsStore(selectOverallProgress01)
  const hasDeterminateProgress = useBuildStatsStore(selectHasDeterminateProgress)

  const shouldShowProgress = overallState === 'building' || overallState === 'assembling'
  const isIndeterminate = shouldShowProgress && !hasDeterminateProgress
  const progressWidth = shouldShowProgress ? `${Math.round(overallProgress01 * 100)}%` : '0%'

  return (
    <button
      type="button"
      className={`TitleStatusBar state-${overallState}`}
      aria-expanded={statsExpanded}
      onClick={toggleStatsExpanded}
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
  )
}
