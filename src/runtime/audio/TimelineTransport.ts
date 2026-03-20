export type BurstWindow = {
  startTimeSec: number
  endTimeSec: number
  durationSec: number
}

export const SAMPLER_STEP_COUNT_OPTIONS = [4, 8, 16, 32] as const
export const SAMPLER_NOTE_REPEAT_OPTIONS = [1, 2, 4, 8] as const

export type SamplerStepCount = (typeof SAMPLER_STEP_COUNT_OPTIONS)[number]
export type SamplerNoteRepeatValue = (typeof SAMPLER_NOTE_REPEAT_OPTIONS)[number]

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

export const resolveBarDurationSec = (bpm: number): number => {
  const safeBpm = clamp(Number.isFinite(bpm) ? bpm : 120, 20, 400)
  return 240 / safeBpm
}

export const resolveStepDurationSec = (
  bpm: number,
  stepCount: SamplerStepCount,
): number => {
  const safeStepCount = SAMPLER_STEP_COUNT_OPTIONS.includes(stepCount) ? stepCount : 16
  return resolveBarDurationSec(bpm) / safeStepCount
}

export const resolveStepStartTimeSec = (
  stepIndex: number,
  bpm: number,
  stepCount: SamplerStepCount,
): number => {
  const safeStepIndex = Math.max(0, Math.floor(stepIndex))
  return safeStepIndex * resolveStepDurationSec(bpm, stepCount)
}

export const resolveRepeatOffsetsSec = (
  stepDurationSec: number,
  repeatCount: SamplerNoteRepeatValue,
  repeatRate: SamplerNoteRepeatValue,
): number[] => {
  const safeStepDurationSec = Math.max(0.01, stepDurationSec)
  const safeRate = SAMPLER_NOTE_REPEAT_OPTIONS.includes(repeatRate) ? repeatRate : 1
  const safeCount = SAMPLER_NOTE_REPEAT_OPTIONS.includes(repeatCount) ? repeatCount : 1
  const actualCount = Math.max(1, Math.min(safeCount, safeRate))
  const intervalSec = safeStepDurationSec / safeRate
  return Array.from({ length: actualCount }, (_, index) =>
    Math.min(safeStepDurationSec - 0.001, index * intervalSec),
  )
}
