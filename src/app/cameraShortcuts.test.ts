import { describe, expect, it } from 'vitest'
import {
  resolveViewerCameraShortcutAction,
  viewerCameraShortcutBindings,
} from './cameraShortcuts'

describe('cameraShortcuts', () => {
  it('resolves the current exact-shift viewer camera shortcut map', () => {
    for (const binding of viewerCameraShortcutBindings) {
      expect(
        resolveViewerCameraShortcutAction({
          key: binding.label,
          code: binding.code,
        }),
      ).toBe(binding.action)
    }
  })

  it('does not resolve shortcuts without a matching numpad code and no extra modifiers', () => {
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
        key: '5',
        code: 'Numpad5',
        shiftKey: true,
        ctrlKey: true,
      }),
    ).toBeNull()

    expect(
      resolveViewerCameraShortcutAction({
        key: '8',
        code: 'Numpad8',
        altKey: true,
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
