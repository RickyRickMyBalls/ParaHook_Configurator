// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

import { PortView } from './PortView'

const PointerEventCtor = globalThis.PointerEvent ?? MouseEvent

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

  it('keeps typed primitive edits active until Enter commits them', async () => {
    const handleStart = vi.fn()
    const handleChange = vi.fn()
    const handleEnd = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    function ControlledPrimitivePortView() {
      const [value, setValue] = useState(28.7)

      return (
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
            value,
            min: 0.1,
            max: 100,
            step: 0.1,
            renderAs: 'paraSlider',
            primitiveRow: true,
            unitLabel: 'mm',
            onChange: (nextValue) => {
              setValue(nextValue)
              handleChange(nextValue)
            },
            onInteractionStart: handleStart,
            onInteractionEnd: handleEnd,
          }}
        />
      )
    }

    await act(async () => {
      root?.render(<ControlledPrimitivePortView />)
    })

    const input = container.querySelector(
      '.SpaghettiPortPrimitiveValueInput',
    ) as HTMLInputElement | null

    expect(input).not.toBeNull()

    await act(async () => {
      input?.focus()
    })

    await act(async () => {
      if (input !== null) {
        input.value = '32.4'
        input.dispatchEvent(new Event('input', { bubbles: true }))
        input.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleEnd).toHaveBeenCalledTimes(0)

    await act(async () => {
      input?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleChange).toHaveBeenCalled()
    expect(handleEnd).toHaveBeenCalledTimes(1)
  })

  it('ends primitive drag interaction on pointer release', async () => {
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
            min: 0,
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

    const lane = container.querySelector('.SpaghettiPortPrimitiveLane') as HTMLDivElement | null
    expect(lane).not.toBeNull()

    Object.defineProperty(lane, 'getBoundingClientRect', {
      value: () => ({
        left: 0,
        top: 0,
        width: 100,
        height: 10,
        right: 100,
        bottom: 10,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      }),
    })

    await act(async () => {
      lane?.dispatchEvent(
        new PointerEventCtor('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          clientX: 25,
        }),
      )
    })

    expect(handleStart).toHaveBeenCalledTimes(1)
    expect(handleEnd).toHaveBeenCalledTimes(0)

    await act(async () => {
      window.dispatchEvent(
        new PointerEventCtor('pointerup', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(handleChange).toHaveBeenCalled()
    expect(handleEnd).toHaveBeenCalledTimes(1)
  })
})
