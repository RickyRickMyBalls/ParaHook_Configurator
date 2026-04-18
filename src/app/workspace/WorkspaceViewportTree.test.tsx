// @vitest-environment jsdom

import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceViewportTree } from './WorkspaceViewportTree'
import { useWorkspaceStore } from './useWorkspaceStore'

vi.mock('./PrimaryViewportLeftDock', () => ({
  PrimaryViewportLeftDock: () => <div className="PrimaryViewportLeftDockMock" />,
}))

vi.mock('./ViewportSurfaceRegistry', () => ({
  ViewportSurfaceRegistry: ({
    slotId,
    surfaceKind,
    surfaceInstanceId,
  }: {
    slotId: string
    surfaceKind: string
    surfaceInstanceId: string
  }) => (
    <div
      className="ViewportSurfaceRegistryMock"
      data-workspace-slot-id={slotId}
      data-workspace-surface-kind={surfaceKind}
      data-workspace-surface-instance-id={surfaceInstanceId}
    />
  ),
}))

vi.mock('./ViewportWorkspaceHost', () => ({
  ViewportWorkspaceHost: ({ viewportId }: { viewportId: string }) => (
    <div className="ViewportWorkspaceHostMock" data-workspace-viewport-id={viewportId} />
  ),
}))

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('WorkspaceViewportTree', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
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
    document.body.innerHTML = ''
  })

  it('does not expose a popout button for a slotted catalog surface while catalog popout is deferred', async () => {
    let catalogSlotId: string | null = null

    await act(async () => {
      catalogSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'catalog',
        surfaceInstanceId: 'catalog-surface-1',
      })
    })

    if (catalogSlotId === null) {
      throw new Error('Expected a catalog slot id for WorkspaceViewportTree test.')
    }

    const workspaceState = useWorkspaceStore.getState()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <WorkspaceViewportTree
          viewportSlotRootNodeId={workspaceState.viewportSlotRootNodeId}
          viewportSlotsById={workspaceState.viewportSlotsById}
          viewportLayoutNodesById={workspaceState.viewportLayoutNodesById}
          leftDockWidth={workspaceState.leftDockWidth}
          primaryViewportSlotIsConstrained={false}
          isLeftDockViewportSplit={workspaceState.isLeftDockViewportSplit}
          isBrowserDockPreviewActive={false}
          isMeatballDockPreviewActive={false}
          isMeatballDockOccupied={false}
          browserPresentationMode="expanded"
          isBrowserCollapsed={false}
          windowSettingsOpenByViewportId={{}}
          dockedBrowserHostRef={createRef<HTMLDivElement>()}
          dockedMeatballHostRef={createRef<HTMLDivElement>()}
          onActivateSpaghettiSurface={() => {}}
          onActivateViewerSurface={() => {}}
          onOpenViewportSpawnMenu={() => {}}
          onCycleBrowserPresentationMode={() => {}}
          onRequestViewportSlotSurfaceKind={() => {}}
          onOpenDashboardNoteInNotepad={() => {}}
          onSplitViewportSlot={() => {}}
          onFloatViewportSlot={() => {}}
          onPopOutViewportSlot={() => {}}
          onCloseViewportSlot={() => {}}
          onViewportSlotHeaderDragOut={() => {}}
          onViewportLayoutDividerPointerDown={() => {}}
          onLeftDockResizeStart={() => {}}
          onLeftDockResizeContextMenu={() => {}}
          resolvePrimaryLeftDockBottomInset={() => '0px'}
        />,
      )
    })

    const catalogSlotFrame = container.querySelector(
      `.ViewportFrame[data-workspace-slot-id="${catalogSlotId}"][data-workspace-surface-kind="catalog"]`,
    ) as HTMLDivElement | null

    expect(catalogSlotFrame).not.toBeNull()
    expect(catalogSlotFrame?.querySelector('.ViewportFrameActionMenuButton')).toBeNull()
  })
})
