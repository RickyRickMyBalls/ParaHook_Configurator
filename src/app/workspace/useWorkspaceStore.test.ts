import { beforeEach, describe, expect, it } from 'vitest'
import { useWorkspaceStore } from './useWorkspaceStore'
import {
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
})
