import {
  getShortcutInventorySourceMap,
  type ShortcutInventorySourceEntry,
  type ShortcutInventorySourceStatus,
} from './shortcutInventorySourceMap'
import type { ViewerCameraShortcutBinding } from './cameraShortcuts'

export type ShortcutBasePresetId = 'default' | 'blender-working'
export type ShortcutCustomPresetId = `${ShortcutBasePresetId}:custom`
export type ShortcutPresetId = ShortcutBasePresetId | ShortcutCustomPresetId

export type ShortcutBindingValue =
  | {
      kind: 'keyboard'
      code: string
      shiftKey?: boolean
      ctrlKey?: boolean
      altKey?: boolean
      metaKey?: boolean
    }
  | {
      kind: 'gesture'
      gesture: string
    }
  | {
      kind: 'pointer-motion'
      gesture: string
    }

export type ShortcutRowEditability = 'editable' | 'read-only'

export type ShortcutPresetRead = {
  id: ShortcutPresetId
  label: string
  sourcePresetId?: ShortcutBasePresetId
  basePresetId?: ShortcutBasePresetId
  isCustom?: boolean
}

export type ShortcutInventoryRow = {
  id: string
  commandLabel: string
  keyChord: string
  modeLabel: string
  sourceId: string
  editability: ShortcutRowEditability
  bindingValue?: ShortcutBindingValue
  sectionLabel?: string
  contextNote?: string
}

export type ShortcutInventoryGroup = {
  id: string
  label: string
  modeLabel: string
  status: ShortcutInventorySourceStatus
  sourceId: string
  rows: readonly ShortcutInventoryRow[]
  deferredReason?: string
}

export type ShortcutInventoryReadModel = {
  preset: ShortcutPresetRead
  groups: readonly ShortcutInventoryGroup[]
}

export const shortcutPresetReads: readonly ShortcutPresetRead[] = [
  { id: 'default', label: 'Default' },
  { id: 'blender-working', label: 'Blender (working)', sourcePresetId: 'default' },
]

const sourceStatusOrder: Record<ShortcutInventorySourceStatus, number> = {
  cataloged: 0,
  'routing-owner-only': 1,
  'behavior-setting': 2,
  fragmented: 3,
}

const keyCodeLabels: Record<string, string> = {
  KeyZ: 'Z',
  Numpad2: 'Numpad 2',
  Numpad4: 'Numpad 4',
  Numpad5: 'Numpad 5',
  Numpad6: 'Numpad 6',
  Numpad8: 'Numpad 8',
}

const getPresetRead = (presetId: ShortcutPresetId): ShortcutPresetRead =>
  shortcutPresetReads.find((preset) => preset.id === presetId) ?? shortcutPresetReads[0]

const toKeyboardBindingValue = (binding: ViewerCameraShortcutBinding): ShortcutBindingValue => ({
  kind: 'keyboard',
  code: binding.code,
  shiftKey: binding.shiftKey || undefined,
})

const formatKeyChord = (binding: ViewerCameraShortcutBinding): string => {
  const keys = []
  if (binding.shiftKey) {
    keys.push('Shift')
  }
  keys.push(keyCodeLabels[binding.code] ?? binding.code)
  return keys.join('+')
}

const getCameraShortcutContextNote = (
  source: ShortcutInventorySourceEntry,
  binding: ViewerCameraShortcutBinding,
): string | undefined => {
  if (source.id !== 'viewer-camera-shortcuts' || binding.action === 'zoom-object') {
    return undefined
  }
  return 'Console first uses Shift+Numpad; Shortcuts first uses plain Numpad.'
}

const toShortcutRows = (source: ShortcutInventorySourceEntry): readonly ShortcutInventoryRow[] => {
  if (source.status !== 'cataloged' || source.bindings === undefined) {
    if (source.status === 'cataloged' && source.displayBindings !== undefined) {
      return source.displayBindings.map((binding) => ({
        id: `${source.id}:${binding.id}`,
        commandLabel: binding.label,
        keyChord: binding.keyChord,
        modeLabel: source.modeLabel,
        sourceId: source.id,
        editability: 'read-only',
        sectionLabel: binding.sectionLabel,
        contextNote: binding.contextNote,
      }))
    }
    return []
  }

  return source.bindings.map((binding) => ({
    id: `${source.id}:${binding.action}`,
    commandLabel: binding.label,
    keyChord: formatKeyChord(binding),
    modeLabel: source.modeLabel,
    sourceId: source.id,
    editability: 'editable',
    bindingValue: toKeyboardBindingValue(binding),
    contextNote: getCameraShortcutContextNote(source, binding),
  }))
}

const toShortcutGroup = (source: ShortcutInventorySourceEntry): ShortcutInventoryGroup => ({
  id: source.id,
  label: source.label,
  modeLabel: source.modeLabel,
  status: source.status,
  sourceId: source.id,
  rows: toShortcutRows(source),
  deferredReason: source.status === 'cataloged' ? undefined : source.deferredReason,
})

const sortShortcutGroups = (
  groups: readonly ShortcutInventoryGroup[],
): readonly ShortcutInventoryGroup[] =>
  [...groups].sort((left, right) => {
    const statusDifference = sourceStatusOrder[left.status] - sourceStatusOrder[right.status]
    if (statusDifference !== 0) {
      return statusDifference
    }
    return left.label.localeCompare(right.label)
  })

export const buildShortcutInventoryGroups = (
  sources: readonly ShortcutInventorySourceEntry[] = getShortcutInventorySourceMap(),
): readonly ShortcutInventoryGroup[] => sortShortcutGroups(sources.map(toShortcutGroup))

export const getShortcutInventoryReadModel = (
  presetId: ShortcutPresetId = 'default',
): ShortcutInventoryReadModel => ({
  preset: getPresetRead(presetId),
  groups: buildShortcutInventoryGroups(),
})
