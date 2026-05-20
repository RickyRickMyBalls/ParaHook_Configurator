import { describe, expect, it } from 'vitest'
import {
  resolveViewerCameraShortcutAction,
  viewerCameraShortcutBindings,
} from './cameraShortcuts'

describe('cameraShortcuts', () => {
  const cameraPresetBindings = viewerCameraShortcutBindings.filter(
    (binding) => binding.action !== 'zoom-object',
  )

  it('resolves built-in camera preset shortcuts as shifted numpad in Console-first mode', () => {
    for (const binding of cameraPresetBindings) {
      expect(
        resolveViewerCameraShortcutAction({
          key: binding.label,
          code: binding.code,
          shiftKey: true,
        }),
      ).toBe(binding.action)

      expect(
        resolveViewerCameraShortcutAction({
          key: binding.label,
          code: binding.code,
        }),
      ).toBeNull()
    }
  })

  it('resolves built-in camera preset shortcuts as plain numpad in Shortcuts-first mode', () => {
    for (const binding of cameraPresetBindings) {
      expect(
        resolveViewerCameraShortcutAction(
          {
            key: binding.label,
            code: binding.code,
          },
          'shortcuts-first',
        ),
      ).toBe(binding.action)

      expect(
        resolveViewerCameraShortcutAction(
          {
            key: binding.label,
            code: binding.code,
            shiftKey: true,
          },
          'shortcuts-first',
        ),
      ).toBeNull()
    }
  })

  it('keeps Zoom Object priority-aware', () => {
    expect(resolveViewerCameraShortcutAction({
      key: 'Z',
      code: 'KeyZ',
      shiftKey: true,
    })).toBe('zoom-object')

    expect(resolveViewerCameraShortcutAction(
      {
        key: 'z',
        code: 'KeyZ',
      },
      'shortcuts-first',
    )).toBe('zoom-object')
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

    expect(
      resolveViewerCameraShortcutAction(
        {
          key: '4',
          code: 'Numpad4',
          shiftKey: true,
        },
        'shortcuts-first',
      ),
    ).toBeNull()
  })
})
