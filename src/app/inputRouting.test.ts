// @vitest-environment jsdom
import { describe, expect, it } from 'vitest'
import { routeKeyboardInput } from './inputRouting'

describe('routeKeyboardInput', () => {
  const createEvent = (key: string): KeyboardEvent =>
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true })

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
})
