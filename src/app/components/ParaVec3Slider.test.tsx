// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

import { ParaVec3Slider } from './ParaVec3Slider'

describe('ParaVec3Slider', () => {
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

  it('renders three capless axis tracks and forwards axis changes', async () => {
    const handleAxisChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaVec3Slider
          value={{ x: 0, y: 10, z: 20 }}
          min={-100}
          max={100}
          step={1}
          onChangeAxis={handleAxisChange}
          displayValue={(_axis, value) => value.toFixed(0)}
        />,
      )
    })

    expect(container.querySelectorAll('.ParaVec3SliderAxis')).toHaveLength(3)
    expect(container.querySelectorAll('.ParaVec3Slider .ParaSliderCap')).toHaveLength(0)
    expect(container.querySelectorAll('.ParaVec3Slider .ParaSliderTrack')).toHaveLength(3)

    const tracks = container.querySelectorAll('.ParaVec3Slider .ParaSliderTrack')
    const firstTrack = tracks[0] as HTMLDivElement | undefined
    expect(firstTrack).toBeDefined()

    Object.defineProperty(firstTrack, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 26,
        right: 100,
        bottom: 26,
        x: 0,
        y: 0,
        toJSON: () => '',
      }),
    })

    await act(async () => {
      firstTrack?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 75,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
    })

    expect(handleAxisChange).toHaveBeenCalled()
    expect(handleAxisChange.mock.calls[0]?.[0]).toBe('x')
  })
})
