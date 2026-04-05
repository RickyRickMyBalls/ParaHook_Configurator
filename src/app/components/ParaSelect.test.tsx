// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ParaSelect } from './ParaSelect'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('ParaSelect', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  afterEach(async () => {
    if (root !== null) {
      const currentRoot = root
      await act(async () => {
        currentRoot.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
  })

  it('wraps to the first option when incrementing past the end', async () => {
    const onChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSelect
          label="Fill Type"
          value="clear"
          options={[
            { value: 'blur', label: 'Blur' },
            { value: 'flat', label: 'Flat' },
            { value: 'clear', label: 'Clear' },
          ]}
          onChange={onChange}
        />,
      )
    })

    const next = container.querySelector(
      'button[aria-label="Next Fill Type"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      next?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onChange).toHaveBeenCalledWith('blur')
  })

  it('wraps to the last option when decrementing past the start', async () => {
    const onChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSelect
          label="Fill Type"
          value="blur"
          options={[
            { value: 'blur', label: 'Blur' },
            { value: 'flat', label: 'Flat' },
            { value: 'clear', label: 'Clear' },
          ]}
          onChange={onChange}
        />,
      )
    })

    const previous = container.querySelector(
      'button[aria-label="Previous Fill Type"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      previous?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onChange).toHaveBeenCalledWith('clear')
  })

  it('shows fill progress based on the selected option index', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSelect
          label="Background"
          value="four"
          options={[
            { value: 'zero', label: 'Zero' },
            { value: 'one', label: 'One' },
            { value: 'two', label: 'Two' },
            { value: 'three', label: 'Three' },
            { value: 'four', label: 'Four' },
          ]}
          onChange={() => {}}
        />,
      )
    })

    const fill = container.querySelector('.ParaSelectFill') as HTMLDivElement | null
    const marker = container.querySelector('.ParaSelectValueMarker') as HTMLDivElement | null

    expect(fill?.style.width).toBe('100%')
    expect(marker?.style.left).toBe('100%')
  })

  it('lets the visible fill follow a driven displayed value while the authored value text stays local', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSelect
          label="Type"
          value="Basic"
          displayedValue="Twist"
          options={[
            { value: 'Basic', label: 'Basic' },
            { value: 'Twist', label: 'Twist' },
          ]}
          onChange={() => {}}
          menuMode="custom"
          disabled
        />,
      )
    })

    const fill = container.querySelector('.ParaSelectFill') as HTMLDivElement | null
    const marker = container.querySelector('.ParaSelectValueHandle') as HTMLButtonElement | null
    const value = container.querySelector('.ParaSelectValue') as HTMLSpanElement | null
    const next = container.querySelector(
      'button[aria-label="Next Type"]',
    ) as HTMLButtonElement | null

    expect(fill?.style.width).toBe('100%')
    expect(marker?.style.left).toBe('100%')
    expect(value?.textContent).toContain('Basic')
    expect(next?.disabled).toBe(true)
  })

  it('advances the custom enum track with the endcap arrows and updates fill state', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const ControlledSelect = () => {
      const [value, setValue] = useState('Basic')
      return (
        <ParaSelect
          label="Type"
          value={value}
          options={[
            { value: 'Basic', label: 'Basic' },
            { value: 'Twist', label: 'Twist' },
          ]}
          onChange={setValue}
          menuMode="custom"
          capGlyph="chevron"
        />
      )
    }

    await act(async () => {
      root?.render(<ControlledSelect />)
    })

    const next = container.querySelector(
      'button[aria-label="Next Type"]',
    ) as HTMLButtonElement | null
    const fill = container.querySelector('.ParaSelectFill') as HTMLDivElement | null
    const marker = container.querySelector('.ParaSelectValueHandle') as HTMLButtonElement | null

    expect(fill?.style.width).toBe('0%')
    expect(marker?.style.left).toBe('0%')

    await act(async () => {
      next?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }))
      next?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(fill?.style.width).toBe('100%')
    expect(marker?.style.left).toBe('100%')
  })

  it('opens a styled menu and selects an option from the track button', async () => {
    const onChange = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSelect
          label="Graph"
          value="graph-1"
          options={[
            { value: 'graph-1', label: 'Graph 1' },
            { value: 'graph-2', label: 'Graph 2' },
          ]}
          onChange={onChange}
          menuMode="custom"
        />,
      )
    })

    const trackButton = container.querySelector(
      'button.ParaSelectTrackButton[aria-label="Graph"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      trackButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const menu = container.querySelector('.ParaSelectMenu') as HTMLDivElement | null
    const nextOption = Array.from(container.querySelectorAll('.ParaSelectMenuOption')).find(
      (button) => button.textContent === 'Graph 2',
    ) as HTMLButtonElement | undefined

    expect(menu).not.toBeNull()
    expect(nextOption).not.toBeUndefined()

    await act(async () => {
      nextOption?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onChange).toHaveBeenCalledWith('graph-2')
    expect(container.querySelector('.ParaSelectMenu')).toBeNull()
  })

  it('runs a custom menu action from the styled menu', async () => {
    const onAction = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ParaSelect
          label="Graph"
          value="graph-1"
          options={[{ value: 'graph-1', label: 'Graph 1' }]}
          onChange={() => {}}
          menuMode="custom"
          menuActions={[{ label: 'Add New Graph', onSelect: onAction }]}
        />,
      )
    })

    const trackButton = container.querySelector(
      'button.ParaSelectTrackButton[aria-label="Graph"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      trackButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const actionButton = Array.from(container.querySelectorAll('.ParaSelectMenuAction')).find(
      (button) => button.textContent === 'Add New Graph',
    ) as HTMLButtonElement | undefined

    expect(actionButton).not.toBeUndefined()

    await act(async () => {
      actionButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onAction).toHaveBeenCalledTimes(1)
    expect(container.querySelector('.ParaSelectMenu')).toBeNull()
  })

  it('drags the custom value handle to scrub selection without opening the menu', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const ControlledSelect = () => {
      const [value, setValue] = useState('graph-2')
      return (
        <ParaSelect
          label="Graph"
          value={value}
          options={[
            { value: 'graph-1', label: 'Graph 1' },
            { value: 'graph-2', label: 'Graph 2' },
            { value: 'graph-3', label: 'Graph 3' },
          ]}
          onChange={setValue}
          menuMode="custom"
        />
      )
    }

    await act(async () => {
      root?.render(<ControlledSelect />)
    })

    const track = container.querySelector('.ParaSelectTrack') as HTMLDivElement | null
    const handle = container.querySelector(
      'button.ParaSelectValueHandle[aria-label="Drag Graph selection"]',
    ) as HTMLButtonElement | null
    const fill = container.querySelector('.ParaSelectFill') as HTMLDivElement | null

    Object.defineProperty(track, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        x: 0,
        y: 0,
        left: 0,
        top: 0,
        width: 120,
        height: 30,
        right: 120,
        bottom: 30,
        toJSON: () => '',
      }),
    })

    expect(handle).not.toBeNull()
    expect(fill).not.toBeNull()
    expect(container.textContent).toContain('Graph 2')
    expect(fill?.style.width).toBe('50%')
    expect(handle?.style.left).toBe('50%')

    await act(async () => {
      handle?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0, clientX: 60 }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: 70 }),
      )
    })

    expect(container.textContent).toContain('Graph 2')
    expect(fill?.style.width).toBe('58.333333333333336%')
    expect(handle?.style.left).toBe('58.333333333333336%')

    await act(async () => {
      window.dispatchEvent(
        new PointerEvent('pointermove', { bubbles: true, cancelable: true, clientX: 120 }),
      )
      window.dispatchEvent(
        new PointerEvent('pointerup', { bubbles: true, cancelable: true, clientX: 120 }),
      )
    })

    expect(container.textContent).toContain('Graph 3')
    expect(fill?.style.width).toBe('100%')
    expect(handle?.style.left).toBe('100%')
    expect(container.querySelector('.ParaSelectMenu')).toBeNull()
  })
})
