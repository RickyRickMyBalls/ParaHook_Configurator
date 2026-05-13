import type {
  CameraShortcutInputPriorityMode,
  CameraShortcutKeyboardLikeEvent,
  ViewerCameraShortcutAction,
} from './cameraShortcuts'
import { resolveViewerCameraShortcutAction } from './cameraShortcuts'
import {
  applyShortcutBindingOverrides,
  getShortcutBindingSignature,
  readShortcutBindingConflicts,
  type ShortcutBindingOverride,
} from './shortcutCustomPresetModel'
import {
  getShortcutInventoryReadModel,
  type ShortcutBasePresetId,
  type ShortcutInventoryRow,
} from './shortcutInventoryReadModel'
import { useShortcutPreferencesStore } from './shortcutPreferencesStore'

const viewerCameraSourceId = 'viewer-camera-shortcuts'
const zoomObjectRowId = `${viewerCameraSourceId}:zoom-object`

const rowActionById: ReadonlyMap<string, ViewerCameraShortcutAction> = new Map([
  [`${viewerCameraSourceId}:preset-top`, 'preset-top'],
  [`${viewerCameraSourceId}:preset-front`, 'preset-front'],
  [`${viewerCameraSourceId}:preset-back`, 'preset-back'],
  [`${viewerCameraSourceId}:preset-left`, 'preset-left'],
  [`${viewerCameraSourceId}:preset-right`, 'preset-right'],
  [zoomObjectRowId, 'zoom-object'],
])

const getViewerCameraRows = (): readonly ShortcutInventoryRow[] =>
  getShortcutInventoryReadModel().groups.find((group) => group.id === viewerCameraSourceId)?.rows ?? []

const hasExactKeyboardMatch = (
  event: CameraShortcutKeyboardLikeEvent,
  row: ShortcutInventoryRow,
): boolean =>
  row.bindingValue?.kind === 'keyboard' &&
  event.code === row.bindingValue.code &&
  Boolean(event.shiftKey) === Boolean(row.bindingValue.shiftKey) &&
  Boolean(event.ctrlKey) === Boolean(row.bindingValue.ctrlKey) &&
  Boolean(event.altKey) === Boolean(row.bindingValue.altKey) &&
  Boolean(event.metaKey) === Boolean(row.bindingValue.metaKey)

export const resolveViewerCameraShortcutActionFromPreferences = (
  event: CameraShortcutKeyboardLikeEvent,
  inputPriorityMode: CameraShortcutInputPriorityMode = 'console-first',
  basePresetId: ShortcutBasePresetId,
  overrides: readonly ShortcutBindingOverride[],
): ViewerCameraShortcutAction | null => {
  const viewerCameraRows = getViewerCameraRows()
  const effectiveRows = applyShortcutBindingOverrides(viewerCameraRows, basePresetId, overrides)
  const conflictingRowIds = new Set(
    readShortcutBindingConflicts(viewerCameraRows, basePresetId, overrides).flatMap(
      (conflict) => conflict.rowIds,
    ),
  )
  const activePresetOverrides = overrides.filter(
    (override) => override.basePresetId === basePresetId,
  )
  const overriddenRowIds = new Set(activePresetOverrides.map((override) => override.rowId))

  if (!overriddenRowIds.has(zoomObjectRowId) && !conflictingRowIds.has(zoomObjectRowId)) {
    const baseZoomAction = resolveViewerCameraShortcutAction(event, inputPriorityMode)
    if (baseZoomAction === 'zoom-object') {
      return baseZoomAction
    }
  }

  for (const row of effectiveRows) {
    if (
      row.editability !== 'editable' ||
      row.bindingValue === undefined ||
      conflictingRowIds.has(row.id)
    ) {
      continue
    }
    if (row.id === zoomObjectRowId && !overriddenRowIds.has(zoomObjectRowId)) {
      continue
    }
    if (!hasExactKeyboardMatch(event, row)) {
      continue
    }
    return rowActionById.get(row.id) ?? null
  }

  return null
}

export const resolveActiveViewerCameraShortcutAction = (
  event: CameraShortcutKeyboardLikeEvent,
  inputPriorityMode: CameraShortcutInputPriorityMode = 'console-first',
): ViewerCameraShortcutAction | null => {
  const shortcutPreferences = useShortcutPreferencesStore.getState()
  return resolveViewerCameraShortcutActionFromPreferences(
    event,
    inputPriorityMode,
    shortcutPreferences.selectedShortcutBasePresetId,
    shortcutPreferences.shortcutBindingOverrides,
  )
}

export const readActiveViewerCameraShortcutConflictSignatures = (): readonly string[] => {
  const shortcutPreferences = useShortcutPreferencesStore.getState()
  return readShortcutBindingConflicts(
    getViewerCameraRows(),
    shortcutPreferences.selectedShortcutBasePresetId,
    shortcutPreferences.shortcutBindingOverrides,
  ).map((conflict) => conflict.bindingSignature)
}

export const getViewerCameraShortcutRuntimeSignature = (
  event: CameraShortcutKeyboardLikeEvent,
): string | null => {
  if (typeof event.code !== 'string' || event.code.length === 0) {
    return null
  }
  return getShortcutBindingSignature({
    kind: 'keyboard',
    code: event.code,
    shiftKey: event.shiftKey || undefined,
    ctrlKey: event.ctrlKey || undefined,
    altKey: event.altKey || undefined,
    metaKey: event.metaKey || undefined,
  })
}

