export type BurstWindow = {
  startTimeSec: number
  endTimeSec: number
  durationSec: number
}

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

export const resolveBurstWindow = (
  trackDurationSec: number,
  normalizedSamplePosition: number,
  burstDurationSec: number,
): BurstWindow => {
  const safeTrackDuration = Math.max(0.01, trackDurationSec)
  const safeBurstDuration = Math.max(0.01, burstDurationSec)
  const clampedSamplePosition = clamp(normalizedSamplePosition, 0, 1)
  const maxStartTime = Math.max(0, safeTrackDuration - Math.min(safeBurstDuration, safeTrackDuration))
  const startTimeSec = Math.min(clampedSamplePosition * safeTrackDuration, maxStartTime)
  const endTimeSec = Math.min(safeTrackDuration, startTimeSec + safeBurstDuration)
  return {
    startTimeSec,
    endTimeSec,
    durationSec: Math.max(0.01, endTimeSec - startTimeSec),
  }
}
