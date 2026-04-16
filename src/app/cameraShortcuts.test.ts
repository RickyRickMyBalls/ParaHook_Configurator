import { describe, expect, it } from 'vitest'
import {
  resolveViewerCameraShortcutAction,
  viewerCameraShortcutBindings,
} from './cameraShortcuts'

describe('cameraShortcuts', () => {
  it('resolves the current exact viewer camera shortcut map', () => {
    for (const binding of viewerCameraShortcutBindings) {
      expect(
        resolveViewerCameraShortcutAction({
          key: binding.label,
          code: binding.code,
          shiftKey: binding.shiftKey,
        }),
      ).toBe(binding.action)
    }
  })

  it('does not resolve shortcuts without the exact expected code and modifier shape', () => {
    expect(
      resolveViewerCameraShortcutAction({
        key: '5',
      }),
    ).toBeNull()

    expect(
      resolveViewerCameraShortcutAction({
        key: '5',
        code: 'Digit5',
      }),
    ).toBeNull()

    expect(
      resolveViewerCameraShortcutAction({
        key: 'Z',
        code: 'KeyZ',
      }),
    ).toBeNull()

    expect(
      resolveViewerCameraShortcutAction({
        key: 'Z',
        code: 'KeyZ',
        shiftKey: true,
        ctrlKey: true,
      }),
    ).toBeNull()

    expect(
      resolveViewerCameraShortcutAction({
        key: '.',
        code: 'NumpadDecimal',
      }),
    ).toBeNull()

    expect(
      resolveViewerCameraShortcutAction({
        key: '4',
        code: 'Numpad4',
        metaKey: true,
      }),
    ).toBeNull()
  })
})
