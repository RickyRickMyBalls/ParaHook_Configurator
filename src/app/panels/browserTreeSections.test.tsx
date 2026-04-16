// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserContentSection } from './browserTreeSections'
import type { BrowserTreeRowHandlers } from './browserTreeRowPresenter'
import type { BrowserTreeRowsVm } from './selectBrowserTreeRows'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

let container: HTMLDivElement | null = null
let root: Root | null = null

const makeRect = (top: number): DOMRect =>
  ({
    x: 0,
    y: top,
    top,
    left: 0,
    width: 120,
    height: 24,
    right: 120,
    bottom: top + 24,
    toJSON: () => ({}),
  }) as DOMRect

const buildAssemblyRow = (
  rowId: string,
  label: string,
  options: { isSelected?: boolean } = {},
): BrowserTreeRowsVm['contentRows'][number] => ({
  rowId,
  rowKind: 'assembly',
  depth: 0,
  treeGuides: [],
  iconLabel: 'A',
  label,
  meta: '',
  isSelected: options.isSelected ?? false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  isVisible: true,
  visibilityPartKeys: [],
  buildState: 'done',
  buildStateLabel: 'Done',
  rebuildGraphDocumentIds: [],
})

const rowHandlers: BrowserTreeRowHandlers = {
  onSelect: vi.fn(),
  onContextMenu: vi.fn(),
}

const renderSection = async (contentRows: BrowserTreeRowsVm['contentRows']) => {
  await act(async () => {
    root?.render(
      <div className="BrowserPanelBody">
        <BrowserContentSection
          contentBuildPolicy="live"
          contentRows={contentRows}
          onCycleContentBuildPolicy={vi.fn()}
          onOpenContentImportMenu={vi.fn()}
          rowHandlers={rowHandlers}
        />
      </div>,
    )
  })
}

const syncBrowserScrollCache = async () => {
  const browserBody = container?.querySelector('.BrowserPanelBody') as HTMLDivElement | null
  expect(browserBody).not.toBeNull()
  await act(async () => {
    browserBody?.dispatchEvent(new Event('scroll'))
  })
}

const bindRowRect = (label: string, topRef: { current: number }): HTMLDivElement => {
  const labelElement = Array.from(container?.querySelectorAll('.BrowserTreeRowLabel') ?? []).find(
    (element) => element.textContent === label,
  )
  const rowElement = labelElement?.closest('.BrowserTreeRow') as HTMLDivElement | null
  expect(rowElement).not.toBeNull()
  if (rowElement === null) {
    throw new Error(`Unable to find browser tree row for ${label}`)
  }
  Object.defineProperty(rowElement, 'getBoundingClientRect', {
    configurable: true,
    value: () => makeRect(topRef.current),
  })
  return rowElement
}

beforeEach(() => {
  container = document.createElement('div')
  document.body.appendChild(container)
  root = createRoot(container)
  vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback: FrameRequestCallback) => {
    callback(0)
    return 1
  })
  vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined)
})

afterEach(async () => {
  await act(async () => {
    root?.unmount()
  })
  vi.restoreAllMocks()
  root = null
  container?.remove()
  container = null
})

describe('BrowserContentSection FLIP scroll stabilization', () => {
  it('does not animate rows after plain scroll and a selection rerender', async () => {
    const rowOneTop = { current: 100 }
    const rowTwoTop = { current: 140 }

    await renderSection([
      buildAssemblyRow('assembly-1', 'Assembly 1'),
      buildAssemblyRow('assembly-2', 'Assembly 2'),
    ])

    const rowOne = bindRowRect('Assembly 1', rowOneTop)
    bindRowRect('Assembly 2', rowTwoTop)
    await syncBrowserScrollCache()

    rowOneTop.current = 48
    rowTwoTop.current = 88
    await syncBrowserScrollCache()

    await renderSection([
      buildAssemblyRow('assembly-1', 'Assembly 1', { isSelected: true }),
      buildAssemblyRow('assembly-2', 'Assembly 2'),
    ])

    expect(rowOne.style.transition).toBe('')
    expect(rowOne.style.transform).toBe('')
  })

  it('still animates rows for a real reorder transition', async () => {
    const rowOneTop = { current: 100 }
    const rowTwoTop = { current: 140 }

    await renderSection([
      buildAssemblyRow('assembly-1', 'Assembly 1'),
      buildAssemblyRow('assembly-2', 'Assembly 2'),
    ])

    const rowOne = bindRowRect('Assembly 1', rowOneTop)
    bindRowRect('Assembly 2', rowTwoTop)
    await syncBrowserScrollCache()

    rowOneTop.current = 140
    rowTwoTop.current = 100

    await renderSection([
      buildAssemblyRow('assembly-2', 'Assembly 2'),
      buildAssemblyRow('assembly-1', 'Assembly 1'),
    ])

    expect(rowOne.style.transition).toContain('transform 180ms ease')
    expect(rowOne.style.transform).toBe('translateY(0px)')
  })
})
