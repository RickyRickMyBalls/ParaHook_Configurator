// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

import { ParaSlider } from './ParaSlider'

describe('ParaSlider', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
  })

  it('keeps value stepping active while clamp edit mode is on', async () => {
    const handleChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Window Fill"
          min={0}
          max={1}
          step={0.05}
          value={0.8}
          clampMin={0.65}
          clampMax={1}
          isEditingClamp
          onChange={handleChange}
          onClampChange={vi.fn()}
          formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
        />,
      )
    })

    const decreaseButton = container.querySelector(
      'button[aria-label="Decrease Window Fill"]',
    ) as HTMLButtonElement | null
    expect(decreaseButton).not.toBeNull()

    await act(async () => {
      decreaseButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(handleChange).toHaveBeenCalledWith(0.75)
  })

  it('drags the left clamp handle against the full base range in clamp mode', async () => {
    const handleClampChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Title Bar"
          min={0}
          max={1}
          step={0.05}
          value={0.8}
          clampMin={0.65}
          clampMax={1}
          isEditingClamp
          onChange={vi.fn()}
          onClampChange={handleClampChange}
          formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
        />,
      )
    })

    const track = container.querySelector('.ParaSliderTrack') as HTMLDivElement | null
    const leftHandle = container.querySelector(
      'button[aria-label="Adjust minimum Title Bar clamp"]',
    ) as HTMLButtonElement | null

    expect(track).not.toBeNull()
    expect(leftHandle).not.toBeNull()

    Object.defineProperty(track, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 30,
        right: 100,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => '',
      }),
    })

    await act(async () => {
      leftHandle?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0, clientX: 65 }),
      )
      window.dispatchEvent(new PointerEvent('pointermove', { clientX: 0 }))
      window.dispatchEvent(new PointerEvent('pointerup', {}))
    })

    expect(handleClampChange).toHaveBeenCalledWith({ min: 0, max: 1 })
  })
})
