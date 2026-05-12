import {
  getShortcutInventorySourceMap,
  type ShortcutInventorySourceEntry,
  type ShortcutInventorySourceStatus,
} from './shortcutInventorySourceMap'
import type { ViewerCameraShortcutBinding } from './cameraShortcuts'

export type ShortcutPresetId = 'default' | 'blender-working'

export type ShortcutPresetRead = {
  id: ShortcutPresetId
  label: string
  sourcePresetId?: ShortcutPresetId
}

export type ShortcutInventoryRow = {
  id: string
  commandLabel: string
  keyChord: string
  modeLabel: string
  sourceId: string
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

const formatKeyChord = (binding: ViewerCameraShortcutBinding): string => {
  const keys = []
  if (binding.shiftKey) {
    keys.push('Shift')
  }
  keys.push(keyCodeLabels[binding.code] ?? binding.code)
  return keys.join('+')
}

const toShortcutRows = (source: ShortcutInventorySourceEntry): readonly ShortcutInventoryRow[] => {
  if (source.status !== 'cataloged' || source.bindings === undefined) {
    return []
  }

  return source.bindings.map((binding) => ({
    id: `${source.id}:${binding.action}`,
    commandLabel: binding.label,
    keyChord: formatKeyChord(binding),
    modeLabel: source.modeLabel,
    sourceId: source.id,
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

