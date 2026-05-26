import { describe, expect, it } from 'vitest'
import {
  clampViewportFloatingToolPanelRect,
  resolveViewportFloatingToolPanelDrag,
  resolveViewportFloatingToolPanelRightAnchor,
  resolveViewportFloatingToolPanelResize,
} from './useViewportFloatingToolPanel'

describe('viewport floating tool panel behavior', () => {
  it('clamps drag placement inside the viewport margin', () => {
    expect(
      resolveViewportFloatingToolPanelDrag({
        startPosition: { left: 100, top: 80 },
        deltaX: 500,
        deltaY: 500,
        size: { width: 240, height: 160 },
        bounds: { width: 640, height: 420 },
        viewportMargin: 12,
      }),
    ).toEqual({ left: 388, top: 248 })

    expect(
      resolveViewportFloatingToolPanelDrag({
        startPosition: { left: 100, top: 80 },
        deltaX: -500,
        deltaY: -500,
        size: { width: 240, height: 160 },
        bounds: { width: 640, height: 420 },
        viewportMargin: 12,
      }),
    ).toEqual({ left: 12, top: 12 })
  })

  it('resizes from west and north edges while preserving the opposite edge', () => {
    expect(
      resolveViewportFloatingToolPanelResize({
        direction: 'nw',
        startPosition: { left: 100, top: 100 },
        startSize: { width: 300, height: 220 },
        deltaX: 80,
        deltaY: 40,
        minSize: { width: 260, height: 180 },
        bounds: { width: 800, height: 600 },
        viewportMargin: 12,
      }),
    ).toEqual({
      position: { left: 140, top: 140 },
      size: { width: 260, height: 180 },
    })
  })

  it('clamps east and south resizing to viewport bounds', () => {
    expect(
      resolveViewportFloatingToolPanelResize({
        direction: 'se',
        startPosition: { left: 20, top: 30 },
        startSize: { width: 300, height: 220 },
        deltaX: 900,
        deltaY: 900,
        minSize: { width: 260, height: 180 },
        bounds: { width: 640, height: 480 },
        viewportMargin: 12,
      }),
    ).toEqual({
      position: { left: 12, top: 12 },
      size: { width: 616, height: 456 },
    })
  })

  it('resolves right anchors from supplied viewport bounds', () => {
    expect(
      resolveViewportFloatingToolPanelRightAnchor({
        bounds: { width: 520, height: 480 },
        size: { width: 300, height: 360 },
        viewportMargin: 12,
        top: 22,
      }),
    ).toEqual({ left: 208, top: 22 })
  })

  it('clamps remembered manual placement into smaller viewport bounds', () => {
    expect(
      clampViewportFloatingToolPanelRect({
        bounds: { width: 420, height: 300 },
        viewportMargin: 12,
        rect: {
          left: 900,
          top: 700,
          width: 500,
          height: 420,
        },
      }),
    ).toEqual({
      left: 12,
      top: 12,
      width: 396,
      height: 276,
    })
  })
})
