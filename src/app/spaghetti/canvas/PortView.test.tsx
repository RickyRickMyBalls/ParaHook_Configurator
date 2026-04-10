// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

import { PortView } from './PortView'

describe('PortView primitive value rows', () => {
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

  it('wraps primitive step edits in an interaction lifecycle', async () => {
    const handleStart = vi.fn()
    const handleChange = vi.fn()
    const handleEnd = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <PortView
          nodeId="node-extrude-1"
          direction="in"
          port={{
            portId: 'Depth',
            label: 'Depth',
            type: { kind: 'number', unit: 'mm' },
            optional: true,
            maxConnectionsIn: 1,
          }}
          setPortElement={() => {}}
          dropState={null}
          valueInput={{
            value: 28.7,
            min: 0.1,
            max: 100,
            step: 0.1,
            renderAs: 'paraSlider',
            primitiveRow: true,
            unitLabel: 'mm',
            onChange: handleChange,
            onInteractionStart: handleStart,
            onInteractionEnd: handleEnd,
          }}
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
    expect(handleChange).toHaveBeenCalledWith(28.8)
    expect(handleEnd).toHaveBeenCalledTimes(1)
    expect(handleStart.mock.invocationCallOrder[0]).toBeLessThan(handleChange.mock.invocationCallOrder[0])
    expect(handleChange.mock.invocationCallOrder[0]).toBeLessThan(handleEnd.mock.invocationCallOrder[0])
  })
})
