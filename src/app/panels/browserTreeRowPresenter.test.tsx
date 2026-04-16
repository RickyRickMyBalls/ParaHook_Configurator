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

  it('shows a content visibility eye for authored parent rows that only carry reference-backed visibility ids', async () => {
    const onToggleContentVisibility = vi.fn()
    const row: BrowserRenderableRowVm = {
      rowId: 'assembly-1',
      rowKind: 'assembly',
      depth: 0,
      treeGuides: [],
      iconLabel: 'A',
      label: 'Assembly 1',
      meta: '',
      isSelected: false,
      isExpandable: true,
      isExpanded: true,
      actions: [],
      isVisible: true,
      visibilityPartKeys: [],
      visibilityReferenceIds: ['reference-import:1'],
      buildState: 'done',
      buildStateLabel: 'Done',
      rebuildGraphDocumentIds: [],
    }

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <BrowserTreeRowShell
          row={row}
          onSelect={vi.fn()}
          onContextMenu={vi.fn()}
          onToggleContentVisibility={onToggleContentVisibility}
        />,
      )
    })

    const visibilityButton = container.querySelector(
      'button[aria-label="Hide Assembly 1"]',
    ) as HTMLButtonElement | null
    expect(visibilityButton).not.toBeNull()

    await act(async () => {
      visibilityButton?.click()
    })

    expect(onToggleContentVisibility).toHaveBeenCalledWith(row)
  })
})
