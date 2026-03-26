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
