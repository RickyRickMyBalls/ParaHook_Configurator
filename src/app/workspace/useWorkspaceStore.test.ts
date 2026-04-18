import { beforeEach, describe, expect, it } from 'vitest'
import {
  selectActiveViewportResultMode,
  selectActiveViewportResultModeBehavior,
  selectViewportResultModeBehaviorById,
  useWorkspaceStore,
} from './useWorkspaceStore'
import { normalizePersistedWorkspaceLayout, serializeWorkspaceLayout } from './workspacePersistence'
import {
  defaultBrowserHostRouteId,
  defaultBrowserToolbarOwnerSurfaceInstanceId,
  defaultPrimaryViewportLeafNodeId,
  defaultPrimaryViewportSlotId,
  defaultSecondaryViewportSlotId,
} from './workspaceShellTypes'

const findFirstSplitNodeId = () =>
  Object.keys(useWorkspaceStore.getState().viewportLayoutNodesById).find(
    (nodeId) => useWorkspaceStore.getState().viewportLayoutNodesById[nodeId]?.kind === 'split',
  ) ?? null

describe('useWorkspaceStore viewport slot foundation', () => {
  beforeEach(() => {
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
  })

  it('starts with one primary model viewport slot leaf', () => {
    const state = useWorkspaceStore.getState()

    expect(state.viewportSlotRootNodeId).toBe(defaultPrimaryViewportLeafNodeId)
    expect(state.viewportSlotsById[defaultPrimaryViewportSlotId]?.surfaceKind).toBe('modelViewer')
    expect(state.viewportSlotsById[defaultSecondaryViewportSlotId]).toBeUndefined()
    expect(state.browserToolbarOwnerSurfaceInstanceId).toBe(
      defaultBrowserToolbarOwnerSurfaceInstanceId,
    )
    expect(state.hostRouteOwnershipByRouteId[defaultBrowserHostRouteId]).toEqual(
      expect.objectContaining({
        routeId: defaultBrowserHostRouteId,
        surfaceKind: 'browser',
        surfaceInstanceId: defaultBrowserToolbarOwnerSurfaceInstanceId,
      }),
    )
    expect(state.surfacePlacementById[defaultBrowserToolbarOwnerSurfaceInstanceId]).toEqual(
      expect.objectContaining({
        surfaceKind: 'browser',
        surfaceInstanceId: defaultBrowserToolbarOwnerSurfaceInstanceId,
        hostMode: 'docked',
        namedHostRouteId: defaultBrowserHostRouteId,
      }),
    )
  })

  it('tracks an explicit browser toolbar owner separately from slot surfaces', () => {
    useWorkspaceStore.getState().setBrowserToolbarOwnerSurfaceInstanceId('browser-surface-1')

    expect(useWorkspaceStore.getState().browserToolbarOwnerSurfaceInstanceId).toBe(
      'browser-surface-1',
    )
    expect(useWorkspaceStore.getState().hostRouteOwnershipByRouteId[defaultBrowserHostRouteId]).toEqual(
      expect.objectContaining({
        surfaceInstanceId: 'browser-surface-1',
      }),
    )
  })

  it('creates and dissolves the first secondary split slot', () => {
    useWorkspaceStore.getState().showViewportSplitSlot('console', 'right')

    let state = useWorkspaceStore.getState()
    const splitNodeId = findFirstSplitNodeId()
    expect(splitNodeId).toBeTruthy()
    expect(state.viewportSlotRootNodeId).toBe(splitNodeId)
    expect(state.viewportSlotsById[defaultSecondaryViewportSlotId]?.surfaceKind).toBe('console')
    expect(state.viewportLayoutNodesById[splitNodeId ?? '']?.kind).toBe('split')

    useWorkspaceStore.getState().hideViewportSplitSlot()

    state = useWorkspaceStore.getState()
    expect(state.viewportSlotRootNodeId).toBe(defaultPrimaryViewportLeafNodeId)
    expect(state.viewportSlotsById[defaultSecondaryViewportSlotId]).toBeUndefined()
  })

  it('can split a non-primary slot into a deeper duplicated slot tree', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'console',
      surfaceInstanceId: 'console-surface-1',
    })

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    useWorkspaceStore.getState().splitViewportSlot(secondarySlotId ?? '', 'bottom')

    const state = useWorkspaceStore.getState()
    expect(Object.keys(state.viewportSlotsById).length).toBe(3)
    expect(
      Object.values(state.viewportLayoutNodesById).filter((node) => node.kind === 'split').length,
    ).toBe(2)
  })

  it('restores a retained slot surface instance when the slot changes back to an earlier kind', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'console',
      surfaceInstanceId: 'console-surface-1',
    })

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'browser', {
      surfaceInstanceId: 'browser-surface-1',
    })
    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'console')

    const secondarySlot =
      useWorkspaceStore.getState().viewportSlotsById[secondarySlotId ?? ''] ?? null
    expect(secondarySlot?.surfaceKind).toBe('console')
    expect(secondarySlot?.surfaceInstanceId).toBe('console-surface-1')
  })

  it('can switch a non-primary split pane from model viewer to catalog while the primary stays model-only', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right')

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'catalog')

    const primarySlot = useWorkspaceStore.getState().viewportSlotsById[defaultPrimaryViewportSlotId]
    const secondarySlot =
      (secondarySlotId !== undefined
        ? useWorkspaceStore.getState().viewportSlotsById[secondarySlotId]
        : null) ?? null

    expect(primarySlot?.surfaceKind).toBe('modelViewer')
    expect(secondarySlot?.surfaceKind).toBe('catalog')
    expect(secondarySlot?.surfaceInstanceId).toBe(`catalog-${secondarySlotId}`)
  })

  it('reuses the retained catalog surface instance when a non-primary slot switches away and back', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'catalog',
      surfaceInstanceId: 'catalog-surface-1',
    })

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'dashboard', {
      surfaceInstanceId: 'dashboard-surface-1',
    })
    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'catalog')

    const secondarySlot =
      useWorkspaceStore.getState().viewportSlotsById[secondarySlotId ?? ''] ?? null

    expect(secondarySlot?.surfaceKind).toBe('catalog')
    expect(secondarySlot?.surfaceInstanceId).toBe('catalog-surface-1')
    expect(secondarySlot?.retainedSurfaceInstanceIdsByKind).toEqual(
      expect.objectContaining({
        catalog: 'catalog-surface-1',
        dashboard: 'dashboard-surface-1',
      }),
    )
  })

  it('keeps neighboring optional surfaces switching correctly after catalog joins the tiled set', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'catalog', {
      surfaceInstanceId: 'catalog-surface-1',
    })
    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'notepad', {
      surfaceInstanceId: 'notepad-surface-1',
    })
    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'dashboard')

    let secondarySlot = useWorkspaceStore.getState().viewportSlotsById[secondarySlotId ?? ''] ?? null
    expect(secondarySlot?.surfaceKind).toBe('dashboard')
    expect(secondarySlot?.surfaceInstanceId).toBe('dashboard-surface-1')

    useWorkspaceStore.getState().setViewportSlotSurfaceKind(secondarySlotId ?? '', 'catalog')
    secondarySlot = useWorkspaceStore.getState().viewportSlotsById[secondarySlotId ?? ''] ?? null

    expect(secondarySlot?.surfaceKind).toBe('catalog')
    expect(secondarySlot?.surfaceInstanceId).toBe('catalog-surface-1')
    expect(secondarySlot?.retainedSurfaceInstanceIdsByKind).toEqual(
      expect.objectContaining({
        dashboard: 'dashboard-surface-1',
        catalog: 'catalog-surface-1',
        notepad: 'notepad-surface-1',
      }),
    )
  })

  it('detaches a slotted surface into a shared detached-slot record and redocks it with the same instance', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'console',
      surfaceInstanceId: 'console-surface-1',
    })

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    const detachedSurface = useWorkspaceStore
      .getState()
      .detachViewportSlotSurface(secondarySlotId ?? '', 'floating')

    expect(detachedSurface?.surfaceInstanceId).toBe('console-surface-1')
    expect(useWorkspaceStore.getState().viewportSlotsById[secondarySlotId ?? '']).toBeUndefined()
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['console-surface-1']).toEqual(
      expect.objectContaining({
        surfaceKind: 'console',
        hostMode: 'floating',
      }),
    )

    const redockedSlotId = useWorkspaceStore
      .getState()
      .redockDetachedSurface('console-surface-1', 'bottom')
    const redockedSlot =
      (redockedSlotId !== null
        ? useWorkspaceStore.getState().viewportSlotsById[redockedSlotId]
        : null) ?? null

    expect(redockedSlot?.surfaceKind).toBe('console')
    expect(redockedSlot?.surfaceInstanceId).toBe('console-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['console-surface-1']).toBeUndefined()
  })

  it('updates and clamps split ratios on layout split nodes', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'console',
      surfaceInstanceId: 'console-surface-1',
    })

    const splitNodeId = findFirstSplitNodeId()
    expect(splitNodeId).toBeTruthy()

    useWorkspaceStore
      .getState()
      .setViewportLayoutSplitRatio(splitNodeId ?? '', 0.9)

    expect(
      useWorkspaceStore.getState().viewportLayoutNodesById[splitNodeId ?? ''],
    ).toEqual(
      expect.objectContaining({
        kind: 'split',
        ratio: 0.85,
      }),
    )

    useWorkspaceStore
      .getState()
      .setViewportLayoutSplitRatio(splitNodeId ?? '', 0.2)

    expect(
      useWorkspaceStore.getState().viewportLayoutNodesById[splitNodeId ?? ''],
    ).toEqual(
      expect.objectContaining({
        kind: 'split',
        ratio: 0.2,
      }),
    )
  })

  it('respects a preferred ratio when creating a new slot split', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'browser',
      surfaceInstanceId: 'browser-surface-1',
      preferredRatio: 0.32,
    })

    const splitNodeId = findFirstSplitNodeId()
    expect(splitNodeId).toBeTruthy()

    expect(useWorkspaceStore.getState().viewportLayoutNodesById[splitNodeId ?? '']).toEqual(
      expect.objectContaining({
        kind: 'split',
        ratio: 0.32,
      }),
    )
  })

  it('tracks browser presentation mode separately from floating and split shell state', () => {
    useWorkspaceStore.getState().setBrowserPresentationMode('essentials')

    let state = useWorkspaceStore.getState()
    expect(state.browserShell.presentationMode).toBe('essentials')
    expect(state.browserShell.isCollapsed).toBe(false)

    useWorkspaceStore.getState().setBrowserPresentationMode('collapsed')

    state = useWorkspaceStore.getState()
    expect(state.browserShell.presentationMode).toBe('collapsed')
    expect(state.browserShell.isCollapsed).toBe(true)

    useWorkspaceStore.getState().setBrowserCollapsed(false)

    state = useWorkspaceStore.getState()
    expect(state.browserShell.presentationMode).toBe('expanded')
    expect(state.browserShell.isCollapsed).toBe(false)
  })

  it('mirrors browser floating compatibility state into the generic placement contract', () => {
    useWorkspaceStore.getState().setBrowserToolbarOwnerSurfaceInstanceId(null)
    useWorkspaceStore.getState().setBrowserFloating(true)
    useWorkspaceStore.getState().setBrowserFloatingPosition({ x: 73, y: 128 })
    useWorkspaceStore.getState().setBrowserFloatingSize({ width: 340, height: 600 })

    expect(
      useWorkspaceStore.getState().surfacePlacementById[defaultBrowserToolbarOwnerSurfaceInstanceId],
    ).toEqual(
      expect.objectContaining({
        surfaceKind: 'browser',
        surfaceInstanceId: defaultBrowserToolbarOwnerSurfaceInstanceId,
        hostMode: 'floating',
        floatingRect: {
          x: 73,
          y: 128,
          width: 340,
          height: 600,
        },
      }),
    )
    expect(
      useWorkspaceStore.getState().hostRouteOwnershipByRouteId[defaultBrowserHostRouteId],
    ).toBeUndefined()
  })

  it('keeps per-viewport local view state separate for a second model viewport', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'modelViewer',
      surfaceInstanceId: 'model-viewer-workspace-slot-2',
    })

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-workspace-slot-2')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-workspace-slot-2', {
      projectionMode: 'orthographic',
      axisOverlayEnabled: false,
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'tabs',
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'top-right-cluster',
      viewToolbarFloatingRect: {
        x: 33,
        y: 44,
        width: 280,
        height: 420,
      },
      viewToolbarActiveTab: 'materials',
      viewToolbarCompactAxisWidgetSize: 112,
      viewportResultMode: 'draft',
    })

    const state = useWorkspaceStore.getState()
    expect(state.viewportChromeById['model-viewer-primary']?.localViewState).toEqual(
      expect.objectContaining({
        projectionMode: 'perspective',
        axisOverlayEnabled: true,
        viewToolbarOpen: false,
        viewToolbarExpandedPresentationMode: 'classic',
        viewToolbarHostMode: 'docked',
        viewToolbarDockMode: 'below-axis',
        viewToolbarFloatingRect: null,
        viewToolbarActiveTab: 'camera',
        viewportResultMode: 'auto',
      }),
    )
    expect(state.viewportChromeById['model-viewer-workspace-slot-2']?.localViewState).toEqual(
      expect.objectContaining({
        projectionMode: 'orthographic',
        axisOverlayEnabled: false,
        viewToolbarOpen: true,
        viewToolbarExpandedPresentationMode: 'tabs',
        viewToolbarHostMode: 'floating',
        viewToolbarDockMode: 'top-right-cluster',
        viewToolbarFloatingRect: {
          x: 33,
          y: 44,
          width: 280,
          height: 420,
        },
        viewToolbarActiveTab: 'materials',
        viewToolbarCompactAxisWidgetSize: 112,
        viewportResultMode: 'draft',
      }),
    )
  })

  it('defaults viewport result mode to auto and keeps mode ownership viewport-local', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'modelViewer',
      surfaceInstanceId: 'model-viewer-workspace-slot-2',
    })

    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-workspace-slot-2')
    useWorkspaceStore.getState().setViewportResultMode('model-viewer-workspace-slot-2', 'final')

    const state = useWorkspaceStore.getState()
    expect(state.viewportChromeById['model-viewer-primary']?.localViewState.viewportResultMode).toBe(
      'auto',
    )
    expect(
      state.viewportChromeById['model-viewer-workspace-slot-2']?.localViewState.viewportResultMode,
    ).toBe('final')
    expect(selectActiveViewportResultMode(state)).toBe('auto')

    useWorkspaceStore.getState().setActiveViewerViewportId('model-viewer-workspace-slot-2')

    const nextState = useWorkspaceStore.getState()
    expect(selectActiveViewportResultMode(nextState)).toBe('final')
    expect(selectActiveViewportResultModeBehavior(nextState)).toEqual(
      expect.objectContaining({
        mode: 'final',
        allowsDraftDisplay: false,
        allowsFinalDisplay: true,
        prefersSkippingDraftWork: true,
      }),
    )
    expect(selectViewportResultModeBehaviorById(nextState, 'model-viewer-primary')).toEqual(
      expect.objectContaining({
        mode: 'auto',
        allowsDraftDisplay: true,
        allowsFinalDisplay: true,
        allowsFinalReplacement: true,
      }),
    )
  })

  it('detaches and redocks a non-primary model viewport against its explicit host viewport', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'modelViewer',
      surfaceInstanceId: 'model-viewer-workspace-slot-2',
    })

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    const detachedSurface = useWorkspaceStore
      .getState()
      .detachViewportSlotSurface(secondarySlotId ?? '', 'floating')

    expect(detachedSurface).toEqual(
      expect.objectContaining({
        surfaceKind: 'modelViewer',
        surfaceInstanceId: 'model-viewer-workspace-slot-2',
        hostMode: 'floating',
        hostViewportId: 'model-viewer-primary',
      }),
    )

    const redockedSlotId = useWorkspaceStore
      .getState()
      .redockDetachedSurface('model-viewer-workspace-slot-2', 'left')
    const redockedSlot =
      (redockedSlotId !== null
        ? useWorkspaceStore.getState().viewportSlotsById[redockedSlotId]
        : null) ?? null

    expect(redockedSlot?.surfaceKind).toBe('modelViewer')
    expect(redockedSlot?.surfaceInstanceId).toBe('model-viewer-workspace-slot-2')
    expect(redockedSlot?.hostViewportId).toBe('model-viewer-primary')
    expect(
      useWorkspaceStore.getState().detachedSlotSurfaceById['model-viewer-workspace-slot-2'],
    ).toBeUndefined()
  })

  it('serializes and restores active viewer id, detached model viewers, and local viewport state', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'modelViewer',
      surfaceInstanceId: 'model-viewer-workspace-slot-2',
    })
    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-workspace-slot-2')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-workspace-slot-2', {
      projectionMode: 'orthographic',
      axisOverlayEnabled: false,
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'tabs',
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'top-right-cluster',
      viewToolbarFloatingRect: {
        x: 51,
        y: 63,
        width: 301,
        height: 444,
      },
      viewToolbarActiveTab: 'view',
      viewToolbarCompactAxisWidgetSize: 112,
      viewportResultMode: 'draft',
    })
    useWorkspaceStore.getState().setActiveViewerViewportId('model-viewer-workspace-slot-2')

    const secondarySlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(secondarySlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(secondarySlotId ?? '', 'floating')

    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const normalized = normalizePersistedWorkspaceLayout(serialized)

    expect(normalized?.activeViewerViewportId).toBe('model-viewer-workspace-slot-2')
    expect(normalized?.detachedSlotSurfaceById['model-viewer-workspace-slot-2']).toEqual(
      expect.objectContaining({
        surfaceKind: 'modelViewer',
        hostMode: 'floating',
        hostViewportId: 'model-viewer-primary',
      }),
    )
    expect(
      normalized?.viewportChromeById['model-viewer-workspace-slot-2']?.localViewState,
    ).toEqual(
      expect.objectContaining({
        projectionMode: 'orthographic',
        axisOverlayEnabled: false,
        viewToolbarOpen: true,
        viewToolbarExpandedPresentationMode: 'tabs',
        viewToolbarHostMode: 'floating',
        viewToolbarDockMode: 'top-right-cluster',
        viewToolbarFloatingRect: {
          x: 51,
          y: 63,
          width: 301,
          height: 444,
        },
        viewToolbarActiveTab: 'view',
        viewToolbarCompactAxisWidgetSize: 112,
        viewportResultMode: 'draft',
      }),
    )
    expect(normalized?.hostRouteOwnershipByRouteId[defaultBrowserHostRouteId]).toEqual(
      expect.objectContaining({
        surfaceInstanceId: defaultBrowserToolbarOwnerSurfaceInstanceId,
      }),
    )
    expect(normalized?.surfacePlacementById[defaultBrowserToolbarOwnerSurfaceInstanceId]).toEqual(
      expect.objectContaining({
        hostMode: 'docked',
      }),
    )
  })

  it('round-trips representative floating and docked toolbar state across multiple viewports', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'modelViewer',
      surfaceInstanceId: 'model-viewer-workspace-slot-2',
    })
    useWorkspaceStore.getState().ensureViewportChrome('model-viewer-workspace-slot-2')
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-primary', {
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'tabs',
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'below-axis',
      viewToolbarFloatingRect: {
        x: 119,
        y: 47,
        width: 322,
        height: 358,
      },
      viewToolbarActiveTab: 'materials',
    })
    useWorkspaceStore.getState().setViewportLocalViewState('model-viewer-workspace-slot-2', {
      projectionMode: 'orthographic',
      axisOverlayEnabled: false,
      viewToolbarOpen: true,
      viewToolbarExpandedPresentationMode: 'classic',
      viewToolbarHostMode: 'docked',
      viewToolbarDockMode: 'top-right-cluster',
      viewToolbarFloatingRect: {
        x: 41,
        y: 55,
        width: 280,
        height: 420,
      },
      viewToolbarActiveTab: 'view',
      viewportResultMode: 'draft',
    })

    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const normalized = normalizePersistedWorkspaceLayout(serialized)

    expect(normalized?.viewportChromeById['model-viewer-primary']?.localViewState).toEqual(
      expect.objectContaining({
        viewToolbarOpen: true,
        viewToolbarExpandedPresentationMode: 'tabs',
        viewToolbarHostMode: 'floating',
        viewToolbarDockMode: 'below-axis',
        viewToolbarFloatingRect: {
          x: 119,
          y: 47,
          width: 322,
          height: 358,
        },
        viewToolbarActiveTab: 'materials',
      }),
    )
    expect(
      normalized?.viewportChromeById['model-viewer-workspace-slot-2']?.localViewState,
    ).toEqual(
      expect.objectContaining({
        projectionMode: 'orthographic',
        axisOverlayEnabled: false,
        viewToolbarOpen: true,
        viewToolbarExpandedPresentationMode: 'classic',
        viewToolbarHostMode: 'docked',
        viewToolbarDockMode: 'top-right-cluster',
        viewToolbarFloatingRect: {
          x: 41,
          y: 55,
          width: 280,
          height: 420,
        },
        viewToolbarActiveTab: 'view',
        viewportResultMode: 'draft',
      }),
    )
  })

  it('falls back invalid persisted toolbar tabs and floating host data to safe defaults', () => {
    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const corrupted: unknown = {
      ...serialized,
      viewportChromeById: {
        ...serialized.viewportChromeById,
        'model-viewer-primary': {
          ...serialized.viewportChromeById['model-viewer-primary'],
          localViewState: {
            ...serialized.viewportChromeById['model-viewer-primary']?.localViewState,
            viewToolbarExpandedPresentationMode: 'tabs' as const,
            viewToolbarHostMode: 'bad-host',
            viewToolbarDockMode: 'bad-dock',
            viewToolbarFloatingRect: {
              x: 'bad-x',
              y: 40,
              width: -1,
              height: 280,
            },
            viewToolbarActiveTab: 'bad-tab',
          },
        },
      },
    }

    const normalized = normalizePersistedWorkspaceLayout(corrupted)

    expect(normalized?.viewportChromeById['model-viewer-primary']?.localViewState).toEqual(
      expect.objectContaining({
        viewToolbarExpandedPresentationMode: 'tabs',
        viewToolbarHostMode: 'docked',
        viewToolbarDockMode: 'below-axis',
        viewToolbarFloatingRect: null,
        viewToolbarActiveTab: 'camera',
      }),
    )
  })

  it('rounds and preserves valid persisted floating toolbar host data', () => {
    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const floated: unknown = {
      ...serialized,
      viewportChromeById: {
        ...serialized.viewportChromeById,
        'model-viewer-primary': {
          ...serialized.viewportChromeById['model-viewer-primary'],
          localViewState: {
            ...serialized.viewportChromeById['model-viewer-primary']?.localViewState,
            viewToolbarHostMode: 'floating' as const,
            viewToolbarFloatingRect: {
              x: 21.4,
              y: 82.6,
              width: 319.5,
              height: 401.2,
            },
          },
        },
      },
    }

    const normalized = normalizePersistedWorkspaceLayout(floated)

    expect(normalized?.viewportChromeById['model-viewer-primary']?.localViewState).toEqual(
      expect.objectContaining({
        viewToolbarHostMode: 'floating',
        viewToolbarFloatingRect: {
          x: 21,
          y: 83,
          width: 320,
          height: 401,
        },
      }),
    )
  })

  it('preserves the persisted ground toolbar tab as a valid local viewport state value', () => {
    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const grounded = {
      ...serialized,
      viewportChromeById: {
        ...serialized.viewportChromeById,
        'model-viewer-primary': {
          ...serialized.viewportChromeById['model-viewer-primary'],
          localViewState: {
            ...serialized.viewportChromeById['model-viewer-primary']?.localViewState,
            viewToolbarExpandedPresentationMode: 'tabs' as const,
            viewToolbarActiveTab: 'ground' as const,
          },
        },
      },
    }

    const normalized = normalizePersistedWorkspaceLayout(grounded)

    expect(normalized?.viewportChromeById['model-viewer-primary']?.localViewState).toEqual(
      expect.objectContaining({
        viewToolbarExpandedPresentationMode: 'tabs',
        viewToolbarActiveTab: 'ground',
      }),
    )
  })

  it('detaches, redocks, and persists a dashboard slot like any other shared workspace surface', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    const dashboardSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(dashboardSlotId).toBeTruthy()

    const detachedSurface = useWorkspaceStore
      .getState()
      .detachViewportSlotSurface(dashboardSlotId ?? '', 'popout')

    expect(detachedSurface).toEqual(
      expect.objectContaining({
        surfaceKind: 'dashboard',
        surfaceInstanceId: 'dashboard-surface-1',
        hostMode: 'popout',
      }),
    )

    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const normalized = normalizePersistedWorkspaceLayout(serialized)

    expect(normalized?.detachedSlotSurfaceById['dashboard-surface-1']).toEqual(
      expect.objectContaining({
        surfaceKind: 'dashboard',
        hostMode: 'popout',
      }),
    )

    const redockedSlotId = useWorkspaceStore
      .getState()
      .redockDetachedSurface('dashboard-surface-1', 'left')
    const redockedSlot =
      (redockedSlotId !== null
        ? useWorkspaceStore.getState().viewportSlotsById[redockedSlotId]
        : null) ?? null

    expect(redockedSlot?.surfaceKind).toBe('dashboard')
    expect(redockedSlot?.surfaceInstanceId).toBe('dashboard-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['dashboard-surface-1']).toBeUndefined()
  })

  it('detaches, redocks, and persists a catalog slot like any other shared workspace surface', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'catalog',
      surfaceInstanceId: 'catalog-surface-1',
    })

    const catalogSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(catalogSlotId).toBeTruthy()

    const detachedSurface = useWorkspaceStore
      .getState()
      .detachViewportSlotSurface(catalogSlotId ?? '', 'floating')

    expect(detachedSurface).toEqual(
      expect.objectContaining({
        surfaceKind: 'catalog',
        surfaceInstanceId: 'catalog-surface-1',
        hostMode: 'floating',
      }),
    )

    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const normalized = normalizePersistedWorkspaceLayout(serialized)

    expect(normalized?.detachedSlotSurfaceById['catalog-surface-1']).toEqual(
      expect.objectContaining({
        surfaceKind: 'catalog',
        hostMode: 'floating',
      }),
    )

    const redockedSlotId = useWorkspaceStore
      .getState()
      .redockDetachedSurface('catalog-surface-1', 'left')
    const redockedSlot =
      (redockedSlotId !== null
        ? useWorkspaceStore.getState().viewportSlotsById[redockedSlotId]
        : null) ?? null

    expect(redockedSlot?.surfaceKind).toBe('catalog')
    expect(redockedSlot?.surfaceInstanceId).toBe('catalog-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['catalog-surface-1']).toBeUndefined()
  })

  it('detaches, redocks, and persists a notepad slot like any other shared workspace surface', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'notepad',
      surfaceInstanceId: 'notepad-surface-1',
    })

    const notepadSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(notepadSlotId).toBeTruthy()

    const detachedSurface = useWorkspaceStore
      .getState()
      .detachViewportSlotSurface(notepadSlotId ?? '', 'floating')

    expect(detachedSurface).toEqual(
      expect.objectContaining({
        surfaceKind: 'notepad',
        surfaceInstanceId: 'notepad-surface-1',
        hostMode: 'floating',
      }),
    )

    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const normalized = normalizePersistedWorkspaceLayout(serialized)
    expect(normalized?.detachedSlotSurfaceById['notepad-surface-1']).toEqual(
      expect.objectContaining({
        surfaceKind: 'notepad',
        hostMode: 'floating',
      }),
    )

    const redockedSlotId = useWorkspaceStore
      .getState()
      .redockDetachedSurface('notepad-surface-1', 'left')
    const redockedSlot =
      (redockedSlotId !== null
        ? useWorkspaceStore.getState().viewportSlotsById[redockedSlotId]
        : null) ?? null

    expect(redockedSlot?.surfaceKind).toBe('notepad')
    expect(redockedSlot?.surfaceInstanceId).toBe('notepad-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['notepad-surface-1']).toBeUndefined()
  })

  it('can swap a detached dashboard surface into notepad without losing detached host mode', () => {
    useWorkspaceStore.getState().splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'dashboard',
      surfaceInstanceId: 'dashboard-surface-1',
    })

    const dashboardSlotId = Object.keys(useWorkspaceStore.getState().viewportSlotsById).find(
      (slotId) => slotId !== defaultPrimaryViewportSlotId,
    )
    expect(dashboardSlotId).toBeTruthy()

    useWorkspaceStore.getState().detachViewportSlotSurface(dashboardSlotId ?? '', 'popout')
    const nextSurfaceInstanceId = useWorkspaceStore
      .getState()
      .setDetachedSurfaceKind('dashboard-surface-1', 'notepad')

    expect(nextSurfaceInstanceId).toBe('dashboard-surface-1')
    expect(useWorkspaceStore.getState().detachedSlotSurfaceById['dashboard-surface-1']).toEqual(
      expect.objectContaining({
        surfaceKind: 'notepad',
        surfaceInstanceId: 'dashboard-surface-1',
        hostMode: 'popout',
      }),
    )

    const serialized = serializeWorkspaceLayout(useWorkspaceStore.getState())
    const normalized = normalizePersistedWorkspaceLayout(serialized)
    expect(normalized?.detachedSlotSurfaceById['dashboard-surface-1']).toEqual(
      expect.objectContaining({
        surfaceKind: 'notepad',
        hostMode: 'popout',
      }),
    )
  })
})
