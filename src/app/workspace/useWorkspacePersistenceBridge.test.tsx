// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useWorkspaceStore } from './useWorkspaceStore'
import {
  serializeWorkspaceLayout,
  workspaceLayoutStorageKey,
} from './workspacePersistence'
import { useWorkspacePersistenceBridge } from './useWorkspacePersistenceBridge'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

const mockReplayPersistedEditorSurfacePlacements = vi.fn()

vi.mock('./useWorkspaceLegacyCompatibilityBridge', () => ({
  useWorkspaceLegacyCompatibilityBridge: () => ({
    replayPersistedEditorSurfacePlacements: mockReplayPersistedEditorSurfacePlacements,
  }),
}))

function WorkspacePersistenceBridgeHarness() {
  useWorkspacePersistenceBridge()
  return null
}

async function seedPersistedCatalogLayout() {
  await act(async () => {
    useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
      surfaceKind: 'catalog',
      surfaceInstanceId: 'catalog-surface-slotted',
    })
    const floatingCatalogSlotId = useWorkspaceStore.getState().splitViewportSlot(
      'workspace-slot-primary',
      'bottom',
      {
        surfaceKind: 'catalog',
        surfaceInstanceId: 'catalog-surface-floating',
      },
    )
    if (floatingCatalogSlotId === null) {
      throw new Error('Expected a floating catalog slot id while seeding persisted layout.')
    }
    useWorkspaceStore.getState().detachViewportSlotSurface(floatingCatalogSlotId, 'floating')
  })

  const persistedLayout = serializeWorkspaceLayout(useWorkspaceStore.getState())
  window.localStorage.setItem(workspaceLayoutStorageKey, JSON.stringify(persistedLayout))
  useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
}

describe('useWorkspacePersistenceBridge', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    window.localStorage.clear()
    window.confirm = vi.fn(() => true)
    mockReplayPersistedEditorSurfacePlacements.mockReset()
  })

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

  it('restores slotted and detached catalog surfaces from the persisted last-layout snapshot on startup', async () => {
    await seedPersistedCatalogLayout()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<WorkspacePersistenceBridgeHarness />)
    })

    expect(window.confirm).toHaveBeenCalledWith(
      'Restore your saved workspace layout? Click Cancel to start fresh.',
    )
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) =>
          slot.surfaceKind === 'catalog' &&
          slot.surfaceInstanceId === 'catalog-surface-slotted',
      ),
    ).toBe(true)
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceInstanceId === 'catalog-surface-floating',
      ),
    ).toBe(false)
    expect(
      useWorkspaceStore.getState().detachedSlotSurfaceById['catalog-surface-floating'],
    ).toEqual(
      expect.objectContaining({
        surfaceKind: 'catalog',
        surfaceInstanceId: 'catalog-surface-floating',
        hostMode: 'floating',
      }),
    )
    expect(mockReplayPersistedEditorSurfacePlacements).toHaveBeenCalledWith({})

    const persisted = JSON.parse(
      window.localStorage.getItem(workspaceLayoutStorageKey) ?? 'null',
    ) as {
      viewportSlotsById?: Record<string, { surfaceKind?: string; surfaceInstanceId?: string }>
      detachedSlotSurfaceById?: Record<string, { surfaceKind?: string; hostMode?: string }>
    } | null

    expect(
      Object.values(persisted?.viewportSlotsById ?? {}).some(
        (slot) =>
          slot.surfaceKind === 'catalog' &&
          slot.surfaceInstanceId === 'catalog-surface-slotted',
      ),
    ).toBe(true)
    expect(persisted?.detachedSlotSurfaceById?.['catalog-surface-floating']).toEqual(
      expect.objectContaining({
        surfaceKind: 'catalog',
        hostMode: 'floating',
      }),
    )
  })

  it('starts fresh and overwrites a saved catalog layout when startup restore is declined', async () => {
    await seedPersistedCatalogLayout()
    window.confirm = vi.fn(() => false)

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<WorkspacePersistenceBridgeHarness />)
    })

    expect(window.confirm).toHaveBeenCalledWith(
      'Restore your saved workspace layout? Click Cancel to start fresh.',
    )
    expect(
      Object.values(useWorkspaceStore.getState().viewportSlotsById).some(
        (slot) => slot.surfaceKind === 'catalog',
      ),
    ).toBe(false)
    expect(
      Object.values(useWorkspaceStore.getState().detachedSlotSurfaceById).some(
        (surface) => surface.surfaceKind === 'catalog',
      ),
    ).toBe(false)
    expect(mockReplayPersistedEditorSurfacePlacements).not.toHaveBeenCalled()

    const persisted = JSON.parse(
      window.localStorage.getItem(workspaceLayoutStorageKey) ?? 'null',
    ) as {
      viewportSlotsById?: Record<string, { surfaceKind?: string }>
      detachedSlotSurfaceById?: Record<string, { surfaceKind?: string }>
    } | null

    expect(
      Object.values(persisted?.viewportSlotsById ?? {}).some(
        (slot) => slot.surfaceKind === 'catalog',
      ),
    ).toBe(false)
    expect(
      Object.values(persisted?.detachedSlotSurfaceById ?? {}).some(
        (surface) => surface.surfaceKind === 'catalog',
      ),
    ).toBe(false)
  })
})
