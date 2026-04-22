// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { editHistoryStore } from '../store/editHistoryStore'
import { useWorkspaceStore } from './useWorkspaceStore'
import { ViewportSurfaceRegistry } from './ViewportSurfaceRegistry'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

vi.mock('../panels/BrowserPanel', () => ({
  BrowserPanel: ({
    presentationMode,
    onCyclePresentationMode,
  }: {
    presentationMode?: 'expanded' | 'essentials' | 'collapsed'
    onCyclePresentationMode?: () => void
  }) => (
    <div className="BrowserPanelRoot">
      <button
        type="button"
        aria-label="Mock browser cycle presentation"
        onClick={onCyclePresentationMode}
      >
        {`Cycle Browser ${presentationMode ?? 'expanded'}`}
      </button>
    </div>
  ),
}))

describe('ViewportSurfaceRegistry', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    editHistoryStore.clear()
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
  })

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
  })

  it('routes Browser presentation cycling through canonical workspace layout history', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ViewportSurfaceRegistry
          slotId="workspace-slot-browser"
          surfaceKind="browser"
          surfaceInstanceId="browser-workspace-slot"
          onActivateSpaghettiSurface={vi.fn()}
        />,
      )
    })

    const cycleButton = container.querySelector(
      'button[aria-label="Mock browser cycle presentation"]',
    ) as HTMLButtonElement | null

    expect(cycleButton).not.toBeNull()

    await act(async () => {
      cycleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().browserShell.presentationMode).toBe('essentials')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toEqual(expect.objectContaining({
      label: 'Change Browser presentation',
      source: {
        surface: 'workspace-layout',
        sourceId: 'browser-shell',
        sourceLabel: 'Browser shell',
      },
      targetId: 'workspace:browser-shell:presentation',
      targetLabel: 'Browser presentation',
    }))
  })

  it('renders catalog through the canonical workspace surface registry branch', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ViewportSurfaceRegistry
          slotId="workspace-slot-secondary"
          surfaceKind="catalog"
          surfaceInstanceId="catalog-workspace-slot-secondary"
          onActivateSpaghettiSurface={vi.fn()}
        />,
      )
    })

    const catalogSurface = container?.querySelector(
      '.WorkspaceViewportSlotSurface--catalog[data-workspace-surface-instance-id="catalog-workspace-slot-secondary"]',
    ) as HTMLDivElement | null

    expect(catalogSurface).not.toBeNull()
    expect(catalogSurface?.textContent).toContain('Catalog Results')
  })

  it('renders home page through the canonical workspace surface registry branch', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ViewportSurfaceRegistry
          slotId="workspace-slot-primary"
          surfaceKind="homePage"
          surfaceInstanceId="home-page-workspace-slot-primary"
          onActivateSpaghettiSurface={vi.fn()}
        />,
      )
    })

    const homePageSurface = container?.querySelector(
      '.WorkspaceViewportSlotSurface--homePage[data-workspace-surface-instance-id="home-page-workspace-slot-primary"]',
    ) as HTMLDivElement | null

    expect(homePageSurface).not.toBeNull()
    expect(homePageSurface?.textContent).toContain('Home Page')
  })

  it('renders edit history through the canonical workspace surface registry branch', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <ViewportSurfaceRegistry
          slotId="workspace-slot-history"
          surfaceKind="editHistory"
          surfaceInstanceId="edit-history-workspace-slot-history"
          onActivateSpaghettiSurface={vi.fn()}
        />,
      )
    })

    const editHistorySurface = container?.querySelector(
      '.WorkspaceViewportSlotSurface--editHistory[data-workspace-surface-instance-id="edit-history-workspace-slot-history"]',
    ) as HTMLDivElement | null

    expect(editHistorySurface).not.toBeNull()
    expect(editHistorySurface?.textContent).toContain('Edit History')
    expect(editHistorySurface?.textContent).toContain('No undo entries')
  })
})
