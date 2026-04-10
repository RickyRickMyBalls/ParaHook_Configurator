// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

import { FeatureValueBar } from './FeatureValueBar'

describe('FeatureValueBar', () => {
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

  it('wraps arrow-button edits in an interaction lifecycle', async () => {
    const handleStart = vi.fn()
    const handleChange = vi.fn()
    const handleEnd = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <FeatureValueBar
          label="Depth"
          value={20}
          min={0}
          max={500}
          step={0.1}
          onChange={handleChange}
          onInteractionStart={handleStart}
          onInteractionEnd={handleEnd}
        />,
      )
    })

    const increaseButton = container.querySelector(
      'button[aria-label="Increase Depth"]',
    ) as HTMLButtonElement | null

    expect(increaseButton).not.toBeNull()

    await act(async () => {
      increaseButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalledWith(20.1)
    expect(handleEnd).toHaveBeenCalledTimes(1)
    expect(handleStart.mock.invocationCallOrder[0]).toBeLessThan(handleChange.mock.invocationCallOrder[0])
    expect(handleChange.mock.invocationCallOrder[0]).toBeLessThan(handleEnd.mock.invocationCallOrder[0])
  })

  it('starts on focus and ends on blur for typed edits', async () => {
    const handleStart = vi.fn()
    const handleChange = vi.fn()
    const handleEnd = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    function ControlledFeatureValueBar() {
      const [value, setValue] = useState(20)

      return (
        <FeatureValueBar
          label="Depth"
          value={value}
          min={0}
          max={500}
          step={0.1}
          onChange={(nextValue) => {
            setValue(nextValue)
            handleChange(nextValue)
          }}
          onInteractionStart={handleStart}
          onInteractionEnd={handleEnd}
        />
      )
    }

    await act(async () => {
      root?.render(<ControlledFeatureValueBar />)
    })

    const input = container.querySelector('input[type="number"]') as HTMLInputElement | null

    expect(input).not.toBeNull()

    await act(async () => {
      input?.focus()
    })

    await act(async () => {
      if (input !== null) {
        input.value = '28.7'
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      input?.blur()
    })

    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleEnd).toHaveBeenCalledTimes(1)
    expect(handleStart.mock.invocationCallOrder[0]).toBeLessThan(handleEnd.mock.invocationCallOrder[0])
  })
})
