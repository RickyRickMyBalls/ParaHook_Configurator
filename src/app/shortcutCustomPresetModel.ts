import {
  shortcutPresetReads,
  type ShortcutBasePresetId,
  type ShortcutBindingValue,
  type ShortcutCustomPresetId,
  type ShortcutInventoryRow,
  type ShortcutPresetRead,
} from './shortcutInventoryReadModel'

export type ShortcutBindingOverride = {
  basePresetId: ShortcutBasePresetId
  rowId: string
  bindingValue: ShortcutBindingValue
}

export type ShortcutBindingConflict = {
  bindingSignature: string
  keyChord: string
  rowIds: readonly string[]
}

export type ShortcutCustomPresetRead = ShortcutPresetRead & {
  id: ShortcutCustomPresetId
  basePresetId: ShortcutBasePresetId
  isCustom: true
  overrideCount: number
}

const shortcutCustomPresetLabels: Record<ShortcutBasePresetId, string> = {
  default: 'Default (custom)',
  'blender-working': 'Blender (working custom)',
}

const keyCodeLabels: Record<string, string> = {
  Digit0: '0',
  Digit1: '1',
  Digit2: '2',
  Digit3: '3',
  Digit4: '4',
  Digit5: '5',
  Digit6: '6',
  Digit7: '7',
  Digit8: '8',
  Digit9: '9',
  KeyA: 'A',
  KeyD: 'D',
  KeyE: 'E',
  KeyQ: 'Q',
  KeyS: 'S',
  KeyW: 'W',
  KeyZ: 'Z',
  Numpad2: 'Numpad 2',
  Numpad4: 'Numpad 4',
  Numpad5: 'Numpad 5',
  Numpad6: 'Numpad 6',
  Numpad8: 'Numpad 8',
}

export const getShortcutCustomPresetId = (
  basePresetId: ShortcutBasePresetId,
): ShortcutCustomPresetId => `${basePresetId}:custom`

export const getShortcutCustomPresetLabel = (basePresetId: ShortcutBasePresetId): string =>
  shortcutCustomPresetLabels[basePresetId]

export const getShortcutBasePresetRead = (
  basePresetId: ShortcutBasePresetId,
): ShortcutPresetRead =>
  shortcutPresetReads.find((preset) => preset.id === basePresetId) ?? shortcutPresetReads[0]

export const buildShortcutCustomPresetRead = (
  basePresetId: ShortcutBasePresetId,
  overrides: readonly ShortcutBindingOverride[],
): ShortcutCustomPresetRead => ({
  id: getShortcutCustomPresetId(basePresetId),
  label: getShortcutCustomPresetLabel(basePresetId),
  basePresetId,
  isCustom: true,
  overrideCount: overrides.filter((override) => override.basePresetId === basePresetId).length,
})

export const resolveShortcutPresetRead = (
  basePresetId: ShortcutBasePresetId,
  overrides: readonly ShortcutBindingOverride[],
): ShortcutPresetRead => {
  if (overrides.some((override) => override.basePresetId === basePresetId)) {
    return buildShortcutCustomPresetRead(basePresetId, overrides)
  }

  return getShortcutBasePresetRead(basePresetId)
}

export const resetShortcutCustomPresetOverrides = (
  basePresetId: ShortcutBasePresetId,
  overrides: readonly ShortcutBindingOverride[],
): readonly ShortcutBindingOverride[] =>
  overrides.filter((override) => override.basePresetId !== basePresetId)

const formatKeyboardBindingValue = (bindingValue: Extract<ShortcutBindingValue, { kind: 'keyboard' }>): string => {
  const keys = []
  if (bindingValue.ctrlKey) {
    keys.push('Control')
  }
  if (bindingValue.altKey) {
    keys.push('Alt')
  }
  if (bindingValue.shiftKey) {
    keys.push('Shift')
  }
  if (bindingValue.metaKey) {
    keys.push('Meta')
  }
  keys.push(keyCodeLabels[bindingValue.code] ?? bindingValue.code)
  return keys.join('+')
}

export const formatShortcutBindingValue = (bindingValue: ShortcutBindingValue): string => {
  if (bindingValue.kind === 'keyboard') {
    return formatKeyboardBindingValue(bindingValue)
  }

  return bindingValue.gesture
}

export const getShortcutBindingSignature = (bindingValue: ShortcutBindingValue): string => {
  if (bindingValue.kind !== 'keyboard') {
    return `${bindingValue.kind}:${bindingValue.gesture.toLowerCase()}`
  }

  return [
    bindingValue.kind,
    bindingValue.code,
    bindingValue.ctrlKey === true ? 'ctrl' : '',
    bindingValue.altKey === true ? 'alt' : '',
    bindingValue.shiftKey === true ? 'shift' : '',
    bindingValue.metaKey === true ? 'meta' : '',
  ]
    .filter(Boolean)
    .join(':')
}

export const applyShortcutBindingOverrides = (
  rows: readonly ShortcutInventoryRow[],
  basePresetId: ShortcutBasePresetId,
  overrides: readonly ShortcutBindingOverride[],
): readonly ShortcutInventoryRow[] => {
  const overridesByRowId = new Map(
    overrides
      .filter((override) => override.basePresetId === basePresetId)
      .map((override) => [override.rowId, override.bindingValue] as const),
  )

  return rows.map((row) => {
    const overrideBinding = overridesByRowId.get(row.id)
    if (overrideBinding === undefined || row.editability !== 'editable') {
      return row
    }

    return {
      ...row,
      keyChord: formatShortcutBindingValue(overrideBinding),
      bindingValue: overrideBinding,
      contextNote: undefined,
    }
  })
}

export const readShortcutBindingConflicts = (
  rows: readonly ShortcutInventoryRow[],
  basePresetId: ShortcutBasePresetId,
  overrides: readonly ShortcutBindingOverride[],
): readonly ShortcutBindingConflict[] => {
  const rowsWithOverrides = applyShortcutBindingOverrides(rows, basePresetId, overrides)
  const rowsBySignature = new Map<string, ShortcutInventoryRow[]>()

  for (const row of rowsWithOverrides) {
    if (row.editability !== 'editable' || row.bindingValue === undefined) {
      continue
    }

    const signature = getShortcutBindingSignature(row.bindingValue)
    rowsBySignature.set(signature, [...(rowsBySignature.get(signature) ?? []), row])
  }

  return [...rowsBySignature.entries()]
    .filter(([, conflictingRows]) => conflictingRows.length > 1)
    .map(([bindingSignature, conflictingRows]) => ({
      bindingSignature,
      keyChord: conflictingRows[0]?.keyChord ?? bindingSignature,
      rowIds: conflictingRows.map((row) => row.id),
    }))
}
