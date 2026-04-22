import type { EnvironmentLookSnapshot } from '../../shared/viewSettingsTypes'
import {
  areEnvironmentLookSnapshotsEqual,
  createEnvironmentLookSnapshot,
  normalizeViewSettings,
} from '../../shared/viewSettingsTypes'
import { editHistoryStore } from './editHistoryStore'
import { useUiPrefsStore } from './uiPrefsStore'

type EnvironmentLookHistoryOptions = {
  entryId?: string
  label?: string
  sourceId?: string
  sourceLabel?: string
  targetId?: string
  targetLabel?: string
}

let environmentLookHistorySequence = 0

const environmentLookHistorySource = {
  surface: 'viewer-environment',
  sourceId: 'environment-look',
  sourceLabel: 'Environment Look',
}

const nextEnvironmentLookHistoryEntryId = (): string => {
  environmentLookHistorySequence += 1
  return `environment-look-${environmentLookHistorySequence}`
}

export const captureEnvironmentLookHistorySnapshot = (): EnvironmentLookSnapshot =>
  createEnvironmentLookSnapshot(useUiPrefsStore.getState().view)

export const restoreEnvironmentLookHistorySnapshot = (
  snapshot: EnvironmentLookSnapshot,
): void => {
  const state = useUiPrefsStore.getState()
  useUiPrefsStore.setState({
    view: normalizeViewSettings({
      ...state.view,
      envPreset: snapshot.envPreset,
      environmentGrade: snapshot.environmentGrade,
      environmentSource: snapshot.environmentSource,
      lighting: snapshot.lighting,
    }),
  })
}

export const commitEnvironmentLookHistory = (
  beforeSnapshot: EnvironmentLookSnapshot,
  options: EnvironmentLookHistoryOptions = {},
): boolean => {
  const afterSnapshot = captureEnvironmentLookHistorySnapshot()
  if (areEnvironmentLookSnapshotsEqual(beforeSnapshot, afterSnapshot)) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextEnvironmentLookHistoryEntryId(),
    label: options.label ?? 'Change environment look',
    source: {
      ...environmentLookHistorySource,
      sourceId: options.sourceId ?? environmentLookHistorySource.sourceId,
      sourceLabel: options.sourceLabel ?? environmentLookHistorySource.sourceLabel,
    },
    targetId: options.targetId,
    targetLabel: options.targetLabel,
    undo: () => restoreEnvironmentLookHistorySnapshot(beforeSnapshot),
    redo: () => restoreEnvironmentLookHistorySnapshot(afterSnapshot),
  })
}

export const runEnvironmentLookHistoryAction = (
  action: () => void,
  options: EnvironmentLookHistoryOptions = {},
): boolean => {
  const beforeSnapshot = captureEnvironmentLookHistorySnapshot()
  action()
  return commitEnvironmentLookHistory(beforeSnapshot, options)
}
