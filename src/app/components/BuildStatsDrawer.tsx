import { useBuildStatsStore } from '../store/buildStatsStore'
import { partKeyStrToLabel } from '../parts/partKeyResolver'

const stateLabel = (state: string): string => {
  switch (state) {
    case 'cache_hit':
      return 'cache hit'
    default:
      return state
  }
}

export function BuildStatsDrawer() {
  const activeSeq = useBuildStatsStore((state) => state.activeSeq)
  const overallState = useBuildStatsStore((state) => state.overallState)
  const partOrder = useBuildStatsStore((state) => state.partOrder)
  const partStatsByKey = useBuildStatsStore((state) => state.partStatsByKey)

  return (
    <section className="V15Panel BuildStatsDrawer">
      <div className="BuildStatsHeader">
        <span className="BuildStatsTitle">Build Stats</span>
        <span className="BuildStatsMeta">Seq: {activeSeq ?? '-'}</span>
      </div>
      <div className="BuildStatsMeta">State: {overallState}</div>

      <div className="BuildStatsRows">
        {partOrder.map((partKey) => {
          const stats = partStatsByKey[partKey]
          if (stats === undefined) {
            return null
          }

          const progress =
            stats.state === 'cache_hit' || stats.state === 'done'
              ? 1
              : stats.state === 'building'
                ? stats.progress01 ?? 0.3
                : stats.state === 'error'
                  ? 1
                  : 0
          const width = `${Math.round(progress * 100)}%`
          const indeterminate = stats.state === 'building' && stats.progress01 === null

          return (
            <div className="BuildStatsRow" key={partKey}>
              <div className="BuildStatsRowTop">
                <span className="BuildStatsPartName">{partKeyStrToLabel(partKey)}</span>
                <span className={`BuildStateBadge state-${stats.state}`}>
                  {stateLabel(stats.state)}
                </span>
              </div>

              <div className="BuildStatsProgressTrack">
                <span
                  className={`BuildStatsProgressFill ${indeterminate ? 'isIndeterminate' : ''}`}
                  style={{ width: indeterminate ? '100%' : width }}
                />
              </div>

              <div className="BuildStatsRowMeta">
                <span>{stats.ms === null ? '-- ms' : `${stats.ms} ms`}</span>
                {stats.cached ? <span className="CacheChip">cache</span> : null}
              </div>

              {stats.message !== null ? (
                <div className="BuildStatsMessage">{stats.message}</div>
              ) : null}
            </div>
          )
        })}
      </div>
    </section>
  )
}
