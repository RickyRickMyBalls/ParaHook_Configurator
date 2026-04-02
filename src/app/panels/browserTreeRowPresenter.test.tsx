// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BrowserTreeRowShell } from './browserTreeRowPresenter'
import type { BrowserRenderableRowVm } from './selectBrowserTreeRows'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let container: HTMLDivElement | null = null
let root: Root | null = null

const baseRow: BrowserRenderableRowVm = {
  rowId: 'references-root',
  rowKind: 'references-root',
  depth: 0,
  treeGuides: [],
  iconLabel: 'A',
  label: 'References',
  meta: '',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  isVisible: true,
  state: 'dormant',
  stateLabel: 'Dormant',
}

afterEach(async () => {
  await act(async () => {
    root?.unmount()
  })
  container?.remove()
  root = null
  container = null
})

describe('BrowserTreeRowShell', () => {
  it('commits selection only once for a pointer-driven click on the main row button', async () => {
    const onSelect = vi.fn()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <BrowserTreeRowShell
          row={baseRow}
          onSelect={onSelect}
          onContextMenu={vi.fn()}
        />,
      )
    })

    const rowButton = container.querySelector('.BrowserTreeRowMain') as HTMLButtonElement | null
    expect(rowButton).not.toBeNull()

    await act(async () => {
      rowButton?.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, cancelable: true, button: 0 }))
      rowButton?.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, cancelable: true, button: 0 }))
      rowButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onSelect).toHaveBeenCalledTimes(1)
    expect(onSelect).toHaveBeenCalledWith(
      baseRow,
      expect.objectContaining({
        ctrlKey: false,
        shiftKey: false,
      }),
    )
  })
})
