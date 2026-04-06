// @vitest-environment jsdom

import { act, useState } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it } from 'vitest'
import { StructuredWireEnumRow } from './StructuredWireEnumRow'
import type { PortSpec } from '../schema/spaghettiTypes'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const typePort: PortSpec = {
  portId: 'Type',
  label: 'Type',
  type: { kind: 'number', unit: 'unitless' },
  optional: true,
  maxConnectionsIn: 1,
}

describe('StructuredWireEnumRow', () => {
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

  it('steps the visible enum row endcaps and moves the ParaSelect fill and handle', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const ControlledEnumRow = () => {
      const [value, setValue] = useState<'Body' | 'Walls'>('Body')
      const selectedIndex = value === 'Body' ? 0 : 1
      return (
        <StructuredWireEnumRow
          nodeId="node-extrude-1"
          endpointPortId="Type"
          port={typePort}
          setPortElement={() => {
            // no-op in test
          }}
          dropState={null}
          label="Type"
          value={value}
          valueLabel={value}
          displayedTrackValue={value}
          displayedTrackLabel={value}
          options={[
            { value: 'Body', label: 'Body' },
            { value: 'Walls', label: 'Walls' },
          ]}
          selectedIndex={selectedIndex}
          displayedIndex={selectedIndex}
          optionCount={2}
          disabled={false}
          driven={false}
          onChange={(nextValue) => {
            if (nextValue === 'Body' || nextValue === 'Walls') {
              setValue(nextValue)
            }
          }}
        />
      )
    }

    await act(async () => {
      root?.render(<ControlledEnumRow />)
    })

    const next = container.querySelector(
      'button[aria-label="Next Type"]',
    ) as HTMLButtonElement | null
    const previous = container.querySelector(
      'button[aria-label="Previous Type"]',
    ) as HTMLButtonElement | null
    const fill = container.querySelector('.ParaSelectFill') as HTMLDivElement | null
    const marker = container.querySelector(
      '.ParaSelectValueHandle',
    ) as HTMLButtonElement | null
    const value = container.querySelector(
      '.ParaSelectValue',
    ) as HTMLSpanElement | null

    expect(container.querySelector('.ParaSelectNative')).not.toBeNull()
    expect(value?.textContent).toContain('Body')
    expect(fill?.style.width).toBe('0%')
    expect(marker?.style.left).toBe('0%')

    await act(async () => {
      next?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true }))
      next?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(value?.textContent).toContain('Walls')
    expect(fill?.style.width).toBe('100%')
    expect(marker?.style.left).toBe('100%')

    await act(async () => {
      previous?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(value?.textContent).toContain('Body')
    expect(fill?.style.width).toBe('0%')
    expect(marker?.style.left).toBe('0%')
  })

  it('opens the menu from the track and commits both menu and native-select changes', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    const ControlledEnumRow = () => {
      const [value, setValue] = useState<'Body' | 'Walls'>('Body')
      const selectedIndex = value === 'Body' ? 0 : 1
      return (
        <StructuredWireEnumRow
          nodeId="node-extrude-1"
          endpointPortId="Type"
          port={typePort}
          setPortElement={() => {
            // no-op in test
          }}
          dropState={null}
          label="Type"
          value={value}
          valueLabel={value}
          displayedTrackValue={value}
          displayedTrackLabel={value}
          options={[
            { value: 'Body', label: 'Body' },
            { value: 'Walls', label: 'Walls' },
          ]}
          selectedIndex={selectedIndex}
          displayedIndex={selectedIndex}
          optionCount={2}
          disabled={false}
          driven={false}
          onChange={(nextValue) => {
            if (nextValue === 'Body' || nextValue === 'Walls') {
              setValue(nextValue)
            }
          }}
        />
      )
    }

    await act(async () => {
      root?.render(<ControlledEnumRow />)
    })

    const trackButton = container.querySelector(
      'button.ParaSelectTrackButton[aria-label="Type"]',
    ) as HTMLButtonElement | null
    expect(trackButton).not.toBeNull()

    await act(async () => {
      trackButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const menu = container.querySelector('.ParaSelectMenu') as HTMLDivElement | null
    const wallsOption = Array.from(container.querySelectorAll('.ParaSelectMenuOption')).find(
      (button) => button.textContent === 'Walls',
    ) as HTMLButtonElement | undefined

    expect(menu).not.toBeNull()
    expect(wallsOption).not.toBeUndefined()

    await act(async () => {
      wallsOption?.dispatchEvent(
        new PointerEvent('pointerdown', { bubbles: true, cancelable: true }),
      )
      wallsOption?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const value = container.querySelector('.ParaSelectValue') as HTMLSpanElement | null
    expect(value?.textContent).toContain('Walls')

    const native = container.querySelector(
      '.ParaSelectNative[aria-label="Type"]',
    ) as HTMLSelectElement | null
    const fill = container.querySelector('.ParaSelectFill') as HTMLDivElement | null

    await act(async () => {
      if (native !== null) {
        native.value = 'Body'
        native.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(value?.textContent).toContain('Body')
    expect(fill?.style.width).toBe('0%')
  })
})
