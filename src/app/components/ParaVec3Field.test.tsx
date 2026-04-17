// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

import { ParaVec3Field } from './ParaVec3Field'

describe('ParaVec3Field', () => {
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

  it('renders a collapsed compact ParaVec3Slider and expands into stacked row sliders from the header toggle', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaVec3Field
          label="Position"
          value={{ x: 11.4, y: 13, z: 8 }}
          min={-300}
          max={300}
          step={0.1}
          onChangeAxis={() => {}}
          displayValue={(_axis, value) => value.toFixed(1)}
        />,
      )
    })

    const toggleButton = container.querySelector(
      'button[aria-label="Toggle Position"]',
    ) as HTMLButtonElement | null
    expect(toggleButton?.getAttribute('aria-expanded')).toBe('false')
    expect(container.querySelector('.ParaVec3FieldCompact')).not.toBeNull()
    expect(container.querySelector('.ParaVec3Slider')?.classList.contains('isCompact')).toBe(true)
    expect(container.querySelector('.ParaVec3Slider')?.textContent).toContain('X')
    expect(container.querySelector('.ParaVec3Slider')?.textContent).toContain('11.4')

    await act(async () => {
      toggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(toggleButton?.getAttribute('aria-expanded')).toBe('true')
    expect(container.querySelector('.ParaVec3FieldCompact')).toBeNull()
    expect(container.querySelector('.ParaVec3Slider')).not.toBeNull()
    expect(container.querySelector('.ParaVec3Slider')?.classList.contains('isStacked')).toBe(true)
    expect(container.querySelectorAll('.ParaVec3Slider .ParaSliderTrack')).toHaveLength(3)
  })

  it('forwards axis changes through the expanded low-level ParaVec3Slider', async () => {
    const handleAxisChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaVec3Field
          label="Target"
          value={{ x: 0, y: 10, z: 20 }}
          min={-100}
          max={100}
          step={1}
          onChangeAxis={handleAxisChange}
          defaultExpanded
          displayValue={(_axis, value) => value.toFixed(0)}
        />,
      )
    })

    const firstTrack = container.querySelector('.ParaVec3Slider .ParaSliderTrack') as
      | HTMLDivElement
      | null
    expect(firstTrack).not.toBeNull()
    expect(container.querySelector('.ParaVec3Slider')?.classList.contains('isStacked')).toBe(true)

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
