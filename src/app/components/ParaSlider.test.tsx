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

  it('keeps the fill bar anchored at zero while clamp edit mode is on', async () => {
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
          onChange={vi.fn()}
          onClampChange={vi.fn()}
          formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
        />,
      )
    })

    const fill = container.querySelector('.ParaSliderFill') as HTMLDivElement | null
    expect(fill).not.toBeNull()
    expect(fill?.style.left).toBe('0%')
    expect(fill?.style.width).toBe('80%')
  })

  it('lets the user type clamp min and max values while clamp edit mode is on', async () => {
    const handleClampChange = vi.fn()
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
          onChange={vi.fn()}
          onClampChange={handleClampChange}
          formatValue={(nextValue) => `${Math.round(nextValue * 100)}%`}
        />,
      )
    })

    const minInput = container.querySelector(
      'input[aria-label="Edit minimum Window Fill clamp"]',
    ) as HTMLInputElement | null
    const maxInput = container.querySelector(
      'input[aria-label="Edit maximum Window Fill clamp"]',
    ) as HTMLInputElement | null

    expect(minInput).not.toBeNull()
    expect(maxInput).not.toBeNull()

    await act(async () => {
      if (minInput !== null) {
        minInput.value = '0.4'
        minInput.dispatchEvent(new Event('input', { bubbles: true }))
        minInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      minInput?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    await act(async () => {
      if (maxInput !== null) {
        maxInput.value = '0.9'
        maxInput.dispatchEvent(new Event('input', { bubbles: true }))
        maxInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      maxInput?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(handleClampChange).toHaveBeenNthCalledWith(1, { min: 0.4, max: 1 })
    expect(handleClampChange).toHaveBeenNthCalledWith(2, { min: 0.65, max: 0.9 })
  })

  it('disables direct value editing and track focus when disabled', async () => {
    const handleChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Depth"
          min={0.1}
          max={2000}
          step={0.1}
          value={20}
          disabled
          onChange={handleChange}
          formatValue={(nextValue) => `${nextValue.toFixed(1)} mm`}
          displayValue="20 mm"
          hideCaps
        />,
      )
    })

    const track = container.querySelector('.ParaSliderTrack') as HTMLDivElement | null
    const valueButton = container.querySelector(
      'button[aria-label="Edit Depth value"]',
    ) as HTMLButtonElement | null

    expect(track?.getAttribute('tabindex')).toBe('-1')
    expect(track?.getAttribute('aria-disabled')).toBe('true')
    expect(valueButton?.disabled).toBe(true)

    await act(async () => {
      valueButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('input[aria-label="Edit Depth value"]')).toBeNull()
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('uses 10x finer sensitivity and step quantization while shift-dragging the value', async () => {
    const handleChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Scale X"
          min={0}
          max={10}
          step={1}
          value={5}
          onChange={handleChange}
        />,
      )
    })

    const track = container.querySelector('.ParaSliderTrack') as HTMLDivElement | null
    expect(track).not.toBeNull()

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
      track?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 50,
          shiftKey: true,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 60,
          shiftKey: true,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
    })

    expect(handleChange).toHaveBeenLastCalledWith(5.1)
  })

  it('wraps relative drag past the minimum when wrap mode is enabled', async () => {
    const handleChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Rotate X"
          min={-180}
          max={180}
          step={1}
          value={-180}
          allowWrap
          onChange={handleChange}
        />,
      )
    })

    const track = container.querySelector('.ParaSliderTrack') as HTMLDivElement | null
    expect(track).not.toBeNull()

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
      track?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 0,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: -10,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
    })

    expect(handleChange).toHaveBeenLastCalledWith(144)
  })

  it('applies snapped drag deltas relative to the current wrapped value', async () => {
    const handleChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Rotate X"
          min={-180}
          max={180}
          step={5}
          value={121}
          allowWrap
          onChange={handleChange}
        />,
      )
    })

    const track = container.querySelector('.ParaSliderTrack') as HTMLDivElement | null
    expect(track).not.toBeNull()

    Object.defineProperty(track, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 360,
        height: 30,
        right: 360,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => '',
      }),
    })

    await act(async () => {
      track?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 121,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 126,
        }),
      )
      window.dispatchEvent(new PointerEvent('pointerup', {}))
    })

    expect(handleChange).toHaveBeenLastCalledWith(126)
  })

  it('shows continuous fill preview while keeping the snapped marker on the current value', async () => {
    const handleChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Rotate X"
          min={-180}
          max={180}
          step={5}
          value={121}
          allowWrap
          showContinuousDragPreview
          onChange={handleChange}
        />,
      )
    })

    const track = container.querySelector('.ParaSliderTrack') as HTMLDivElement | null
    expect(track).not.toBeNull()

    Object.defineProperty(track, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        left: 0,
        top: 0,
        width: 360,
        height: 30,
        right: 360,
        bottom: 30,
        x: 0,
        y: 0,
        toJSON: () => '',
      }),
    })

    await act(async () => {
      track?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 121,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          clientX: 123,
        }),
      )
    })

    const fill = container.querySelector('.ParaSliderFill') as HTMLDivElement | null
    const marker = container.querySelector('.ParaSliderValueMarker') as HTMLDivElement | null

    expect(fill?.style.width).toBe('84.16666666666667%')
    expect(marker?.style.left).toBe('83.61111111111111%')
    expect(handleChange).toHaveBeenLastCalledWith(121)
  })

  it('lets the user click the value and type a new number', async () => {
    const handleChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Rotate Z"
          min={-180}
          max={180}
          step={1}
          value={12}
          onChange={handleChange}
        />,
      )
    })

    const valueButton = container.querySelector(
      'button[aria-label="Edit Rotate Z value"]',
    ) as HTMLButtonElement | null
    expect(valueButton).not.toBeNull()

    await act(async () => {
      valueButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const valueInput = container.querySelector(
      'input[aria-label="Edit Rotate Z value"]',
    ) as HTMLInputElement | null
    expect(valueInput).not.toBeNull()

    await act(async () => {
      if (valueInput !== null) {
        valueInput.value = '12.5'
        valueInput.dispatchEvent(new Event('input', { bubbles: true }))
        valueInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      valueInput?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(handleChange).toHaveBeenLastCalledWith(12.5)
  })

  it('can display a live track value while keeping the authored value editable', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSlider
          label="Move X"
          min={-300}
          max={300}
          step={1}
          value={0}
          displayedTrackValue={60}
          onChange={vi.fn()}
        />,
      )
    })

    const fill = container.querySelector('.ParaSliderFill') as HTMLDivElement | null
    const valueButton = container.querySelector(
      'button[aria-label="Edit Move X value"]',
    ) as HTMLButtonElement | null

    expect(fill?.style.width).toBe('60%')
    expect(valueButton?.textContent?.trim()).toBe('0')
  })
})
