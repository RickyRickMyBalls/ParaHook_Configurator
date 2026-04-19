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

const buildEnvironmentRootRow = (): BrowserRenderableRowVm => ({
  rowId: 'environment-root',
  rowKind: 'environment-root',
  depth: 0,
  treeGuides: [],
  iconLabel: 'E',
  label: 'Environment',
  meta: '2 objects',
  isSelected: false,
  isExpandable: true,
  isExpanded: true,
  actions: [],
  childCount: 2,
})

const buildEnvironmentLightRow = (): BrowserRenderableRowVm => ({
  rowId: 'environment-light-row:key',
  rowKind: 'environment-light',
  depth: 1,
  treeGuides: ['vertical', 'elbow'],
  iconLabel: 'L',
  label: 'Key',
  meta: 'Selected | On | directional | 1.85',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  lightId: 'key',
  lightType: 'directional',
  enabled: true,
  color: '#fff2e6',
  intensity: 1.85,
  isSelectedLight: true,
})

const buildEnvironmentSourceRow = (): BrowserRenderableRowVm => ({
  rowId: 'environment-source-row:active',
  rowKind: 'environment-source',
  depth: 1,
  treeGuides: ['tee'],
  iconLabel: 'E',
  label: 'HDRI: Workshop Loft',
  meta: 'HDRI source | Exposure 1.15 | /HDRI/workshop_loft.hdr',
  isSelected: false,
  isExpandable: false,
  isExpanded: false,
  actions: [],
  envPreset: 'baseline',
  sourceKind: 'hdri',
  sourceLabel: 'Workshop Loft',
  sourceAssetPath: '/HDRI/workshop_loft.hdr',
  backgroundVisible: true,
  environmentGrade: {
    toneMapping: 'aces',
    exposure: 1.15,
    contrast: 1,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    temperature: 0,
    tint: 0,
    saturation: 1,
  },
  background: '#0b0b0f',
  isDiverged: false,
})

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

  it('routes environment rows through the mature content-row chrome instead of bespoke environment chrome', async () => {
    const onToggleContentVisibility = vi.fn()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <BrowserTreeRowShell row={buildEnvironmentRootRow()} onSelect={vi.fn()} onContextMenu={vi.fn()} />,
      )
    })

    const environmentRoot = container.querySelector('.BrowserTreeRow') as HTMLDivElement | null
    const environmentRootMain = container.querySelector('.BrowserTreeRowMain') as HTMLButtonElement | null
    const environmentRootSurface = container.querySelector('.BrowserTreeRowSurface') as HTMLSpanElement | null

    expect(environmentRoot).not.toBeNull()
    expect(environmentRootMain?.classList.contains('isContentRow')).toBe(true)
    expect(environmentRootMain?.classList.contains('isEnvironmentRow')).toBe(true)
    expect(environmentRootSurface?.classList.contains('BrowserContentStateBar--done')).toBe(true)
    expect(container.querySelector('.BrowserContentStateBar--environment')).toBeNull()

    await act(async () => {
      root?.render(
        <BrowserTreeRowShell
          row={buildEnvironmentSourceRow()}
          onSelect={vi.fn()}
          onContextMenu={vi.fn()}
          onToggleContentVisibility={onToggleContentVisibility}
        />,
      )
    })

    let environmentMain = container.querySelector('.BrowserTreeRowMain') as HTMLButtonElement | null
    let environmentSurface = container.querySelector('.BrowserTreeRowSurface') as HTMLSpanElement | null
    const visibilityButton = container.querySelector(
      'button[aria-label="Hide HDRI: Workshop Loft"]',
    ) as HTMLButtonElement | null

    expect(environmentMain?.classList.contains('isContentRow')).toBe(true)
    expect(environmentMain?.classList.contains('isEnvironmentRow')).toBe(true)
    expect(environmentSurface?.classList.contains('BrowserContentStateBar--done')).toBe(true)
    expect(visibilityButton).not.toBeNull()
    expect(container.querySelector('.BrowserContentStateBar--environment')).toBeNull()

    await act(async () => {
      visibilityButton?.click()
    })

    expect(onToggleContentVisibility).toHaveBeenCalledWith(buildEnvironmentSourceRow())

    await act(async () => {
      root?.render(
        <BrowserTreeRowShell
          row={buildEnvironmentLightRow()}
          onSelect={vi.fn()}
          onContextMenu={vi.fn()}
          onToggleContentVisibility={onToggleContentVisibility}
        />,
      )
    })

    environmentMain = container.querySelector('.BrowserTreeRowMain') as HTMLButtonElement | null
    environmentSurface = container.querySelector('.BrowserTreeRowSurface') as HTMLSpanElement | null
    const lightVisibilityButton = container.querySelector(
      'button[aria-label="Hide Key"]',
    ) as HTMLButtonElement | null

    expect(environmentMain?.classList.contains('isContentRow')).toBe(true)
    expect(environmentMain?.classList.contains('isEnvironmentRow')).toBe(true)
    expect(environmentSurface?.classList.contains('BrowserContentStateBar--done')).toBe(true)
    expect(lightVisibilityButton).not.toBeNull()

    await act(async () => {
      lightVisibilityButton?.click()
    })

    expect(onToggleContentVisibility).toHaveBeenCalledWith(buildEnvironmentLightRow())
  })
})
