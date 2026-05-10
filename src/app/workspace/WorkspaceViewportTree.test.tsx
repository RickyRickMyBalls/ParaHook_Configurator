// @vitest-environment jsdom

import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceViewportTree } from './WorkspaceViewportTree'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
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
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
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
          leftDockStackHeight={workspaceState.leftDockStackHeight}
          leftDockStackSplitRatio={workspaceState.leftDockStackSplitRatio}
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
          onViewportSplitCornerPointerDown={() => {}}
          onViewportSplitCornerPointerMove={() => {}}
          onViewportSplitCornerPointerUp={() => {}}
          onViewportSplitCornerPointerCancel={() => {}}
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

  it('surfaces overlay state and exit controls in the model viewport titlebar', async () => {
    const workspaceState = useWorkspaceStore.getState()

    await act(async () => {
      useWorkspaceStore.getState().setActiveViewerViewportId('model-viewer-primary')
      useSpaghettiStore.setState((state) => ({
        ...state,
        activeEditorViewportId: 'editor-viewport-1',
        editorViewportsById: {
          ...state.editorViewportsById,
          'editor-viewport-1': {
            ...state.editorViewportsById['editor-viewport-1'],
            editorViewportId: 'editor-viewport-1',
            graphDocumentId: 'graph-document-1',
          },
        },
        editorViewportOverlayModeById: {
          ...state.editorViewportOverlayModeById,
          'editor-viewport-1': true,
        },
      }))
    })

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
          leftDockStackHeight={workspaceState.leftDockStackHeight}
          leftDockStackSplitRatio={workspaceState.leftDockStackSplitRatio}
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
          onViewportSplitCornerPointerDown={() => {}}
          onViewportSplitCornerPointerMove={() => {}}
          onViewportSplitCornerPointerUp={() => {}}
          onViewportSplitCornerPointerCancel={() => {}}
          onLeftDockResizeStart={() => {}}
          onLeftDockResizeContextMenu={() => {}}
          resolvePrimaryLeftDockBottomInset={() => '0px'}
        />,
      )
    })

    const controls = container?.querySelector(
      '.ViewportFrame[data-workspace-surface-kind="modelViewer"] .ViewportOverlayModeControls',
    ) as HTMLDivElement | null
    const exitButton = controls?.querySelector(
      '.ViewportOverlayModeButton:not(.ViewportOverlayModeCanvasToggle)',
    ) as HTMLButtonElement | null
    const canvasToggleButton = controls?.querySelector(
      '.ViewportOverlayModeCanvasToggle',
    ) as HTMLButtonElement | null

    expect(controls?.textContent).toContain('Graph 1')
    expect(exitButton?.textContent).toBe('O')
    expect(canvasToggleButton?.getAttribute('aria-label')).toBe('Hide overlay canvas')

    await act(async () => {
      canvasToggleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      useSpaghettiStore.getState().editorViewportOverlayCanvasHiddenById['editor-viewport-1'],
    ).toBe(true)

    await act(async () => {
      exitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useSpaghettiStore.getState().editorViewportOverlayModeById['editor-viewport-1']).toBe(false)
    expect(
      useSpaghettiStore.getState().editorViewportOverlayCanvasHiddenById['editor-viewport-1'],
    ).toBe(false)
  })

  it('renders split corner hotspots only on divider-adjacent pane corners and reports pointerdown without mutating layout state', async () => {
    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
    })

    const workspaceState = useWorkspaceStore.getState()
    const onViewportSplitCornerPointerDown = vi.fn()
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
          leftDockStackHeight={workspaceState.leftDockStackHeight}
          leftDockStackSplitRatio={workspaceState.leftDockStackSplitRatio}
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
          onViewportSplitCornerPointerDown={onViewportSplitCornerPointerDown}
          onViewportSplitCornerPointerMove={() => {}}
          onViewportSplitCornerPointerUp={() => {}}
          onViewportSplitCornerPointerCancel={() => {}}
          onLeftDockResizeStart={() => {}}
          onLeftDockResizeContextMenu={() => {}}
          resolvePrimaryLeftDockBottomInset={() => '0px'}
        />,
      )
    })

    const hotspotButtons = Array.from(
      container.querySelectorAll('.ViewportSplitCornerHandle'),
    ) as HTMLButtonElement[]

    expect(hotspotButtons).toHaveLength(4)
    expect(
      hotspotButtons.map((button) => button.getAttribute('data-workspace-split-corner')),
    ).toEqual(['topRight', 'bottomRight', 'topLeft', 'bottomLeft'])

    await act(async () => {
      hotspotButtons[0]?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(onViewportSplitCornerPointerDown).toHaveBeenCalledTimes(1)
    expect(onViewportSplitCornerPointerDown.mock.calls[0]?.[1]).toBe('topRight')
  })
})
