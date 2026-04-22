import type { GroundMaterialPresetId, ViewSettings } from '../../shared/viewSettingsTypes'
import { normalizeViewSettings } from '../../shared/viewSettingsTypes'
import { editHistoryStore } from './editHistoryStore'
import { useUiPrefsStore } from './uiPrefsStore'

export type GroundHistorySnapshot = ViewSettings['ground']

type GroundHistoryOptions = {
  entryId?: string
  label?: string
  sourceId?: string
  sourceLabel?: string
  targetId?: string
  targetLabel?: string
}

let groundHistorySequence = 0

const groundHistorySource = {
  surface: 'viewer-ground',
  sourceId: 'ground',
  sourceLabel: 'Ground',
}

const nextGroundHistoryEntryId = (): string => {
  groundHistorySequence += 1
  return `ground-${groundHistorySequence}`
}

const cloneGroundSnapshot = (ground: ViewSettings['ground']): GroundHistorySnapshot => ({
  enabled: ground.enabled,
  height: ground.height,
  materialPresetId: ground.materialPresetId,
})

export const areGroundHistorySnapshotsEqual = (
  left: GroundHistorySnapshot,
  right: GroundHistorySnapshot,
): boolean =>
  left.enabled === right.enabled &&
  left.height === right.height &&
  left.materialPresetId === right.materialPresetId

export const captureGroundHistorySnapshot = (): GroundHistorySnapshot =>
  cloneGroundSnapshot(useUiPrefsStore.getState().view.ground)

export const restoreGroundHistorySnapshot = (snapshot: GroundHistorySnapshot): void => {
  const state = useUiPrefsStore.getState()
  useUiPrefsStore.setState({
    view: normalizeViewSettings({
      ...state.view,
      ground: cloneGroundSnapshot(snapshot),
    }),
  })
}

export const commitGroundHistory = (
  beforeSnapshot: GroundHistorySnapshot,
  options: GroundHistoryOptions = {},
): boolean => {
  const afterSnapshot = captureGroundHistorySnapshot()
  if (areGroundHistorySnapshotsEqual(beforeSnapshot, afterSnapshot)) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextGroundHistoryEntryId(),
    label: options.label ?? 'Change ground setting',
    source: {
      ...groundHistorySource,
      sourceId: options.sourceId ?? groundHistorySource.sourceId,
      sourceLabel: options.sourceLabel ?? groundHistorySource.sourceLabel,
    },
    targetId: options.targetId,
    targetLabel: options.targetLabel,
    undo: () => restoreGroundHistorySnapshot(beforeSnapshot),
    redo: () => restoreGroundHistorySnapshot(afterSnapshot),
  })
}

export const runGroundHistoryAction = (
  action: () => void,
  options: GroundHistoryOptions = {},
): boolean => {
  const beforeSnapshot = captureGroundHistorySnapshot()
  action()
  return commitGroundHistory(beforeSnapshot, options)
}

const applyGroundPatch = (patch: Partial<ViewSettings['ground']>): void => {
  const state = useUiPrefsStore.getState()
  state.setView({
    ground: {
      ...state.view.ground,
      ...patch,
    },
  })
}

export const setGroundEnabledWithHistory = (
  enabled: boolean,
  options: GroundHistoryOptions = {},
): boolean =>
  runGroundHistoryAction(() => applyGroundPatch({ enabled }), {
    targetId: 'ground:enabled',
    targetLabel: 'Ground visibility',
    ...options,
  })

export const setGroundMaterialPresetWithHistory = (
  materialPresetId: GroundMaterialPresetId,
  options: GroundHistoryOptions = {},
): boolean =>
  runGroundHistoryAction(() => applyGroundPatch({ materialPresetId }), {
    targetId: 'ground:material',
    targetLabel: 'Ground material',
    ...options,
  })

export const setGroundHeightWithHistory = (
  height: number,
  options: GroundHistoryOptions = {},
): boolean =>
  runGroundHistoryAction(() => applyGroundPatch({ height }), {
    targetId: 'ground:height',
    targetLabel: 'Ground height',
    ...options,
  })
