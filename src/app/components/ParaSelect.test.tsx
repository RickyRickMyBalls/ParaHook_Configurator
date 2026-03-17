// @vitest-environment jsdom

import { act } from 'react'
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
      await act(async () => {
        root.unmount()
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
})
