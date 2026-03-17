import { newId } from '../spaghetti/utils/id'
import type { ReferenceTransformOverride } from './referenceManifest'

export type ReferenceTimelineChannelKey =
  | 'move-x'
  | 'move-y'
  | 'move-z'
  | 'rotate-x'
  | 'rotate-y'
  | 'rotate-z'
  | 'scale-x'
  | 'scale-y'
  | 'scale-z'
  | 'rotate-snap'

export type ReferenceTimelineMode = 'basic' | 'timeline'
export type ReferenceTimelineCycle = 'left-to-right' | 'bounce' | 'right-to-left'

export type ReferenceTimelineRange = {
  min: number
  max: number
}

export type ReferenceTimelineHandle = {
  t: number
  value: number
}

export type ReferenceTimelinePoint = {
  pointId: string
  t: number
  value: number
  inHandle: ReferenceTimelineHandle | null
  outHandle: ReferenceTimelineHandle | null
}

export type ReferenceTimelineConfig = {
  speed: number
  cycle: ReferenceTimelineCycle
  startedAtMs: number
  points: ReferenceTimelinePoint[]
}

export type ReferenceRotateSnapState = {
  enabled: boolean
  value: number
}

export const DEFAULT_REFERENCE_ROTATE_SNAP: ReferenceRotateSnapState = {
  enabled: false,
  value: 15,
}

export const DEFAULT_REFERENCE_TIMELINE_CYCLE_MS = 4000

const clamp = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const sortPoints = (points: ReferenceTimelinePoint[]): ReferenceTimelinePoint[] =>
  [...points].sort((left, right) => left.t - right.t)

const clonePoint = (point: ReferenceTimelinePoint): ReferenceTimelinePoint => ({
  pointId: point.pointId,
  t: point.t,
  value: point.value,
  inHandle: point.inHandle === null ? null : { ...point.inHandle },
  outHandle: point.outHandle === null ? null : { ...point.outHandle },
})

export const REFERENCE_TIMELINE_CHANNEL_DEFAULT_RANGE: Record<
  ReferenceTimelineChannelKey,
  ReferenceTimelineRange
> = {
  'move-x': { min: -300, max: 300 },
  'move-y': { min: -300, max: 300 },
  'move-z': { min: -300, max: 300 },
  'rotate-x': { min: -180, max: 180 },
  'rotate-y': { min: -180, max: 180 },
  'rotate-z': { min: -180, max: 180 },
  'scale-x': { min: 0.01, max: 10 },
  'scale-y': { min: 0.01, max: 10 },
  'scale-z': { min: 0.01, max: 10 },
  'rotate-snap': { min: 0.0001, max: 180 },
}

export const getReferenceTimelineDefaultRange = (
  channel: ReferenceTimelineChannelKey,
): ReferenceTimelineRange => REFERENCE_TIMELINE_CHANNEL_DEFAULT_RANGE[channel]

export const buildReferenceTimelineConfig = (
  baseValue: number,
  range: ReferenceTimelineRange,
  startedAtMs: number,
): ReferenceTimelineConfig => {
  const clampedBaseValue = clamp(baseValue, range.min, range.max)
  return {
    speed: 1,
    cycle: 'left-to-right',
    startedAtMs,
    points: [
      {
        pointId: newId('timeline-point'),
        t: 0,
        value: clampedBaseValue,
        inHandle: null,
        outHandle: {
          t: 0.18,
          value: clampedBaseValue,
        },
      },
      {
        pointId: newId('timeline-point'),
        t: 1,
        value: clampedBaseValue,
        inHandle: {
          t: 0.82,
          value: clampedBaseValue,
        },
        outHandle: null,
      },
    ],
  }
}

export const shiftReferenceTimelineConfig = (
  config: ReferenceTimelineConfig,
  delta: number,
  range: ReferenceTimelineRange,
): ReferenceTimelineConfig => {
  if (Math.abs(delta) < 0.000001) {
    return config
  }
  return {
    ...config,
    points: config.points.map((point) => ({
      ...clonePoint(point),
      value: clamp(point.value + delta, range.min, range.max),
      inHandle:
        point.inHandle === null
          ? null
          : {
              t: point.inHandle.t,
              value: clamp(point.inHandle.value + delta, range.min, range.max),
            },
      outHandle:
        point.outHandle === null
          ? null
          : {
              t: point.outHandle.t,
              value: clamp(point.outHandle.value + delta, range.min, range.max),
            },
    })),
  }
}

const evaluateCycleProgress = (
  config: ReferenceTimelineConfig,
  nowMs: number,
): number => {
  const speed = Math.max(config.speed, 0.0001)
  const elapsedMs = Math.max(nowMs - config.startedAtMs, 0)
  const normalized = (elapsedMs / (DEFAULT_REFERENCE_TIMELINE_CYCLE_MS / speed)) % 1
  if (config.cycle === 'left-to-right') {
    return normalized
  }
  if (config.cycle === 'right-to-left') {
    return 1 - normalized
  }
  const bounce = ((elapsedMs / (DEFAULT_REFERENCE_TIMELINE_CYCLE_MS / speed)) % 2 + 2) % 2
  return bounce <= 1 ? bounce : 2 - bounce
}

const sampleSegmentAt = (
  left: ReferenceTimelinePoint,
  right: ReferenceTimelinePoint,
  progress: number,
): { t: number; value: number } => {
  const p0 = { t: left.t, value: left.value }
  const p1 = left.outHandle ?? { t: left.t + (right.t - left.t) / 3, value: left.value }
  const p2 = right.inHandle ?? { t: right.t - (right.t - left.t) / 3, value: right.value }
  const p3 = { t: right.t, value: right.value }
  const oneMinus = 1 - progress
  const oneMinusSq = oneMinus * oneMinus
  const progressSq = progress * progress
  return {
    t:
      oneMinus * oneMinusSq * p0.t +
      3 * oneMinusSq * progress * p1.t +
      3 * oneMinus * progressSq * p2.t +
      progressSq * progress * p3.t,
    value:
      oneMinus * oneMinusSq * p0.value +
      3 * oneMinusSq * progress * p1.value +
      3 * oneMinus * progressSq * p2.value +
      progressSq * progress * p3.value,
  }
}

export const evaluateReferenceTimelineConfig = (
  config: ReferenceTimelineConfig,
  nowMs: number,
  range: ReferenceTimelineRange,
): number => {
  const points = sortPoints(config.points)
  if (points.length === 0) {
    return clamp(0, range.min, range.max)
  }
  if (points.length === 1) {
    return clamp(points[0]?.value ?? 0, range.min, range.max)
  }

  const normalizedProgress = evaluateCycleProgress(config, nowMs)
  for (let index = 0; index < points.length - 1; index += 1) {
    const left = points[index]
    const right = points[index + 1]
    if (left === undefined || right === undefined) {
      continue
    }
    if (normalizedProgress < left.t || normalizedProgress > right.t) {
      continue
    }
    let previous = sampleSegmentAt(left, right, 0)
    const steps = 40
    for (let stepIndex = 1; stepIndex <= steps; stepIndex += 1) {
      const stepProgress = stepIndex / steps
      const current = sampleSegmentAt(left, right, stepProgress)
      if (normalizedProgress <= current.t || stepIndex === steps) {
        const span = Math.max(current.t - previous.t, 0.000001)
        const localRatio = clamp((normalizedProgress - previous.t) / span, 0, 1)
        const interpolated =
          previous.value + (current.value - previous.value) * localRatio
        return clamp(interpolated, range.min, range.max)
      }
      previous = current
    }
  }

  return clamp(points.at(-1)?.value ?? 0, range.min, range.max)
}

export const evaluateReferenceTimelineChannelValue = (
  mode: ReferenceTimelineMode,
  config: ReferenceTimelineConfig | null | undefined,
  baseValue: number,
  range: ReferenceTimelineRange,
  nowMs: number,
): number => {
  if (mode !== 'timeline' || config === undefined || config === null) {
    return clamp(baseValue, range.min, range.max)
  }
  return evaluateReferenceTimelineConfig(config, nowMs, range)
}

export const getReferenceTransformOverrideAxisValue = (
  transformOverride: ReferenceTransformOverride | null | undefined,
  channel: ReferenceTimelineChannelKey,
): number => {
  switch (channel) {
    case 'move-x':
      return transformOverride?.position.x ?? 0
    case 'move-y':
      return transformOverride?.position.y ?? 0
    case 'move-z':
      return transformOverride?.position.z ?? 0
    case 'rotate-x':
      return transformOverride?.rotationDeg.x ?? 0
    case 'rotate-y':
      return transformOverride?.rotationDeg.y ?? 0
    case 'rotate-z':
      return transformOverride?.rotationDeg.z ?? 0
    case 'scale-x':
      return transformOverride?.scale.x ?? 1
    case 'scale-y':
      return transformOverride?.scale.y ?? 1
    case 'scale-z':
      return transformOverride?.scale.z ?? 1
    case 'rotate-snap':
      return DEFAULT_REFERENCE_ROTATE_SNAP.value
  }
}

export const setReferenceTransformOverrideAxisValue = (
  transformOverride: ReferenceTransformOverride | null | undefined,
  channel: ReferenceTimelineChannelKey,
  nextValue: number,
): ReferenceTransformOverride => {
  const current: ReferenceTransformOverride = transformOverride ?? {
    position: { x: 0, y: 0, z: 0 },
    rotationDeg: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  }

  switch (channel) {
    case 'move-x':
      return { ...current, position: { ...current.position, x: nextValue } }
    case 'move-y':
      return { ...current, position: { ...current.position, y: nextValue } }
    case 'move-z':
      return { ...current, position: { ...current.position, z: nextValue } }
    case 'rotate-x':
      return { ...current, rotationDeg: { ...current.rotationDeg, x: nextValue } }
    case 'rotate-y':
      return { ...current, rotationDeg: { ...current.rotationDeg, y: nextValue } }
    case 'rotate-z':
      return { ...current, rotationDeg: { ...current.rotationDeg, z: nextValue } }
    case 'scale-x':
      return { ...current, scale: { ...current.scale, x: nextValue } }
    case 'scale-y':
      return { ...current, scale: { ...current.scale, y: nextValue } }
    case 'scale-z':
      return { ...current, scale: { ...current.scale, z: nextValue } }
    case 'rotate-snap':
      return current
  }
}

export const evaluateReferenceTransformOverrideWithTimelines = (
  transformOverride: ReferenceTransformOverride | null | undefined,
  nowMs: number,
  getMode: (channel: Exclude<ReferenceTimelineChannelKey, 'rotate-snap'>) => ReferenceTimelineMode,
  getConfig: (
    channel: Exclude<ReferenceTimelineChannelKey, 'rotate-snap'>,
  ) => ReferenceTimelineConfig | null | undefined,
  getRange: (
    channel: Exclude<ReferenceTimelineChannelKey, 'rotate-snap'>,
  ) => ReferenceTimelineRange,
): ReferenceTransformOverride => {
  const base = transformOverride ?? {
    position: { x: 0, y: 0, z: 0 },
    rotationDeg: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  }

  return {
    position: {
      x: evaluateReferenceTimelineChannelValue(
        getMode('move-x'),
        getConfig('move-x'),
        base.position.x,
        getRange('move-x'),
        nowMs,
      ),
      y: evaluateReferenceTimelineChannelValue(
        getMode('move-y'),
        getConfig('move-y'),
        base.position.y,
        getRange('move-y'),
        nowMs,
      ),
      z: evaluateReferenceTimelineChannelValue(
        getMode('move-z'),
        getConfig('move-z'),
        base.position.z,
        getRange('move-z'),
        nowMs,
      ),
    },
    rotationDeg: {
      x: evaluateReferenceTimelineChannelValue(
        getMode('rotate-x'),
        getConfig('rotate-x'),
        base.rotationDeg.x,
        getRange('rotate-x'),
        nowMs,
      ),
      y: evaluateReferenceTimelineChannelValue(
        getMode('rotate-y'),
        getConfig('rotate-y'),
        base.rotationDeg.y,
        getRange('rotate-y'),
        nowMs,
      ),
      z: evaluateReferenceTimelineChannelValue(
        getMode('rotate-z'),
        getConfig('rotate-z'),
        base.rotationDeg.z,
        getRange('rotate-z'),
        nowMs,
      ),
    },
    scale: {
      x: evaluateReferenceTimelineChannelValue(
        getMode('scale-x'),
        getConfig('scale-x'),
        base.scale.x,
        getRange('scale-x'),
        nowMs,
      ),
      y: evaluateReferenceTimelineChannelValue(
        getMode('scale-y'),
        getConfig('scale-y'),
        base.scale.y,
        getRange('scale-y'),
        nowMs,
      ),
      z: evaluateReferenceTimelineChannelValue(
        getMode('scale-z'),
        getConfig('scale-z'),
        base.scale.z,
        getRange('scale-z'),
        nowMs,
      ),
    },
  }
}
