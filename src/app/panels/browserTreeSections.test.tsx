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

const buildEnvironmentRootRow = (
  options: { isExpanded?: boolean; childCount?: number } = {},
): BrowserTreeRowsVm['contentRows'][number] => {
  const childCount = options.childCount ?? 2
  return {
    rowId: 'environment-root',
    rowKind: 'environment-root',
    depth: 0,
    treeGuides: ['tee'],
    iconLabel: 'E',
    label: 'Environment',
    meta: childCount === 1 ? '1 object' : `${childCount} objects`,
    isSelected: false,
    isExpandable: childCount > 0,
    isExpanded: options.isExpanded ?? true,
    actions: [],
    childCount,
  }
}

const buildEnvironmentSourceRow = (
  rowId: string,
  label: string,
  options: { isSelected?: boolean; isDiverged?: boolean } = {},
): BrowserTreeRowsVm['contentRows'][number] => ({
  rowId,
  rowKind: 'environment-source',
  depth: 1,
  treeGuides: ['vertical', 'tee'],
  iconLabel: 'E',
  label,
  meta: options.isDiverged ? 'Custom scene | Exposure 1.22' : 'Preset truth | Exposure 1.22',
  isSelected: options.isSelected ?? false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  envPreset: 'studio',
  sourceKind: options.isDiverged ? 'custom' : 'preset',
  sourceLabel: options.isDiverged ? 'Custom Studio' : 'Studio',
  sourceAssetPath: null,
  backgroundVisible: true,
  environmentGrade: {
    toneMapping: 'aces',
    exposure: 1.22,
    contrast: 1,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    temperature: 0,
    tint: 0,
    saturation: 1,
  },
  background: '#151922',
  isDiverged: options.isDiverged ?? false,
})

const buildEnvironmentLightRow = (
  rowId: string,
  label: string,
  options: { isSelected?: boolean; isSelectedLight?: boolean; enabled?: boolean } = {},
): BrowserTreeRowsVm['contentRows'][number] => {
  const enabled = options.enabled ?? true
  const isSelectedLight = options.isSelectedLight ?? false
  return {
    rowId,
    rowKind: 'environment-light',
    depth: 1,
    treeGuides: ['vertical', 'elbow'],
    iconLabel: 'L',
    label,
    meta: `${isSelectedLight ? 'Selected | ' : ''}${enabled ? 'On' : 'Off'} | directional | 1.85`,
    isSelected: options.isSelected ?? false,
    isExpandable: false,
    isExpanded: false,
    actions: [],
    lightId: rowId,
    lightType: 'directional',
    enabled,
    color: '#fff2e6',
    intensity: 1.85,
    isSelectedLight,
  }
}

const rowHandlers: BrowserTreeRowHandlers = {
  onSelect: vi.fn(),
  onContextMenu: vi.fn(),
}

const renderSection = async (
  contentRows: BrowserTreeRowsVm['contentRows'],
) => {
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
  it('renders Environment as a normal Content tree row above project content rows', async () => {
    await renderSection([
      buildEnvironmentRootRow({ childCount: 2 }),
      buildEnvironmentSourceRow('environment-source-row:active', 'Source: Studio'),
      buildEnvironmentLightRow('environment-light-row:key', 'Key', { isSelectedLight: true }),
      buildAssemblyRow('assembly-1', 'Assembly 1'),
    ])

    expect(container?.querySelector('.BrowserTreeSection--environment')).toBeNull()
    expect(
      Array.from(container?.querySelectorAll('.BrowserTreeGroup--content .BrowserTreeRowLabel') ?? [])
        .map((element) => element.textContent),
    ).toEqual(['Environment', 'Source: Studio', 'Key', 'Assembly 1'])

    const environmentRowMain = Array.from(
      container?.querySelectorAll('.BrowserTreeRowLabel') ?? [],
    ).find((element) => element.textContent === 'Environment')?.closest(
      '.BrowserTreeRowMain',
    ) as HTMLButtonElement | null
    expect(environmentRowMain?.classList.contains('isContentRow')).toBe(true)
    expect(environmentRowMain?.classList.contains('isEnvironmentRow')).toBe(true)
    expect(container?.querySelector('.BrowserContentStateBar--environment')).toBeNull()
    expect(container?.querySelector('.BrowserContentStateBar--done')).not.toBeNull()
  })

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
