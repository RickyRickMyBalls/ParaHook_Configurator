// @vitest-environment jsdom

import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { WorkspaceViewportTree } from './WorkspaceViewportTree'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { useWorkspaceStore } from './useWorkspaceStore'
import type { WorkspaceSurfaceKind, WorkspaceViewportSlotId } from './workspaceShellTypes'
import type { WorkspaceSplitDockSide } from './workspaceSplitTypes'

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

  const renderWorkspaceTree = async (options: {
    onCloseViewportSlot?: (slotId: WorkspaceViewportSlotId) => void
    onSplitViewportSlot?: (
      slotId: WorkspaceViewportSlotId,
      dockSide: WorkspaceSplitDockSide,
      splitOptions?: { surfaceKind?: WorkspaceSurfaceKind },
    ) => void
  } = {}) => {
    const workspaceState = useWorkspaceStore.getState()
    const onCloseViewportSlot = options.onCloseViewportSlot ?? vi.fn()
    const onSplitViewportSlot = options.onSplitViewportSlot ?? vi.fn()
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
          onSplitViewportSlot={(slotId, dockSide) => onSplitViewportSlot(slotId, dockSide)}
          onSplitViewportSlotWithSurfaceKind={(slotId, dockSide, surfaceKind) =>
            onSplitViewportSlot(slotId, dockSide, { surfaceKind })
          }
          onFloatViewportSlot={() => {}}
          onPopOutViewportSlot={() => {}}
          onCloseViewportSlot={onCloseViewportSlot}
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

    return {
      onCloseViewportSlot,
      onSplitViewportSlot,
      workspaceState,
    }
  }

  it('renders an inline close button for close-eligible secondary split panes', async () => {
    let consoleSlotId: string | null = null

    await act(async () => {
      consoleSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'console',
        surfaceInstanceId: 'console-surface-1',
      })
    })

    if (consoleSlotId === null) {
      throw new Error('Expected a console slot id for WorkspaceViewportTree close-button test.')
    }

    const workspaceState = useWorkspaceStore.getState()
    const onCloseViewportSlot = vi.fn()
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
          onCloseViewportSlot={onCloseViewportSlot}
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

    const primaryFrame = container.querySelector(
      '.ViewportFrame[data-workspace-slot-id="workspace-slot-primary"]',
    ) as HTMLDivElement | null
    const consoleSlotFrame = container.querySelector(
      `.ViewportFrame[data-workspace-slot-id="${consoleSlotId}"][data-workspace-surface-kind="console"]`,
    ) as HTMLDivElement | null
    const closeButton = consoleSlotFrame?.querySelector(
      '.ViewportFrameInlineCloseButton',
    ) as HTMLButtonElement | null

    expect(primaryFrame?.querySelector('.ViewportFrameInlineCloseButton')).toBeNull()
    expect(closeButton).not.toBeNull()

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onCloseViewportSlot).toHaveBeenCalledTimes(1)
    expect(onCloseViewportSlot).toHaveBeenCalledWith(consoleSlotId)
  })

  it('does not render the split-only inline close button for the unsplit primary viewport', async () => {
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

    expect(container.querySelector('.ViewportFrameInlineCloseButton')).toBeNull()
  })

  it('keeps primary model viewer close routes blocked by shared eligibility', async () => {
    const { onCloseViewportSlot } = await renderWorkspaceTree()

    const modelFrame = container?.querySelector(
      '.ViewportFrame[data-workspace-slot-id="workspace-slot-primary"][data-workspace-surface-kind="modelViewer"]',
    ) as HTMLDivElement | null
    const header = modelFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    expect(modelFrame?.querySelector('.ViewportFrameInlineCloseButton')).toBeNull()

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const closeMenuButton = Array.from(
      modelFrame?.querySelectorAll('.ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Close') as HTMLButtonElement | undefined

    expect(closeMenuButton).toBeDefined()
    expect(closeMenuButton?.disabled).toBe(true)
    expect(onCloseViewportSlot).not.toHaveBeenCalled()
  })

  it('splits a titlebar direction with the selected workspace type', async () => {
    const onSplitViewportSlot = vi.fn(
      (
        slotId: WorkspaceViewportSlotId,
        dockSide: WorkspaceSplitDockSide,
        splitOptions?: { surfaceKind?: WorkspaceSurfaceKind },
      ) => {
        useWorkspaceStore.getState().splitViewportSlot(slotId, dockSide, splitOptions)
      },
    )
    await renderWorkspaceTree({ onSplitViewportSlot })

    const modelFrame = container?.querySelector(
      '.ViewportFrame[data-workspace-slot-id="workspace-slot-primary"][data-workspace-surface-kind="modelViewer"]',
    ) as HTMLDivElement | null
    const header = modelFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = modelFrame?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup > .ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      modelFrame?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim().startsWith('Split Right')) as
      | HTMLButtonElement
      | undefined

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const browserButton = Array.from(
      modelFrame?.querySelectorAll(
        '.ViewportFrameActionSubmenu--workspaceTypes .ViewportFrameActionMenuAction',
      ) ?? [],
    ).find((button) => button.textContent?.trim() === 'Browser') as HTMLButtonElement | undefined

    expect(browserButton).toBeDefined()
    expect(browserButton?.disabled).toBe(false)

    await act(async () => {
      browserButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onSplitViewportSlot).toHaveBeenCalledWith('workspace-slot-primary', 'right', {
      surfaceKind: 'browser',
    })

    const browserSlot = Object.values(useWorkspaceStore.getState().viewportSlotsById).find(
      (slot) => slot.surfaceKind === 'browser',
    )
    expect(browserSlot).toBeDefined()
    const parentSplit = Object.values(useWorkspaceStore.getState().viewportLayoutNodesById).find(
      (node) =>
        node.kind === 'split' &&
        browserSlot !== undefined &&
        (node.firstChildId === browserSlot.leafNodeId ||
          node.secondChildId === browserSlot.leafNodeId),
    )
    expect(parentSplit?.kind === 'split' ? parentSplit.splitDockSide : null).toBe('right')
  })

  it('keeps secondary model viewer direct and menu close routes on the clicked slot', async () => {
    let modelSlotId: string | null = null

    await act(async () => {
      modelSlotId = useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-secondary',
      })
    })

    if (modelSlotId === null) {
      throw new Error('Expected a model slot id for WorkspaceViewportTree close-continuity test.')
    }

    const onCloseViewportSlot = vi.fn()
    await renderWorkspaceTree({ onCloseViewportSlot })

    const modelSlotFrame = container?.querySelector(
      `.ViewportFrame[data-workspace-slot-id="${modelSlotId}"][data-workspace-surface-kind="modelViewer"]`,
    ) as HTMLDivElement | null
    const closeButton = modelSlotFrame?.querySelector(
      '.ViewportFrameInlineCloseButton',
    ) as HTMLButtonElement | null
    const header = modelSlotFrame?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    expect(closeButton).not.toBeNull()

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onCloseViewportSlot).toHaveBeenCalledTimes(1)
    expect(onCloseViewportSlot).toHaveBeenLastCalledWith(modelSlotId)

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const closeMenuButton = Array.from(
      modelSlotFrame?.querySelectorAll('.ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Close') as HTMLButtonElement | undefined

    expect(closeMenuButton).toBeDefined()
    expect(closeMenuButton?.disabled).toBe(false)

    await act(async () => {
      closeMenuButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onCloseViewportSlot).toHaveBeenCalledTimes(2)
    expect(onCloseViewportSlot).toHaveBeenLastCalledWith(modelSlotId)
  })

  it('keeps the shared viewport type button before the model result-mode control', async () => {
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

    const modelFrame = container.querySelector(
      '.ViewportFrame[data-workspace-surface-kind="modelViewer"]',
    ) as HTMLDivElement | null
    const modeButton = modelFrame?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null
    const resultModeButton = modelFrame?.querySelector(
      '.ViewportFrameHeaderControlButton',
    ) as HTMLButtonElement | null

    expect(modeButton?.textContent).toBe('-')
    expect(modeButton?.getAttribute('aria-label')).toBe('Viewport controls for Model Viewport')
    expect(resultModeButton?.textContent).toBe('A')
    expect(resultModeButton?.getAttribute('aria-label')).toBe(
      'Model Viewport result mode: Auto. Click to switch to Draft.',
    )
    expect(
      modeButton?.compareDocumentPosition(resultModeButton ?? document.body) ??
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)

    await act(async () => {
      resultModeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(
      useWorkspaceStore.getState().viewportChromeById['model-viewer-primary']?.localViewState
        .viewportResultMode,
    ).toBe('draft')
  })

  it('uses the primary frame button for split-host Spaghetti e and plus density controls', async () => {
    const spaghettiState = useSpaghettiStore.getState()
    const editorViewportId =
      spaghettiState.activeEditorViewportId ||
      Object.keys(spaghettiState.editorViewportsById)[0] ||
      spaghettiState.openGraphDocumentInViewport('graph-document-1')

    if (editorViewportId === null) {
      throw new Error('Expected an editor viewport for the split-host Spaghetti density test.')
    }

    await act(async () => {
      useSpaghettiStore.getState().setEditorViewportPresentationMode(editorViewportId, 'expanded')
    })

    await act(async () => {
      useWorkspaceStore.getState().splitViewportSlot('workspace-slot-primary', 'right', {
        surfaceKind: 'spaghettiEditor',
        surfaceInstanceId: editorViewportId,
      })
    })

    const originalWindowMode =
      useSpaghettiStore.getState().editorViewportsById[editorViewportId]?.windowMode

    await renderWorkspaceTree()

    const spaghettiFrame = container?.querySelector(
      `.ViewportFrame[data-workspace-surface-kind="spaghettiEditor"][data-workspace-slot-id]:has(.ViewportSurfaceRegistryMock[data-workspace-surface-instance-id="${editorViewportId}"])`,
    ) as HTMLDivElement | null
    const queryDensityButton = () =>
      spaghettiFrame?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    expect(spaghettiFrame).not.toBeNull()
    expect(spaghettiFrame?.querySelector('.SpaghettiFloatingHandle')).toBeNull()
    expect(spaghettiFrame?.querySelector('.ViewportFrameHeaderControlButton')).toBeNull()

    let densityButton = queryDensityButton()

    expect(densityButton?.textContent).toBe('+')
    expect(densityButton?.getAttribute('aria-label')).toBe(
      'Switch Spaghetti pane to compact editor mode',
    )
    expect(densityButton?.getAttribute('aria-expanded')).toBe('true')

    await act(async () => {
      densityButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    let state = useSpaghettiStore.getState()

    expect(state.editorViewportHeaderCollapsedById[editorViewportId]).toBe(true)
    expect(state.editorViewportCanvasToolbarVisibleById[editorViewportId]).toBe(false)
    expect(state.editorViewportOverlayModeById[editorViewportId]).toBe(false)
    expect(state.editorViewportsById[editorViewportId]?.windowMode).toBe(originalWindowMode)

    densityButton = queryDensityButton()

    expect(densityButton?.textContent).toBe('e')
    expect(densityButton?.getAttribute('aria-label')).toBe(
      'Switch Spaghetti pane to full editor mode',
    )
    expect(densityButton?.getAttribute('aria-expanded')).toBe('false')

    await act(async () => {
      densityButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    state = useSpaghettiStore.getState()

    expect(state.editorViewportHeaderCollapsedById[editorViewportId]).toBe(false)
    expect(state.editorViewportCanvasToolbarVisibleById[editorViewportId]).toBe(true)
    expect(state.editorViewportOverlayModeById[editorViewportId]).toBe(false)
    expect(state.editorViewportsById[editorViewportId]?.windowMode).toBe(originalWindowMode)

    await act(async () => {
      densityButton?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const typePickerActiveButton = Array.from(
      spaghettiFrame?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Spaghetti Editor') as
      | HTMLButtonElement
      | undefined

    expect(typePickerActiveButton).toBeDefined()
    expect(typePickerActiveButton?.classList.contains('isActive')).toBe(true)
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

  it('renders split corner hotspots on all pane fillets after the first split and reports pointerdown without mutating layout state', async () => {
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
    const rootSplitNode = workspaceState.viewportLayoutNodesById[workspaceState.viewportSlotRootNodeId]
    const primaryPaneNodeId = rootSplitNode?.kind === 'split' ? rootSplitNode.firstChildId : null
    const siblingPaneNodeId = rootSplitNode?.kind === 'split' ? rootSplitNode.secondChildId : null
    const primaryPaneHotspots = hotspotButtons.filter(
      (button) => button.getAttribute('data-workspace-split-node-id') === primaryPaneNodeId,
    )
    const siblingPaneHotspots = hotspotButtons.filter(
      (button) => button.getAttribute('data-workspace-split-node-id') === siblingPaneNodeId,
    )

    expect(rootSplitNode?.kind).toBe('split')
    expect(hotspotButtons).toHaveLength(8)
    expect(
      primaryPaneHotspots.map((button) => button.getAttribute('data-workspace-split-corner')),
    ).toEqual(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])
    expect(
      siblingPaneHotspots.map((button) => button.getAttribute('data-workspace-split-corner')),
    ).toEqual(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])

    await act(async () => {
      primaryPaneHotspots[0]?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
        }),
      )
    })

    expect(onViewportSplitCornerPointerDown).toHaveBeenCalledTimes(1)
    expect(onViewportSplitCornerPointerDown.mock.calls[0]?.[1]).toBe('viewer')
    expect(onViewportSplitCornerPointerDown.mock.calls[0]?.[2]).toBe('topLeft')
  })

  it('renders root outer-corner split hotspots for the unsplit main model viewport and reports pointerdown through the shared corner path', async () => {
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
    ).toEqual(['topLeft', 'topRight', 'bottomLeft', 'bottomRight'])
    for (const hotspotButton of hotspotButtons) {
      expect(hotspotButton.getAttribute('data-workspace-split-node-id')).toBe(
        workspaceState.viewportSlotRootNodeId,
      )
    }

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
    expect(onViewportSplitCornerPointerDown.mock.calls[0]?.[0]).toBe(
      workspaceState.viewportSlotRootNodeId,
    )
    expect(onViewportSplitCornerPointerDown.mock.calls[0]?.[1]).toBe('viewer')
    expect(onViewportSplitCornerPointerDown.mock.calls[0]?.[2]).toBe('topLeft')
  })
})
