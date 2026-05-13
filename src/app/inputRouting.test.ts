// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  dispatchEditHistoryShortcut,
  routeKeyboardInput,
} from './inputRouting'
import { useShortcutPreferencesStore } from './shortcutPreferencesStore'

describe('routeKeyboardInput', () => {
  const createEvent = (key: string): KeyboardEvent =>
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })

  beforeEach(() => {
    useShortcutPreferencesStore.getState().resetShortcutPreferences()
  })

  it('defers to native text editing when a real text field owns focus', () => {
    const input = document.createElement('input')
    const result = routeKeyboardInput({
      event: { key: 'Escape', target: input },
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'text-field',
      decision: 'defer-native',
    })
  })

  it('defers native undo and redo shortcuts for editable targets', () => {
    const targets = [
      document.createElement('input'),
      document.createElement('textarea'),
      document.createElement('select'),
      document.createElement('div'),
    ]
    targets[3].setAttribute('contenteditable', 'true')

    for (const target of targets) {
      expect(routeKeyboardInput({
        event: {
          key: 'z',
          ctrlKey: true,
          target,
        },
        editHistoryCanUndo: true,
      })).toEqual({
        owner: 'text-field',
        decision: 'defer-native',
      })

      expect(routeKeyboardInput({
        event: {
          key: 'y',
          ctrlKey: true,
          target,
        },
        editHistoryCanRedo: true,
      })).toEqual({
        owner: 'text-field',
        decision: 'defer-native',
      })
    }
  })

  it('routes focused console undo and redo to active sketch draw when there is no unsent console draft', () => {
    const input = document.createElement('input')
    input.dataset.consoleInput = 'true'

    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: input,
      },
      consoleCommandSessionUndoOwner: 'sketch-draw',
      consoleInputAllowsCommandSessionUndo: true,
    })).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
      sketchDrawAction: 'undo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'y',
        ctrlKey: true,
        target: input,
      },
      consoleCommandSessionUndoOwner: 'sketch-draw',
      consoleInputAllowsCommandSessionUndo: true,
    })).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
      sketchDrawAction: 'redo',
    })
  })

  it('preserves native undo for focused console input with a meaningful unsent draft', () => {
    const input = document.createElement('input')
    input.dataset.consoleInput = 'true'

    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: input,
      },
      consoleCommandSessionUndoOwner: 'sketch-draw',
      consoleInputAllowsCommandSessionUndo: false,
    })).toEqual({
      owner: 'text-field',
      decision: 'defer-native',
    })
  })

  it('routes available undo and redo shortcuts to edit history in normal contexts', () => {
    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanUndo: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'undo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'z',
        metaKey: true,
        target: null,
      },
      editHistoryCanUndo: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'undo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'y',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanRedo: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'redo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'z',
        metaKey: true,
        shiftKey: true,
        target: null,
      },
      editHistoryCanRedo: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'redo',
    })
  })

  it('routes undo and redo shortcuts to sketch draw while draw mode is active', () => {
    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanUndo: true,
      geometrySketchMode: 'draw',
      viewerCameraShortcutsEnabled: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
      sketchDrawAction: 'undo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'y',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanRedo: true,
      geometrySketchMode: 'draw',
      viewerCameraShortcutsEnabled: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
      sketchDrawAction: 'redo',
    })
  })

  it('routes available undo and redo shortcuts to edit history while reference transform is active', () => {
    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanUndo: true,
      referenceTransformActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'undo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'y',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanRedo: true,
      referenceTransformActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'redo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'z',
        metaKey: true,
        shiftKey: true,
        target: null,
      },
      editHistoryCanRedo: true,
      referenceTransformActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'redo',
    })
  })

  it('leaves unavailable undo and redo shortcuts unclaimed while reference transform is active', () => {
    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanUndo: false,
      referenceTransformActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'none',
      decision: 'ignore',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'y',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanRedo: false,
      referenceTransformActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
  })

  it('does not claim unavailable edit history undo and redo shortcuts', () => {
    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanUndo: false,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'none',
      decision: 'ignore',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'y',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanRedo: false,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
  })

  it('keeps unavailable canonical dispatch from changing runtime or view-like event handling', () => {
    const owner = {
      canUndo: vi.fn(() => false),
      canRedo: vi.fn(() => false),
      undo: vi.fn(),
      redo: vi.fn(),
    }
    const event = {
      preventDefault: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    }

    const unavailableUndoRoute = routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanUndo: false,
      viewerCameraShortcutsEnabled: true,
      allowFlatConsoleCapture: true,
    })
    expect(unavailableUndoRoute).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
    expect(dispatchEditHistoryShortcut(unavailableUndoRoute, event, owner)).toBe(false)
    expect(owner.undo).not.toHaveBeenCalled()
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled()
  })

  it('dispatches edit history shortcuts only when the owner can perform them', () => {
    const owner = {
      canUndo: vi.fn(() => true),
      canRedo: vi.fn(() => true),
      undo: vi.fn(),
      redo: vi.fn(),
    }
    const event = {
      preventDefault: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    }

    expect(dispatchEditHistoryShortcut({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'undo',
    }, event, owner)).toBe(true)
    expect(owner.undo).toHaveBeenCalledTimes(1)
    expect(event.preventDefault).toHaveBeenCalledTimes(1)
    expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(1)

    expect(dispatchEditHistoryShortcut({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'redo',
    }, event, owner)).toBe(true)
    expect(owner.redo).toHaveBeenCalledTimes(1)
    expect(event.preventDefault).toHaveBeenCalledTimes(2)
    expect(event.stopImmediatePropagation).toHaveBeenCalledTimes(2)
  })

  it('leaves unavailable edit history dispatch unclaimed', () => {
    const owner = {
      canUndo: vi.fn(() => false),
      canRedo: vi.fn(() => false),
      undo: vi.fn(),
      redo: vi.fn(),
    }
    const event = {
      preventDefault: vi.fn(),
      stopImmediatePropagation: vi.fn(),
    }

    expect(dispatchEditHistoryShortcut({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'undo',
    }, event, owner)).toBe(false)
    expect(dispatchEditHistoryShortcut({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'redo',
    }, event, owner)).toBe(false)
    expect(owner.undo).not.toHaveBeenCalled()
    expect(owner.redo).not.toHaveBeenCalled()
    expect(event.preventDefault).not.toHaveBeenCalled()
    expect(event.stopImmediatePropagation).not.toHaveBeenCalled()
  })

  it('gives Escape to sketch-plane pick before staged console', () => {
    const result = routeKeyboardInput({
      event: createEvent('Escape'),
      sketchPlanePickStage: 'adjust',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'sketch-plane',
      decision: 'handle',
    })
  })

  it('gives active fly mode keyboard ownership before console capture for unmodified keys', () => {
    expect(
      routeKeyboardInput({
        event: createEvent('w'),
        viewerFlyActive: true,
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'viewer-fly',
      decision: 'handle',
    })

    expect(
      routeKeyboardInput({
        event: createEvent(' '),
        viewerFlyActive: true,
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'viewer-fly',
      decision: 'handle',
    })

    expect(
      routeKeyboardInput({
        event: createEvent('q'),
        viewerFlyActive: true,
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'viewer-fly',
      decision: 'handle',
    })
  })

  it('keeps fly movement keys owned by the viewer even when Ctrl is held for descend', () => {
    const descendResult = routeKeyboardInput({
      event: {
        key: 'Control',
        ctrlKey: true,
        target: null,
      },
      viewerFlyActive: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(descendResult).toEqual({
      owner: 'viewer-fly',
      decision: 'handle',
    })

    const forwardWhileDescendingResult = routeKeyboardInput({
      event: {
        key: 'w',
        ctrlKey: true,
        target: null,
      },
      viewerFlyActive: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(forwardWhileDescendingResult).toEqual({
      owner: 'viewer-fly',
      decision: 'handle',
    })
  })

  it('does not claim unrelated modified shortcuts for fly mode through the shared routing seam', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'r',
        ctrlKey: true,
        target: null,
      },
      viewerFlyActive: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'none',
      decision: 'ignore',
    })

    expect(
      routeKeyboardInput({
        event: {
          key: 'q',
          ctrlKey: true,
          target: null,
        },
        viewerFlyActive: true,
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
  })

  it('routes Enter to staged console while a guided session is active', () => {
    const result = routeKeyboardInput({
      event: createEvent('Enter'),
      sketchPlanePickStage: 'adjust',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('gives Escape to sketch draw before reference transform and staged console', () => {
    const result = routeKeyboardInput({
      event: createEvent('Escape'),
      geometrySketchMode: 'draw',
      referenceTransformActive: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
    })
  })

  it('routes Delete to sketch draw while sketch draw is active', () => {
    const result = routeKeyboardInput({
      event: createEvent('Delete'),
      geometrySketchMode: 'draw',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
    })
  })

  it('routes Delete to selected reference targets when delete is available', () => {
    const result = routeKeyboardInput({
      event: createEvent('Delete'),
      selectedReferenceDeleteAvailable: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'reference-selection',
      decision: 'handle',
    })
  })

  it('routes Shift+H to selected reference targets when hide is available', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'H',
        shiftKey: true,
        target: null,
      },
      selectedReferenceHideAvailable: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'reference-selection',
      decision: 'handle',
    })
  })

  it('routes Alt+H to reference visibility recovery when hidden references exist', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'H',
        altKey: true,
        target: null,
      },
      hiddenReferenceRestoreAvailable: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'reference-selection',
      decision: 'handle',
    })
  })

  it('routes active viewer camera shortcuts before flat console capture', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'Z',
        code: 'KeyZ',
        shiftKey: true,
        target: null,
      },
      viewerCameraShortcutsEnabled: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'viewer-camera-shortcuts',
      decision: 'handle',
    })
  })

  it('routes custom active viewer camera shortcuts before flat console capture', () => {
    useShortcutPreferencesStore.getState().setShortcutBindingOverrides([
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:preset-top',
        bindingValue: { kind: 'keyboard', code: 'Digit1' },
      },
    ])

    const result = routeKeyboardInput({
      event: {
        key: '1',
        code: 'Digit1',
        target: null,
      },
      viewerCameraShortcutsEnabled: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'viewer-camera-shortcuts',
      decision: 'handle',
    })
  })

  it('leaves overlapping custom viewer camera shortcuts unclaimed', () => {
    useShortcutPreferencesStore.getState().setShortcutBindingOverrides([
      {
        basePresetId: 'default',
        rowId: 'viewer-camera-shortcuts:preset-front',
        bindingValue: { kind: 'keyboard', code: 'Numpad5' },
      },
    ])

    const result = routeKeyboardInput({
      event: {
        key: '5',
        code: 'Numpad5',
        target: null,
      },
      viewerCameraShortcutsEnabled: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('routes active viewer display mode shortcut before flat console capture', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'D',
        code: 'KeyD',
        shiftKey: true,
        target: null,
      },
      viewerDisplayModeShortcutsEnabled: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'viewer-display-mode',
      decision: 'handle',
    })
  })

  it('keeps Shift+D display mode dormant while fly mode is active', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'D',
        code: 'KeyD',
        shiftKey: true,
        target: null,
      },
      viewerFlyActive: true,
      viewerDisplayModeShortcutsEnabled: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'viewer-fly',
      decision: 'handle',
    })
  })

  it('routes Shortcuts-first plain Z to active viewer camera shortcuts before console capture', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'z',
        code: 'KeyZ',
        target: null,
      },
      viewerCameraShortcutsEnabled: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })

    expect(result).toEqual({
      owner: 'viewer-camera-shortcuts',
      decision: 'handle',
    })
  })

  it('does not route Shortcuts-first Shift+Z as the active viewer camera shortcut', () => {
    const result = routeKeyboardInput({
      event: {
        key: 'Z',
        code: 'KeyZ',
        shiftKey: true,
        target: null,
      },
      viewerCameraShortcutsEnabled: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })

    expect(result).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
  })

  it('keeps camera navigation shortcuts out of edit history routing', () => {
    expect(routeKeyboardInput({
      event: {
        key: 'Z',
        code: 'KeyZ',
        shiftKey: true,
        target: null,
      },
      editHistoryCanUndo: true,
      editHistoryCanRedo: true,
      viewerCameraShortcutsEnabled: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'viewer-camera-shortcuts',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: {
        key: '5',
        code: 'Numpad5',
        target: null,
      },
      editHistoryCanUndo: true,
      editHistoryCanRedo: true,
      viewerCameraShortcutsEnabled: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'viewer-camera-shortcuts',
      decision: 'handle',
    })
  })

  it('keeps viewer camera shortcuts dormant while fly mode is active', () => {
    const result = routeKeyboardInput({
      event: {
        key: '5',
        code: 'Numpad5',
        target: null,
      },
      viewerFlyActive: true,
      viewerCameraShortcutsEnabled: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('routes m/r/s to reference transform before console capture', () => {
    expect(
      routeKeyboardInput({
        event: createEvent('m'),
        referenceTransformActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'reference-transform',
      decision: 'handle',
    })

    expect(
      routeKeyboardInput({
        event: createEvent('s'),
        referenceTransformActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'reference-transform',
      decision: 'handle',
    })
  })

  it('keeps transform-local keys owned by reference transform when edit history is available', () => {
    expect(routeKeyboardInput({
      event: createEvent('Escape'),
      editHistoryCanUndo: true,
      editHistoryCanRedo: true,
      referenceTransformActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'reference-transform',
      decision: 'handle',
    })

    for (const key of ['m', 'r', 's']) {
      expect(routeKeyboardInput({
        event: createEvent(key),
        editHistoryCanUndo: true,
        editHistoryCanRedo: true,
        referenceTransformActive: true,
        allowFlatConsoleCapture: true,
      })).toEqual({
        owner: 'reference-transform',
        decision: 'handle',
      })
    }
  })

  it('lets x/y/z fall back to console capture during a live reference transform entry', () => {
    const result = routeKeyboardInput({
      event: createEvent('x'),
      referenceTransformActive: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('uses staged console for printable token capture when no higher owner is active', () => {
    const result = routeKeyboardInput({
      event: createEvent('b'),
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('keeps Console-first C as ordinary Console capture instead of deliberate Console entry', () => {
    expect(routeKeyboardInput({
      event: createEvent('c'),
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'console-first',
    })).toEqual({
      owner: 'flat-console',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: createEvent('c'),
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'console-first',
    })).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('suppresses ordinary printable console capture in Shortcuts-first mode', () => {
    expect(routeKeyboardInput({
      event: createEvent('b'),
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'none',
      decision: 'ignore',
    })

    expect(routeKeyboardInput({
      event: createEvent('b'),
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
  })

  it('routes Shortcuts-first C to deliberate Console entry when no higher owner claims it', () => {
    const result = routeKeyboardInput({
      event: createEvent('c'),
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })

    expect(result).toEqual({
      owner: 'console-entry',
      decision: 'handle',
    })
  })

  it('does not route Shortcuts-first C to Console entry when Console capture is not enabled', () => {
    const result = routeKeyboardInput({
      event: createEvent('c'),
      consoleInputPriorityMode: 'shortcuts-first',
    })

    expect(result).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
  })

  it('keeps Shortcuts-first deliberate Console entry limited to an unmodified C key', () => {
    for (const event of [
      { key: 'C', shiftKey: true, target: null },
      { key: 'c', ctrlKey: true, target: null },
      { key: 'c', altKey: true, target: null },
      { key: 'c', metaKey: true, target: null },
    ]) {
      expect(routeKeyboardInput({
        event,
        allowFlatConsoleCapture: true,
        consoleInputPriorityMode: 'shortcuts-first',
      })).toEqual({
        owner: 'none',
        decision: 'ignore',
      })
    }
  })

  it('keeps higher-priority owners ahead of Shortcuts-first Console entry', () => {
    const input = document.createElement('input')

    expect(routeKeyboardInput({
      event: {
        key: 'c',
        target: input,
      },
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'text-field',
      decision: 'defer-native',
    })
  })

  it('keeps edit history shortcuts ahead of Shortcuts-first Console entry and printable suppression', () => {
    expect(routeKeyboardInput({
      event: {
        key: 'z',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanUndo: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'undo',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'y',
        ctrlKey: true,
        target: null,
      },
      editHistoryCanRedo: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'edit-history',
      decision: 'handle',
      editHistoryAction: 'redo',
    })
  })

  it('keeps fly movement ownership ahead of Shortcuts-first printable suppression', () => {
    for (const key of ['w', 'a', 's', 'd', 'q', 'e', 'Shift', 'Control', ' ']) {
      expect(routeKeyboardInput({
        event: createEvent(key),
        viewerFlyActive: true,
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
        consoleInputPriorityMode: 'shortcuts-first',
      })).toEqual({
        owner: 'viewer-fly',
        decision: 'handle',
      })
    }
  })

  it('keeps staged console capture active while sketch draw is active', () => {
    const result = routeKeyboardInput({
      event: createEvent('b'),
      geometrySketchMode: 'draw',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('keeps sketch draw command ownership ahead of Shortcuts-first routing changes', () => {
    expect(routeKeyboardInput({
      event: createEvent('Escape'),
      geometrySketchMode: 'draw',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: createEvent('Delete'),
      geometrySketchMode: 'draw',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'sketch-draw',
      decision: 'handle',
    })
  })

  it('allows console capture while sketch-plane pick is active', () => {
    const result = routeKeyboardInput({
      event: createEvent('b'),
      sketchPlanePickStage: 'pick',
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'flat-console',
      decision: 'handle',
    })
  })

  it('keeps sketch-plane local ownership ahead of Shortcuts-first Console entry', () => {
    expect(routeKeyboardInput({
      event: createEvent('Escape'),
      sketchPlanePickStage: 'pick',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'sketch-plane',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: createEvent('m'),
      sketchPlanePickStage: 'adjust',
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'sketch-plane',
      decision: 'handle',
    })
  })

  it('keeps staged console capture active while reference transform is active', () => {
    const result = routeKeyboardInput({
      event: createEvent('b'),
      referenceTransformActive: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('keeps reference command ownership ahead of Shortcuts-first routing changes', () => {
    expect(routeKeyboardInput({
      event: createEvent('m'),
      referenceTransformActive: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'reference-transform',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: {
        key: 'H',
        shiftKey: true,
        target: null,
      },
      selectedReferenceHideAvailable: true,
      allowFlatConsoleCapture: true,
      consoleInputPriorityMode: 'shortcuts-first',
    })).toEqual({
      owner: 'reference-selection',
      decision: 'handle',
    })
  })

  it('does not treat space as a global console capture key', () => {
    const result = routeKeyboardInput({
      event: createEvent(' '),
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })

    expect(result).toEqual({
      owner: 'none',
      decision: 'ignore',
    })
  })

  it('routes arrow up and down to staged console while a staged session is active', () => {
    expect(
      routeKeyboardInput({
        event: createEvent('ArrowUp'),
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })

    expect(
      routeKeyboardInput({
        event: createEvent('ArrowDown'),
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
      }),
    ).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })
  })

  it('keeps staged console submit, cancel, and recall owners ahead of Shortcuts-first routing changes', () => {
    for (const key of ['Enter', 'Escape', 'ArrowUp', 'ArrowDown']) {
      expect(routeKeyboardInput({
        event: createEvent(key),
        stagedConsoleActive: true,
        allowFlatConsoleCapture: true,
        consoleInputPriorityMode: 'shortcuts-first',
      })).toEqual({
        owner: 'staged-console',
        decision: 'handle',
      })
    }
  })

  it('keeps console recall, focus/menu, sketch, and reference local owners out of edit history routing', () => {
    expect(routeKeyboardInput({
      event: createEvent('ArrowUp'),
      editHistoryCanUndo: true,
      editHistoryCanRedo: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: createEvent('ArrowDown'),
      editHistoryCanUndo: true,
      editHistoryCanRedo: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: createEvent('Escape'),
      editHistoryCanUndo: true,
      sketchPlanePickStage: 'pick',
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'sketch-plane',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: createEvent('m'),
      editHistoryCanUndo: true,
      referenceTransformActive: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'reference-transform',
      decision: 'handle',
    })
  })

  it('keeps command transcript and runtime-like printable keys as console-local capture', () => {
    expect(routeKeyboardInput({
      event: createEvent('b'),
      editHistoryCanUndo: true,
      editHistoryCanRedo: true,
      stagedConsoleActive: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'staged-console',
      decision: 'handle',
    })

    expect(routeKeyboardInput({
      event: createEvent('b'),
      editHistoryCanUndo: true,
      editHistoryCanRedo: true,
      allowFlatConsoleCapture: true,
    })).toEqual({
      owner: 'flat-console',
      decision: 'handle',
    })
  })
})
