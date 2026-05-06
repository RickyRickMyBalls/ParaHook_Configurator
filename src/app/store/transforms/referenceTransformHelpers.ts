import { newId } from '../../spaghetti/utils/id'
import type { LightSpec } from '../../../shared/viewSettingsTypes'
import type { ReferenceTransformOverride } from '../../references/referenceManifest'
import {
  DEFAULT_REFERENCE_ROTATE_SNAP,
  getReferenceTimelineDefaultRange,
  getReferenceTransformOverrideAxisValue,
  shiftReferenceTimelineConfig,
  type ReferenceTimelineChannelKey,
  type ReferenceTimelineConfig,
  type ReferenceTimelineMode,
  type ReferenceTimelineRange,
} from '../../references/referenceTimeline'
import { useUiPrefsStore } from '../uiPrefsStore'
import type {
  ActiveContentObjectTransformSession,
  ActiveEnvironmentLightTransformSession,
  ActiveReferenceTransformSession,
  ActiveViewerTransformSession,
  ReferenceTransformHistoryEntry,
  ReferenceTransformHistoryEntryKind,
  ReferenceTransformHistoryVector,
  ReferenceTransformMode,
  ReferenceTransformSnapAxis,
  ReferenceTransformSnapAxisValues,
  ReferenceTransformSnapMode,
  ReferenceTransformSnapSetting,
  ReferenceTransformSnapState,
  ReferenceWorkspaceState,
  ViewerTransformTarget,
} from '../useAppStore'

type LegacyReferenceTransformSnapSetting = {
  enabled?: boolean
  value?: number
}

type LegacyReferenceTransformHistoryEntry = Omit<
  ReferenceTransformHistoryEntry,
  'delta' | 'after' | 'transformAfter'
> & {
  value: ReferenceTransformHistoryVector
}

type ReferenceTransformHistoryEntryDraft = Omit<
  ReferenceTransformHistoryEntry,
  'transformAfter'
>

type ReferenceTransformHistoryEntryLike =
  | ReferenceTransformHistoryEntry
  | ReferenceTransformHistoryEntryDraft
  | LegacyReferenceTransformHistoryEntry

export const DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE: ReferenceTransformSnapState = {
  translate: {
    enabled: false,
    xyzLocked: true,
    values: { x: 10, y: 10, z: 10 },
  },
  rotate: {
    enabled: DEFAULT_REFERENCE_ROTATE_SNAP.enabled,
    xyzLocked: true,
    values: {
      x: DEFAULT_REFERENCE_ROTATE_SNAP.value,
      y: DEFAULT_REFERENCE_ROTATE_SNAP.value,
      z: DEFAULT_REFERENCE_ROTATE_SNAP.value,
    },
  },
  scale: {
    enabled: false,
    xyzLocked: true,
    values: { x: 0.25, y: 0.25, z: 0.25 },
  },
}

export const buildDefaultReferenceTransformOverride = (): ReferenceTransformOverride => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

export const environmentLightSupportsPosition = (light: Pick<LightSpec, 'type'>): boolean =>
  light.type === 'directional' || light.type === 'point' || light.type === 'spot'

export const buildEnvironmentLightTransformOverride = (
  light: LightSpec,
): ReferenceTransformOverride => ({
  position: { ...(light.position ?? { x: 0, y: 5, z: 0 }) },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

export const selectEnvironmentLightById = (lightId: string): LightSpec | null =>
  useUiPrefsStore.getState().view.lighting.lights.find((light) => light.id === lightId) ?? null

export const updateEnvironmentLightPosition = (
  lightId: string,
  transformOverride: ReferenceTransformOverride,
): void => {
  if (selectEnvironmentLightById(lightId) === null) {
    return
  }
  useUiPrefsStore.getState().updateLight(lightId, {
    position: { ...transformOverride.position },
  })
}

export const cloneReferenceTransformSnapState = (
  value: ReferenceTransformSnapState = DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE,
): ReferenceTransformSnapState => ({
  translate: {
    ...value.translate,
    values: { ...value.translate.values },
  },
  rotate: {
    ...value.rotate,
    values: { ...value.rotate.values },
  },
  scale: {
    ...value.scale,
    values: { ...value.scale.values },
  },
})

const normalizeReferenceTransformSnapSetting = (
  value: ReferenceTransformSnapSetting | LegacyReferenceTransformSnapSetting | undefined,
  fallback: ReferenceTransformSnapSetting,
): ReferenceTransformSnapSetting => {
  if (
    value !== undefined &&
    typeof value === 'object' &&
    'values' in value &&
    value.values !== null &&
    typeof value.values === 'object'
  ) {
    const values = value.values as Partial<Record<ReferenceTransformSnapAxis, unknown>>
    return {
      enabled: value.enabled ?? fallback.enabled,
      xyzLocked: value.xyzLocked ?? true,
      values: {
        x: typeof values.x === 'number' ? values.x : fallback.values.x,
        y: typeof values.y === 'number' ? values.y : fallback.values.y,
        z: typeof values.z === 'number' ? values.z : fallback.values.z,
      },
    }
  }
  const legacySetting = value as LegacyReferenceTransformSnapSetting | undefined
  const legacyValue =
    typeof legacySetting?.value === 'number' && Number.isFinite(legacySetting.value)
      ? legacySetting.value
      : fallback.values.x
  return {
    enabled:
      value !== undefined && typeof value === 'object' && typeof value.enabled === 'boolean'
        ? value.enabled
        : fallback.enabled,
    xyzLocked: true,
    values: {
      x: legacyValue,
      y: legacyValue,
      z: legacyValue,
    },
  }
}

export const normalizeReferenceTransformSnapState = (
  value:
    | Partial<
        Record<
          ReferenceTransformSnapMode,
          ReferenceTransformSnapSetting | LegacyReferenceTransformSnapSetting
        >
      >
    | undefined,
): ReferenceTransformSnapState => ({
  translate: normalizeReferenceTransformSnapSetting(
    value?.translate,
    DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE.translate,
  ),
  rotate: normalizeReferenceTransformSnapSetting(
    value?.rotate,
    DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE.rotate,
  ),
  scale: normalizeReferenceTransformSnapSetting(
    value?.scale,
    DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE.scale,
  ),
})

export const setAllReferenceTransformSnapAxes = (
  value: number,
): ReferenceTransformSnapAxisValues => ({
  x: value,
  y: value,
  z: value,
})

export const scaleReferenceTransformSnapAxisValues = (
  currentValues: ReferenceTransformSnapAxisValues,
  axis: ReferenceTransformSnapAxis,
  nextValue: number,
): ReferenceTransformSnapAxisValues => {
  const baseline = currentValues[axis]
  if (Math.abs(baseline) < 0.000001) {
    return {
      ...currentValues,
      [axis]: nextValue,
    }
  }
  const scaleFactor = nextValue / baseline
  return {
    x:
      axis === 'x'
        ? nextValue
        : Math.abs(currentValues.x) < 0.000001
          ? 0
          : Number((currentValues.x * scaleFactor).toFixed(4)),
    y:
      axis === 'y'
        ? nextValue
        : Math.abs(currentValues.y) < 0.000001
          ? 0
          : Number((currentValues.y * scaleFactor).toFixed(4)),
    z:
      axis === 'z'
        ? nextValue
        : Math.abs(currentValues.z) < 0.000001
          ? 0
          : Number((currentValues.z * scaleFactor).toFixed(4)),
  }
}

export const getReferenceTransformSnapDriverValue = (
  value: ReferenceTransformSnapSetting,
): number => value.values.x

export const cloneReferenceTransformVector = (
  value: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => ({
  x: value.x,
  y: value.y,
  z: value.z,
})

export const addReferenceTransformVectors = (
  left: ReferenceTransformHistoryVector,
  right: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => ({
  x: left.x + right.x,
  y: left.y + right.y,
  z: left.z + right.z,
})

export const subtractReferenceTransformVectors = (
  left: ReferenceTransformHistoryVector,
  right: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => ({
  x: left.x - right.x,
  y: left.y - right.y,
  z: left.z - right.z,
})

const buildReferenceTransformHistoryIdentityVector = (
  kind: ReferenceTransformHistoryEntryKind,
): ReferenceTransformHistoryVector =>
  kind === 'scale' ? { x: 1, y: 1, z: 1 } : { x: 0, y: 0, z: 0 }

const getReferenceTransformHistoryVectorRange = (
  kind: ReferenceTransformHistoryEntryKind,
): { min: number; max: number } => {
  switch (kind) {
    case 'move':
      return { min: -300, max: 300 }
    case 'rotate':
      return { min: -180, max: 180 }
    case 'scale':
      return { min: 0.01, max: 10 }
  }
}

const clampReferenceTransformHistoryVector = (
  kind: ReferenceTransformHistoryEntryKind,
  value: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryVector => {
  const range = getReferenceTransformHistoryVectorRange(kind)
  return {
    x: Math.min(range.max, Math.max(range.min, value.x)),
    y: Math.min(range.max, Math.max(range.min, value.y)),
    z: Math.min(range.max, Math.max(range.min, value.z)),
  }
}

export const cloneReferenceTransformHistoryEntry = (
  entry: ReferenceTransformHistoryEntry,
): ReferenceTransformHistoryEntry => ({
  ...entry,
  delta: cloneReferenceTransformVector(entry.delta),
  after: cloneReferenceTransformVector(entry.after),
  transformAfter:
    cloneReferenceTransformOverride(entry.transformAfter) ??
    buildDefaultReferenceTransformOverride(),
})

export const cloneReferenceTransformOverride = (
  value: ReferenceTransformOverride | null,
): ReferenceTransformOverride | null =>
  value === null
    ? null
    : {
        position: { ...value.position },
        rotationDeg: { ...value.rotationDeg },
        scale: { ...value.scale },
      }

export const cloneActiveReferenceTransformSession = (
  value: ActiveReferenceTransformSession | null,
): ActiveReferenceTransformSession | null =>
  value === null
    ? null
    : {
        referenceId: value.referenceId,
        sessionId: value.sessionId,
        sessionOrdinal: value.sessionOrdinal,
        mode: value.mode,
        space: value.space,
        shellActive: value.shellActive,
        entryActive: value.entryActive,
        activeHandle: value.activeHandle === null ? null : { ...value.activeHandle },
        historyScrubIndex: value.historyScrubIndex,
        draftTransform:
          cloneReferenceTransformOverride(value.draftTransform) ??
          buildDefaultReferenceTransformOverride(),
        entryOrigin: cloneReferenceTransformOverride(value.entryOrigin),
      }

export const cloneActiveContentObjectTransformSession = (
  value: ActiveContentObjectTransformSession | null,
): ActiveContentObjectTransformSession | null =>
  value === null
    ? null
    : {
        objectId: value.objectId,
        sessionId: value.sessionId,
        sessionOrdinal: value.sessionOrdinal,
        mode: value.mode,
        space: value.space,
        shellActive: value.shellActive,
        entryActive: value.entryActive,
        activeHandle: value.activeHandle === null ? null : { ...value.activeHandle },
        historyScrubIndex: value.historyScrubIndex,
        draftTransform:
          cloneReferenceTransformOverride(value.draftTransform) ??
          buildDefaultReferenceTransformOverride(),
        entryOrigin: cloneReferenceTransformOverride(value.entryOrigin),
      }

export const cloneActiveEnvironmentLightTransformSession = (
  value: ActiveEnvironmentLightTransformSession | null,
): ActiveEnvironmentLightTransformSession | null =>
  value === null
    ? null
    : {
        lightId: value.lightId,
        sessionId: value.sessionId,
        sessionOrdinal: value.sessionOrdinal,
        mode: 'translate',
        space: value.space,
        shellActive: value.shellActive,
        entryActive: value.entryActive,
        activeHandle: value.activeHandle === null ? null : { ...value.activeHandle },
        historyScrubIndex: value.historyScrubIndex,
        draftTransform:
          cloneReferenceTransformOverride(value.draftTransform) ??
          buildDefaultReferenceTransformOverride(),
        entryOrigin: cloneReferenceTransformOverride(value.entryOrigin),
      }

export const selectActiveViewerTransformTarget = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    | 'activeReferenceTransformSession'
    | 'activeContentObjectTransformSession'
    | 'activeEnvironmentLightTransformSession'
  >,
): ViewerTransformTarget | null => {
  if (referenceWorkspace.activeEnvironmentLightTransformSession !== null) {
    return {
      kind: 'environment-light',
      lightId: referenceWorkspace.activeEnvironmentLightTransformSession.lightId,
    }
  }
  if (referenceWorkspace.activeContentObjectTransformSession !== null) {
    return {
      kind: 'content-object',
      objectId: referenceWorkspace.activeContentObjectTransformSession.objectId,
    }
  }
  if (referenceWorkspace.activeReferenceTransformSession !== null) {
    return {
      kind: 'reference',
      referenceId: referenceWorkspace.activeReferenceTransformSession.referenceId,
    }
  }
  return null
}

export const selectActiveViewerTransformSession = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    | 'activeReferenceTransformSession'
    | 'activeContentObjectTransformSession'
    | 'activeEnvironmentLightTransformSession'
  >,
): ActiveViewerTransformSession | null => {
  const activeEnvironmentLightSession = cloneActiveEnvironmentLightTransformSession(
    referenceWorkspace.activeEnvironmentLightTransformSession,
  )
  if (activeEnvironmentLightSession !== null) {
    return {
      targetKind: 'environment-light',
      targetId: activeEnvironmentLightSession.lightId,
      sessionId: activeEnvironmentLightSession.sessionId,
      sessionOrdinal: activeEnvironmentLightSession.sessionOrdinal,
      mode: activeEnvironmentLightSession.mode,
      space: activeEnvironmentLightSession.space,
      shellActive: activeEnvironmentLightSession.shellActive,
      entryActive: activeEnvironmentLightSession.entryActive,
      activeHandle: activeEnvironmentLightSession.activeHandle,
      historyScrubIndex: activeEnvironmentLightSession.historyScrubIndex,
      draftTransform: activeEnvironmentLightSession.draftTransform,
      entryOrigin: activeEnvironmentLightSession.entryOrigin,
    }
  }
  const activeContentObjectSession = cloneActiveContentObjectTransformSession(
    referenceWorkspace.activeContentObjectTransformSession,
  )
  if (activeContentObjectSession !== null) {
    return {
      targetKind: 'content-object',
      targetId: activeContentObjectSession.objectId,
      sessionId: activeContentObjectSession.sessionId,
      sessionOrdinal: activeContentObjectSession.sessionOrdinal,
      mode: activeContentObjectSession.mode,
      space: activeContentObjectSession.space,
      shellActive: activeContentObjectSession.shellActive,
      entryActive: activeContentObjectSession.entryActive,
      activeHandle: activeContentObjectSession.activeHandle,
      historyScrubIndex: activeContentObjectSession.historyScrubIndex,
      draftTransform: activeContentObjectSession.draftTransform,
      entryOrigin: activeContentObjectSession.entryOrigin,
    }
  }
  const activeReferenceSession = cloneActiveReferenceTransformSession(
    referenceWorkspace.activeReferenceTransformSession,
  )
  if (activeReferenceSession !== null) {
    return {
      targetKind: 'reference',
      targetId: activeReferenceSession.referenceId,
      sessionId: activeReferenceSession.sessionId,
      sessionOrdinal: activeReferenceSession.sessionOrdinal,
      mode: activeReferenceSession.mode,
      space: activeReferenceSession.space,
      shellActive: activeReferenceSession.shellActive,
      entryActive: activeReferenceSession.entryActive,
      activeHandle: activeReferenceSession.activeHandle,
      historyScrubIndex: activeReferenceSession.historyScrubIndex,
      draftTransform: activeReferenceSession.draftTransform,
      entryOrigin: activeReferenceSession.entryOrigin,
    }
  }
  return null
}

export const selectActiveViewerTransformHistoryEntries = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    | 'activeReferenceTransformSession'
    | 'activeContentObjectTransformSession'
    | 'activeEnvironmentLightTransformSession'
    | 'transformHistoryByReferenceId'
    | 'transformHistoryByObjectId'
    | 'transformHistoryByEnvironmentLightId'
  >,
): ReferenceTransformHistoryEntry[] => {
  const activeTarget = selectActiveViewerTransformTarget(referenceWorkspace)
  if (activeTarget === null) {
    return []
  }
  if (activeTarget.kind === 'environment-light') {
    return referenceWorkspace.transformHistoryByEnvironmentLightId[activeTarget.lightId] ?? []
  }
  return activeTarget.kind === 'reference'
    ? referenceWorkspace.transformHistoryByReferenceId[activeTarget.referenceId] ?? []
    : referenceWorkspace.transformHistoryByObjectId[activeTarget.objectId] ?? []
}

export const selectActiveViewerTransformSnapState = (
  referenceWorkspace: Pick<
    ReferenceWorkspaceState,
    | 'activeReferenceTransformSession'
    | 'activeContentObjectTransformSession'
    | 'activeEnvironmentLightTransformSession'
    | 'transformSnapByReferenceId'
    | 'transformSnapByObjectId'
  >,
): ReferenceTransformSnapState => {
  const activeTarget = selectActiveViewerTransformTarget(referenceWorkspace)
  if (activeTarget === null || activeTarget.kind === 'environment-light') {
    return DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
  }
  return activeTarget.kind === 'reference'
    ? referenceWorkspace.transformSnapByReferenceId[activeTarget.referenceId] ??
        DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
    : referenceWorkspace.transformSnapByObjectId[activeTarget.objectId] ??
        DEFAULT_REFERENCE_TRANSFORM_SNAP_STATE
}

export const areReferenceTransformVectorsEqual = (
  left: ReferenceTransformHistoryVector,
  right: ReferenceTransformHistoryVector,
): boolean => left.x === right.x && left.y === right.y && left.z === right.z

export const areReferenceTransformOverridesEqual = (
  left: ReferenceTransformOverride | null,
  right: ReferenceTransformOverride | null,
): boolean => {
  if (left === right) {
    return true
  }
  if (left === null || right === null) {
    return false
  }
  return (
    areReferenceTransformVectorsEqual(left.position, right.position) &&
    areReferenceTransformVectorsEqual(left.rotationDeg, right.rotationDeg) &&
    areReferenceTransformVectorsEqual(left.scale, right.scale)
  )
}

const areReferenceTransformHistoryEntriesEqual = (
  left: ReferenceTransformHistoryEntry,
  right: ReferenceTransformHistoryEntry,
): boolean =>
  left.entryId === right.entryId &&
  left.sessionId === right.sessionId &&
  left.sessionOrdinal === right.sessionOrdinal &&
  left.kind === right.kind &&
  left.locked === right.locked &&
  areReferenceTransformVectorsEqual(left.delta, right.delta) &&
  areReferenceTransformVectorsEqual(left.after, right.after) &&
  areReferenceTransformOverridesEqual(left.transformAfter, right.transformAfter)

export const areReferenceTransformHistoryEntryArraysEqual = (
  left: readonly ReferenceTransformHistoryEntry[],
  right: readonly ReferenceTransformHistoryEntry[],
): boolean =>
  left.length === right.length &&
  left.every((entry, index) => {
    const other = right[index]
    return other !== undefined && areReferenceTransformHistoryEntriesEqual(entry, other)
  })

export const getReferenceTransformHistoryEntryAfterValue = (
  transformOverride: ReferenceTransformOverride | null,
  kind: ReferenceTransformHistoryEntryKind,
): ReferenceTransformHistoryVector => {
  const current = transformOverride ?? buildDefaultReferenceTransformOverride()
  switch (kind) {
    case 'move':
      return cloneReferenceTransformVector(current.position)
    case 'rotate':
      return cloneReferenceTransformVector(current.rotationDeg)
    case 'scale':
      return cloneReferenceTransformVector(current.scale)
  }
}

const isLegacyReferenceTransformHistoryEntry = (
  entry: ReferenceTransformHistoryEntryLike,
): entry is LegacyReferenceTransformHistoryEntry => 'value' in entry

const buildReferenceTransformHistoryOverrideAfter = (
  currentTransform: ReferenceTransformOverride,
  kind: ReferenceTransformHistoryEntryKind,
  after: ReferenceTransformHistoryVector,
): ReferenceTransformOverride => {
  const nextTransform =
    cloneReferenceTransformOverride(currentTransform) ?? buildDefaultReferenceTransformOverride()
  switch (kind) {
    case 'move':
      nextTransform.position = cloneReferenceTransformVector(after)
      break
    case 'rotate':
      nextTransform.rotationDeg = cloneReferenceTransformVector(after)
      break
    case 'scale':
      nextTransform.scale = cloneReferenceTransformVector(after)
      break
  }
  return nextTransform
}

const normalizeReferenceTransformHistoryEntriesFromBase = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  baseTransform: ReferenceTransformOverride,
): ReferenceTransformHistoryEntry[] => {
  let currentTransform =
    cloneReferenceTransformOverride(baseTransform) ?? buildDefaultReferenceTransformOverride()
  return entries.map((entry) => {
    const before = getReferenceTransformHistoryEntryAfterValue(currentTransform, entry.kind)
    const after = isLegacyReferenceTransformHistoryEntry(entry)
      ? clampReferenceTransformHistoryVector(entry.kind, entry.value)
      : clampReferenceTransformHistoryVector(
          entry.kind,
          addReferenceTransformVectors(before, entry.delta),
        )
    currentTransform = buildReferenceTransformHistoryOverrideAfter(
      currentTransform,
      entry.kind,
      after,
    )
    return {
      entryId: entry.entryId,
      sessionId: entry.sessionId,
      sessionOrdinal: entry.sessionOrdinal,
      kind: entry.kind,
      delta: subtractReferenceTransformVectors(after, before),
      after,
      transformAfter:
        cloneReferenceTransformOverride(currentTransform) ??
        buildDefaultReferenceTransformOverride(),
      locked: entry.locked,
    }
  })
}

export const normalizeReferenceTransformHistoryEntries = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): ReferenceTransformHistoryEntry[] =>
  normalizeReferenceTransformHistoryEntriesFromBase(
    entries,
    buildDefaultReferenceTransformOverride(),
  )

export const resolveReferenceTransformHistoryKind = (
  mode: ReferenceTransformMode,
): ReferenceTransformHistoryEntryKind => {
  switch (mode) {
    case 'rotate':
      return 'rotate'
    case 'scale':
      return 'scale'
    case 'translate':
      return 'move'
  }
}

export const getNextReferenceTransformSessionOrdinal = (
  entries: readonly ReferenceTransformHistoryEntry[],
): number => {
  const maxSessionOrdinal = entries.reduce(
    (currentMax, entry) => Math.max(currentMax, entry.sessionOrdinal),
    0,
  )
  return maxSessionOrdinal + 1
}

export const clampReferenceTransformHistoryScrubIndex = (
  scrubIndex: number,
  entryCount: number,
): number => Math.min(entryCount, Math.max(0, Math.trunc(scrubIndex)))

export const getReferenceTransformHistoryLatestScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): number => normalizeReferenceTransformHistoryEntries(entries).length

export const resolveReferenceTransformHistoryScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number | null | undefined,
): number => {
  const latestScrubIndex = getReferenceTransformHistoryLatestScrubIndex(entries)
  if (scrubIndex === null || scrubIndex === undefined || !Number.isFinite(scrubIndex)) {
    return latestScrubIndex
  }
  return clampReferenceTransformHistoryScrubIndex(scrubIndex, latestScrubIndex)
}

export const getReferenceTransformHistoryEntriesThroughScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  return normalizedEntries
    .slice(0, clampReferenceTransformHistoryScrubIndex(scrubIndex, normalizedEntries.length))
    .map(cloneReferenceTransformHistoryEntry)
}

export const getReferenceTransformHistoryTransformAtScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
): ReferenceTransformOverride => {
  const effectiveEntries = getReferenceTransformHistoryEntriesThroughScrubIndex(
    entries,
    scrubIndex,
  )
  const lastEntry = effectiveEntries.at(-1)
  return lastEntry === undefined
    ? buildDefaultReferenceTransformOverride()
    : cloneReferenceTransformOverride(lastEntry.transformAfter) ??
        buildDefaultReferenceTransformOverride()
}

export const normalizeEnvironmentLightTransformHistoryEntries = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  baseTransform: ReferenceTransformOverride,
): ReferenceTransformHistoryEntry[] =>
  normalizeReferenceTransformHistoryEntriesFromBase(entries, baseTransform)

export const getEnvironmentLightTransformHistoryTransformAtScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
  baseTransform: ReferenceTransformOverride,
): ReferenceTransformOverride => {
  const effectiveEntries = normalizeEnvironmentLightTransformHistoryEntries(
    entries,
    baseTransform,
  ).slice(0, clampReferenceTransformHistoryScrubIndex(scrubIndex, entries.length))
  const lastEntry = effectiveEntries.at(-1)
  return (
    cloneReferenceTransformOverride(lastEntry?.transformAfter ?? baseTransform) ??
    buildDefaultReferenceTransformOverride()
  )
}

export const applyEnvironmentLightTransformHistoryEntriesToOverride = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  baseTransform: ReferenceTransformOverride,
): ReferenceTransformOverride => {
  const normalizedEntries = normalizeEnvironmentLightTransformHistoryEntries(
    entries,
    baseTransform,
  )
  const lastEntry = normalizedEntries.at(-1)
  return (
    cloneReferenceTransformOverride(lastEntry?.transformAfter ?? baseTransform) ??
    buildDefaultReferenceTransformOverride()
  )
}

export const insertReferenceTransformHistoryEntryAtScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
  sessionId: string,
  sessionOrdinal: number,
  kind: ReferenceTransformHistoryEntryKind,
  after: ReferenceTransformHistoryVector,
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  const clampedScrubIndex = clampReferenceTransformHistoryScrubIndex(
    scrubIndex,
    normalizedEntries.length,
  )
  const previousTransform = getReferenceTransformHistoryTransformAtScrubIndex(
    normalizedEntries,
    clampedScrubIndex,
  )
  const previousAfter = getReferenceTransformHistoryEntryAfterValue(previousTransform, kind)
  const nextAfter = clampReferenceTransformHistoryVector(kind, after)
  if (areReferenceTransformVectorsEqual(previousAfter, nextAfter)) {
    return normalizedEntries.map(cloneReferenceTransformHistoryEntry)
  }
  const nextDelta = subtractReferenceTransformVectors(nextAfter, previousAfter)
  const insertedEntry: ReferenceTransformHistoryEntryDraft = {
    entryId: newId('reference-transform-history'),
    sessionId,
    sessionOrdinal,
    kind,
    delta: nextDelta,
    after: nextAfter,
    locked: false,
  }
  return normalizeReferenceTransformHistoryEntries([
    ...normalizedEntries.slice(0, clampedScrubIndex),
    insertedEntry,
    ...normalizedEntries.slice(clampedScrubIndex),
  ])
}

export const insertEnvironmentLightTransformHistoryEntryAtScrubIndex = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  scrubIndex: number,
  sessionId: string,
  sessionOrdinal: number,
  after: ReferenceTransformHistoryVector,
  baseTransform: ReferenceTransformOverride,
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeEnvironmentLightTransformHistoryEntries(
    entries,
    baseTransform,
  )
  const clampedScrubIndex = clampReferenceTransformHistoryScrubIndex(
    scrubIndex,
    normalizedEntries.length,
  )
  const previousTransform = getEnvironmentLightTransformHistoryTransformAtScrubIndex(
    normalizedEntries,
    clampedScrubIndex,
    baseTransform,
  )
  const previousAfter = cloneReferenceTransformVector(previousTransform.position)
  const nextAfter = clampReferenceTransformHistoryVector('move', after)
  if (areReferenceTransformVectorsEqual(previousAfter, nextAfter)) {
    return normalizedEntries.map(cloneReferenceTransformHistoryEntry)
  }
  const insertedEntry: ReferenceTransformHistoryEntryDraft = {
    entryId: newId('reference-transform-history'),
    sessionId,
    sessionOrdinal,
    kind: 'move',
    delta: subtractReferenceTransformVectors(nextAfter, previousAfter),
    after: nextAfter,
    locked: false,
  }
  return normalizeEnvironmentLightTransformHistoryEntries(
    [
      ...normalizedEntries.slice(0, clampedScrubIndex),
      insertedEntry,
      ...normalizedEntries.slice(clampedScrubIndex),
    ],
    baseTransform,
  )
}

export const mergeReferenceTransformHistoryEntries = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  if (normalizedEntries.length <= 1) {
    return normalizedEntries.map(cloneReferenceTransformHistoryEntry)
  }
  const preservedEntries: Array<{
    sortIndex: number
    entry: ReferenceTransformHistoryEntryLike
  }> = []
  const unlockedDeltaByKind = new Map<
    ReferenceTransformHistoryEntryKind,
    ReferenceTransformHistoryVector
  >()
  const lastUnlockedEntryByKind = new Map<
    ReferenceTransformHistoryEntryKind,
    ReferenceTransformHistoryEntry
  >()
  normalizedEntries.forEach((entry, index) => {
    if (entry.locked) {
      preservedEntries.push({
        sortIndex: index,
        entry: cloneReferenceTransformHistoryEntry(entry),
      })
      return
    }
    const currentDelta = unlockedDeltaByKind.get(entry.kind) ?? { x: 0, y: 0, z: 0 }
    unlockedDeltaByKind.set(entry.kind, addReferenceTransformVectors(currentDelta, entry.delta))
    lastUnlockedEntryByKind.set(entry.kind, entry)
  })
  for (const [kind, delta] of unlockedDeltaByKind.entries()) {
    const template = lastUnlockedEntryByKind.get(kind)
    if (template === undefined) {
      continue
    }
    preservedEntries.push({
      sortIndex: normalizedEntries.findIndex((entry) => entry.entryId === template.entryId),
      entry: {
        entryId: template.entryId,
        sessionId: template.sessionId,
        sessionOrdinal: template.sessionOrdinal,
        kind,
        delta: cloneReferenceTransformVector(delta),
        after: buildReferenceTransformHistoryIdentityVector(kind),
        locked: false,
      },
    })
  }
  return normalizeReferenceTransformHistoryEntries(
    preservedEntries
      .sort((left, right) => left.sortIndex - right.sortIndex)
      .map(({ entry }) => entry),
  )
}

export const mergeEnvironmentLightTransformHistoryEntries = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
  baseTransform: ReferenceTransformOverride,
): ReferenceTransformHistoryEntry[] => {
  const normalizedEntries = normalizeEnvironmentLightTransformHistoryEntries(
    entries,
    baseTransform,
  )
  if (normalizedEntries.length <= 1) {
    return normalizedEntries.map(cloneReferenceTransformHistoryEntry)
  }
  const preservedEntries: Array<{
    sortIndex: number
    entry: ReferenceTransformHistoryEntryLike
  }> = []
  let unlockedDelta: ReferenceTransformHistoryVector | null = null
  let lastUnlockedEntry: ReferenceTransformHistoryEntry | null = null
  for (let index = 0; index < normalizedEntries.length; index += 1) {
    const entry = normalizedEntries[index]!
    if (entry.locked) {
      preservedEntries.push({
        sortIndex: index,
        entry: cloneReferenceTransformHistoryEntry(entry),
      })
      continue
    }
    unlockedDelta =
      unlockedDelta === null
        ? cloneReferenceTransformVector(entry.delta)
        : addReferenceTransformVectors(unlockedDelta, entry.delta)
    lastUnlockedEntry = entry
  }
  if (unlockedDelta !== null && lastUnlockedEntry !== null) {
    preservedEntries.push({
      sortIndex: normalizedEntries.findIndex(
        (entry) => entry.entryId === lastUnlockedEntry.entryId,
      ),
      entry: {
        entryId: lastUnlockedEntry.entryId,
        sessionId: lastUnlockedEntry.sessionId,
        sessionOrdinal: lastUnlockedEntry.sessionOrdinal,
        kind: 'move',
        delta: cloneReferenceTransformVector(unlockedDelta),
        after: cloneReferenceTransformVector(baseTransform.position),
        locked: false,
      },
    })
  }
  return normalizeEnvironmentLightTransformHistoryEntries(
    preservedEntries
      .sort((left, right) => left.sortIndex - right.sortIndex)
      .map(({ entry }) => entry),
    baseTransform,
  )
}

export const applyReferenceTransformHistoryEntriesToOverride = (
  entries: readonly ReferenceTransformHistoryEntryLike[],
): ReferenceTransformOverride => {
  const normalizedEntries = normalizeReferenceTransformHistoryEntries(entries)
  const lastEntry = normalizedEntries.at(-1)
  return lastEntry === undefined
    ? buildDefaultReferenceTransformOverride()
    : cloneReferenceTransformOverride(lastEntry.transformAfter) ??
        buildDefaultReferenceTransformOverride()
}

const getReferenceChannelClampRange = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
  channel: ReferenceTimelineChannelKey,
): ReferenceTimelineRange =>
  referenceWorkspace.channelClampRangeByReferenceId[referenceId]?.[channel] ??
  getReferenceTimelineDefaultRange(channel)

export const getReferenceTimelineMode = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
  channel: ReferenceTimelineChannelKey,
): ReferenceTimelineMode =>
  referenceWorkspace.timelineModeByReferenceId[referenceId]?.[channel] ?? 'basic'

export const getReferenceTransformSnapState = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
): ReferenceTransformSnapState =>
  normalizeReferenceTransformSnapState(referenceWorkspace.transformSnapByReferenceId[referenceId])

export const getContentObjectTransformSnapState = (
  referenceWorkspace: ReferenceWorkspaceState,
  objectId: string,
): ReferenceTransformSnapState =>
  normalizeReferenceTransformSnapState(referenceWorkspace.transformSnapByObjectId[objectId])

export const applyReferenceTransformTimelineDeltas = (
  referenceWorkspace: ReferenceWorkspaceState,
  referenceId: string,
  previousTransformOverride: ReferenceTransformOverride | null | undefined,
  nextTransformOverride: ReferenceTransformOverride | null | undefined,
): Record<string, Partial<Record<ReferenceTimelineChannelKey, ReferenceTimelineConfig>>> => {
  const nextTimelineConfigByReferenceId = {
    ...referenceWorkspace.timelineConfigByReferenceId,
  }
  const channels: ReferenceTimelineChannelKey[] = [
    'move-x',
    'move-y',
    'move-z',
    'rotate-x',
    'rotate-y',
    'rotate-z',
    'scale-x',
    'scale-y',
    'scale-z',
  ]

  for (const channel of channels) {
    if (getReferenceTimelineMode(referenceWorkspace, referenceId, channel) !== 'timeline') {
      continue
    }
    const previousValue = getReferenceTransformOverrideAxisValue(previousTransformOverride, channel)
    const nextValue = getReferenceTransformOverrideAxisValue(nextTransformOverride, channel)
    const delta = nextValue - previousValue
    if (Math.abs(delta) < 0.000001) {
      continue
    }
    const existingConfig = nextTimelineConfigByReferenceId[referenceId]?.[channel]
    if (existingConfig === undefined) {
      continue
    }
    nextTimelineConfigByReferenceId[referenceId] = {
      ...(nextTimelineConfigByReferenceId[referenceId] ?? {}),
      [channel]: shiftReferenceTimelineConfig(
        existingConfig,
        delta,
        getReferenceChannelClampRange(referenceWorkspace, referenceId, channel),
      ),
    }
  }

  return nextTimelineConfigByReferenceId
}
