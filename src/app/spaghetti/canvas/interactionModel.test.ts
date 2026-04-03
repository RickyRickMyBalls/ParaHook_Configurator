// @vitest-environment jsdom

import { describe, expect, it } from 'vitest'
import {
  getNodeInteractionBehavior,
  readCanvasPointerTargetState,
  shouldClearCanvasSelection,
  type CanvasPointerTargetState,
} from './interactionModel'

const emptyCanvasTarget = (
  overrides: Partial<CanvasPointerTargetState> = {},
): CanvasPointerTargetState => ({
  interactive: false,
  insideNode: false,
  insidePort: false,
  insideWire: false,
  insideWireWaypoint: false,
  insideWireLoop: false,
  insideWireGap: false,
  ...overrides,
})

describe('interactionModel', () => {
  it('body click selects node', () => {
    expect(getNodeInteractionBehavior('body')).toEqual({
      selectsNode: true,
      startsDrag: false,
    })
  })

  it('header click selects node', () => {
    expect(getNodeInteractionBehavior('header').selectsNode).toBe(true)
  })

  it('header click is the only drag start path', () => {
    expect(getNodeInteractionBehavior('header').startsDrag).toBe(true)
    expect(getNodeInteractionBehavior('body').startsDrag).toBe(false)
    expect(getNodeInteractionBehavior('control').startsDrag).toBe(false)
  })

  it('control click does not clear selection', () => {
    expect(
      shouldClearCanvasSelection(
        emptyCanvasTarget({
          interactive: true,
          insideNode: true,
        }),
      ),
    ).toBe(false)
  })

  it('control click does not start drag', () => {
    expect(getNodeInteractionBehavior('control').startsDrag).toBe(false)
  })

  it('empty canvas click clears selection', () => {
    expect(shouldClearCanvasSelection(emptyCanvasTarget())).toBe(true)
  })

  it('inside-node click does not incorrectly clear selection', () => {
    expect(
      shouldClearCanvasSelection(
        emptyCanvasTarget({
          insideNode: true,
        }),
      ),
    ).toBe(false)
  })

  it('reads canvas pointer targets from a child-window element realm', () => {
    const iframe = document.createElement('iframe')
    document.body.appendChild(iframe)
    const popupDocument = iframe.contentDocument
    expect(popupDocument).not.toBeNull()

    const node = popupDocument!.createElement('div')
    node.className = 'SpaghettiNode'
    const button = popupDocument!.createElement('button')
    node.appendChild(button)
    popupDocument!.body.appendChild(node)

    expect(readCanvasPointerTargetState(button)).toEqual({
      interactive: true,
      insideNode: true,
      insidePort: false,
      insideWire: false,
      insideWireWaypoint: false,
      insideWireLoop: false,
      insideWireGap: false,
    })

    iframe.remove()
  })
})
