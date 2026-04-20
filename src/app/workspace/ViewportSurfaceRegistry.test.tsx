// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ViewportSurfaceRegistry } from './ViewportSurfaceRegistry'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('ViewportSurfaceRegistry', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

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
    expect(catalogSurface?.textContent).toContain('Catalog Cards')
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
})
