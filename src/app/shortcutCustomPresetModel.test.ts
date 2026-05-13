import { describe, expect, it } from 'vitest'
import {
  applyShortcutBindingOverrides,
  buildShortcutCustomPresetRead,
  getShortcutCustomPresetId,
  getShortcutCustomPresetLabel,
  readShortcutBindingConflicts,
  resetShortcutCustomPresetOverrides,
  resolveShortcutPresetRead,
  type ShortcutBindingOverride,
} from './shortcutCustomPresetModel'
import { getShortcutInventoryReadModel } from './shortcutInventoryReadModel'

const getCameraRows = () => {
  const cameraGroup = getShortcutInventoryReadModel().groups.find(
    (group) => group.id === 'viewer-camera-shortcuts',
  )

  if (cameraGroup === undefined) {
    throw new Error('Expected viewer camera shortcut group')
  }

  return cameraGroup.rows
}

describe('shortcutCustomPresetModel', () => {
  it('names custom presets from base preset ids without mutating base reads', () => {
    expect(getShortcutCustomPresetId('default')).toBe('default:custom')
    expect(getShortcutCustomPresetId('blender-working')).toBe('blender-working:custom')
    expect(getShortcutCustomPresetLabel('default')).toBe('Default (custom)')
    expect(getShortcutCustomPresetLabel('blender-working')).toBe('Blender (working custom)')

    const overrides: ShortcutBindingOverride[] = [
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:preset-top',
        bindingValue: { kind: 'keyboard', code: 'Digit1' },
      },
    ]

    expect(resolveShortcutPresetRead('default', overrides)).toEqual({
      id: 'default:custom',
      label: 'Default (custom)',
      basePresetId: 'default',
      isCustom: true,
      overrideCount: 1,
    })
    expect(resolveShortcutPresetRead('blender-working', overrides)).toEqual({
      id: 'blender-working',
      label: 'Blender (working)',
      sourcePresetId: 'default',
    })
  })

  it('builds Blender working custom reads from Blender-specific overrides', () => {
    const customRead = buildShortcutCustomPresetRead('blender-working', [
      {
        basePresetId: 'blender-working',
        rowId: 'viewer-camera-shortcuts:preset-top',
        bindingValue: { kind: 'keyboard', code: 'Digit7' },
      },
    ])

    expect(customRead).toEqual({
      id: 'blender-working:custom',
      label: 'Blender (working custom)',
      basePresetId: 'blender-working',
      isCustom: true,
      overrideCount: 1,
    })
  })

  it('resets one custom preset back to base values without clearing other preset overrides', () => {
    const overrides: ShortcutBindingOverride[] = [
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:preset-top',
        bindingValue: { kind: 'keyboard', code: 'Digit1' },
      },
      {
        basePresetId: 'blender-working',
        rowId: 'viewer-camera-shortcuts:preset-front',
        bindingValue: { kind: 'keyboard', code: 'Digit2' },
      },
    ]

    expect(resetShortcutCustomPresetOverrides('default', overrides)).toEqual([
      {
        basePresetId: 'blender-working',
        rowId: 'viewer-camera-shortcuts:preset-front',
        bindingValue: { kind: 'keyboard', code: 'Digit2' },
      },
    ])
  })

  it('applies binding overrides only to editable rows', () => {
    const rows = getShortcutInventoryReadModel()
      .groups.flatMap((group) => group.rows)
      .filter((row) =>
        [
          'viewer-camera-shortcuts:preset-top',
          'viewer-fly-mode-entry:fly-mode-entry-right-click-hold',
        ].includes(row.id),
      )
    const overrides: ShortcutBindingOverride[] = [
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:preset-top',
        bindingValue: { kind: 'keyboard', code: 'Digit1', shiftKey: true },
      },
      {
        basePresetId: 'default',
        rowId: 'viewer-fly-mode-entry:fly-mode-entry-right-click-hold',
        bindingValue: { kind: 'gesture', gesture: 'Middle click hold' },
      },
    ]

    const rowsWithOverrides = applyShortcutBindingOverrides(rows, 'default', overrides)

    expect(rowsWithOverrides.find((row) => row.id === 'viewer-camera-shortcuts:preset-top')).toMatchObject({
      id: 'viewer-camera-shortcuts:preset-top',
      keyChord: 'Shift+1',
      bindingValue: { kind: 'keyboard', code: 'Digit1', shiftKey: true },
    })
    const flyEntryRow = rowsWithOverrides.find(
      (row) => row.id === 'viewer-fly-mode-entry:fly-mode-entry-right-click-hold',
    )
    expect(flyEntryRow).toMatchObject({
      id: 'viewer-fly-mode-entry:fly-mode-entry-right-click-hold',
      keyChord: 'Right click hold',
    })
    expect(flyEntryRow?.bindingValue).toBeUndefined()
  })

  it('detects binding conflicts inside the editable subset', () => {
    const rows = getCameraRows()
    const overrides: ShortcutBindingOverride[] = [
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:preset-front',
        bindingValue: { kind: 'keyboard', code: 'Numpad5' },
      },
    ]

    expect(readShortcutBindingConflicts(rows, 'default', overrides)).toEqual([
      {
        bindingSignature: 'keyboard:Numpad5',
        keyChord: 'Numpad 5',
        rowIds: ['viewer-camera-shortcuts:preset-top', 'viewer-camera-shortcuts:preset-front'],
      },
    ])
  })

  it('does not report read-only Fly Mode rows as editable conflicts', () => {
    const flyRows =
      getShortcutInventoryReadModel().groups.find((group) => group.id === 'viewer-fly-mode-entry')
        ?.rows ?? []

    expect(readShortcutBindingConflicts(flyRows, 'default', [])).toEqual([])
  })
})
