import { beforeEach, describe, expect, it } from 'vitest'
import { getShortcutInventoryReadModel } from './shortcutInventoryReadModel'
import { useShortcutPreferencesStore } from './shortcutPreferencesStore'
import {
  readActiveViewerCameraShortcutConflictSignatures,
  resolveActiveViewerCameraShortcutAction,
  resolveViewerCameraShortcutActionFromPreferences,
} from './viewerCameraShortcutRuntime'

describe('viewerCameraShortcutRuntime', () => {
  beforeEach(() => {
    useShortcutPreferencesStore.getState().resetShortcutPreferences()
  })

  it('resolves custom viewer camera presets from the active shortcut preferences', () => {
    useShortcutPreferencesStore.getState().setShortcutBindingOverrides([
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:preset-top',
        bindingValue: { kind: 'keyboard', code: 'Digit1' },
      },
    ])

    expect(resolveActiveViewerCameraShortcutAction({ key: '1', code: 'Digit1' })).toBe(
      'preset-top',
    )
    expect(resolveActiveViewerCameraShortcutAction({ key: '5', code: 'Numpad5' })).toBeNull()
  })

  it('keeps built-in camera preset input priority behavior until a preset binding is customized', () => {
    expect(resolveActiveViewerCameraShortcutAction({
      key: '5',
      code: 'Numpad5',
    })).toBeNull()
    expect(resolveActiveViewerCameraShortcutAction({
      key: '5',
      code: 'Numpad5',
      shiftKey: true,
    })).toBe('preset-top')
    expect(resolveActiveViewerCameraShortcutAction(
      {
        key: '5',
        code: 'Numpad5',
      },
      'shortcuts-first',
    )).toBe('preset-top')
    expect(resolveActiveViewerCameraShortcutAction(
      {
        key: '5',
        code: 'Numpad5',
        shiftKey: true,
      },
      'shortcuts-first',
    )).toBeNull()
  })

  it('keeps Zoom Object input priority behavior until that binding is customized', () => {
    expect(resolveActiveViewerCameraShortcutAction({
      key: 'Z',
      code: 'KeyZ',
      shiftKey: true,
    })).toBe('zoom-object')
    expect(resolveActiveViewerCameraShortcutAction(
      { key: 'z', code: 'KeyZ' },
      'shortcuts-first',
    )).toBe('zoom-object')
    expect(resolveActiveViewerCameraShortcutAction(
      { key: 'Z', code: 'KeyZ', shiftKey: true },
      'shortcuts-first',
    )).toBeNull()
  })

  it('resolves a customized Zoom Object binding without the base priority fallback', () => {
    useShortcutPreferencesStore.getState().setShortcutBindingOverrides([
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:zoom-object',
        bindingValue: { kind: 'keyboard', code: 'Digit0' },
      },
    ])

    expect(resolveActiveViewerCameraShortcutAction({ key: '0', code: 'Digit0' })).toBe(
      'zoom-object',
    )
    expect(resolveActiveViewerCameraShortcutAction({
      key: 'Z',
      code: 'KeyZ',
      shiftKey: true,
    })).toBeNull()
  })

  it('does not choose a winner for overlapping runtime shortcut bindings', () => {
    const overrides = [
      {
        basePresetId: 'default' as const,
        rowId: 'viewer-camera-shortcuts:preset-front',
        bindingValue: { kind: 'keyboard' as const, code: 'Numpad5' },
      },
    ]

    expect(readActiveViewerCameraShortcutConflictSignatures()).toEqual([])
    useShortcutPreferencesStore.getState().setShortcutBindingOverrides(overrides)

    expect(readActiveViewerCameraShortcutConflictSignatures()).toEqual(['keyboard:Numpad5'])
    expect(resolveViewerCameraShortcutActionFromPreferences(
      { key: '5', code: 'Numpad5' },
      'console-first',
      'default',
      overrides,
    )).toBeNull()
    expect(resolveActiveViewerCameraShortcutAction({
      key: '8',
      code: 'Numpad8',
      shiftKey: true,
    })).toBe(
      'preset-back',
    )
  })

  it('keeps editable viewer camera rows aligned with runtime-supported actions', () => {
    const cameraRows =
      getShortcutInventoryReadModel().groups.find((group) => group.id === 'viewer-camera-shortcuts')
        ?.rows ?? []
    const expectedActionByRowId = new Map([
      ['viewer-camera-shortcuts:preset-top', 'preset-top'],
      ['viewer-camera-shortcuts:preset-front', 'preset-front'],
      ['viewer-camera-shortcuts:preset-back', 'preset-back'],
      ['viewer-camera-shortcuts:preset-left', 'preset-left'],
      ['viewer-camera-shortcuts:preset-right', 'preset-right'],
      ['viewer-camera-shortcuts:zoom-object', 'zoom-object'],
    ])

    expect(cameraRows.map((row) => row.id)).toEqual([...expectedActionByRowId.keys()])

    for (const row of cameraRows) {
      expect(row.editability).toBe('editable')
      expect(row.bindingValue?.kind).toBe('keyboard')
      if (row.bindingValue?.kind !== 'keyboard') {
        continue
      }

      const isPriorityAwareBasePreset = row.id !== 'viewer-camera-shortcuts:zoom-object'
      expect(resolveViewerCameraShortcutActionFromPreferences(
        {
          key: row.keyChord,
          code: row.bindingValue.code,
          shiftKey: isPriorityAwareBasePreset ? true : row.bindingValue.shiftKey,
          ctrlKey: row.bindingValue.ctrlKey,
          altKey: row.bindingValue.altKey,
          metaKey: row.bindingValue.metaKey,
        },
        'console-first',
        'default',
        [],
      )).toBe(expectedActionByRowId.get(row.id))
    }
  })
})
