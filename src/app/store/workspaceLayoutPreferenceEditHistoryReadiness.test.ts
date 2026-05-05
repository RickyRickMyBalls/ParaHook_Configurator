import { beforeEach, describe, expect, it } from 'vitest'
import {
  defaultBrowserPopoutState,
  defaultPrimaryWorkspaceViewportId,
  defaultPrimaryViewportSlotId,
  type PersistedWorkspaceLayout,
} from '../workspace/workspaceShellTypes'
import { serializeWorkspaceLayout } from '../workspace/workspacePersistence'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import { serializePersistedUiPrefs } from './uiPrefsPersistence'
import { useUiPrefsStore } from './uiPrefsStore'
import { type EditHistoryEntry, editHistoryStore } from './editHistoryStore'
import {
  defaultSpaghettiWindowAppearance,
  normalizeSpaghettiWindowAppearance,
} from '../panels/spaghettiWindowAppearance'

const redoEntryId = 'workspace-layout-preference-readiness-redo'

const seedRedoEntry = () => {
  const marker = { value: 'after' }
  const entry: EditHistoryEntry = {
    entryId: redoEntryId,
    label: 'Workspace layout preference readiness redo',
    source: {
      surface: 'workspace-layout-preference-readiness',
      sourceId: 'test',
      sourceLabel: 'Workspace layout preference readiness test',
    },
    undo: () => {
      marker.value = 'before'
    },
    redo: () => {
      marker.value = 'after'
    },
  }

  editHistoryStore.commitEntry(entry)
  editHistoryStore.undo()

  expect(marker.value).toBe('before')
  expect(editHistoryStore.getUndoEntries()).toEqual([])
  expect(editHistoryStore.getRedoEntries().map((redoEntry) => redoEntry.entryId)).toEqual([
    redoEntryId,
  ])

  return marker
}

const expectRedoPreserved = (marker: { value: string }) => {
  expect(marker.value).toBe('before')
  expect(editHistoryStore.getUndoEntries()).toEqual([])
  expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
    redoEntryId,
  ])
  expect(editHistoryStore.canRedo()).toBe(true)
}

describe('workspace layout and preference edit-history readiness', () => {
  beforeEach(() => {
    editHistoryStore.clear()
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
  })

  it('keeps raw workspace layout writes durable, serialized, history-free, and redo-preserving', () => {
    const marker = seedRedoEntry()

    const workspace = useWorkspaceStore.getState()
    workspace.setLeftDockWidth(407.6)
    workspace.setLeftDockViewportSplit(true)
    workspace.setBrowserPresentationMode('essentials')
    workspace.setBrowserFloatingPosition({ x: 44.2, y: 128.8 })
    workspace.setBrowserFloatingSize({ width: 481.2, height: 602.7 })
    workspace.setViewportResultMode(defaultPrimaryWorkspaceViewportId, 'final')
    workspace.setViewportLocalViewState(defaultPrimaryWorkspaceViewportId, {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'top-right-cluster',
      viewToolbarFloatingRect: {
        x: 12,
        y: 24,
        width: 280,
        height: 360,
      },
    })
    workspace.setActiveLeftDockPreviewPanelId('browser')
    workspace.setLeftDockResizeMenu({ x: 10, y: 20 })
    workspace.setWorkspaceSplitMenu({
      x: 30,
      y: 40,
      scope: 'divider',
      targetSurfaceInstanceId: defaultPrimaryWorkspaceViewportId,
    })

    const state = useWorkspaceStore.getState()
    expect(state.leftDockWidth).toBe(408)
    expect(state.isLeftDockViewportSplit).toBe(true)
    expect(state.browserShell.presentationMode).toBe('essentials')
    expect(state.browserShell.position).toEqual({ x: 44, y: 129 })
    expect(state.browserShell.size).toEqual({ width: 481, height: 603 })
    expect(
      state.viewportChromeById[defaultPrimaryWorkspaceViewportId]?.localViewState,
    ).toEqual(expect.objectContaining({
      viewportResultMode: 'final',
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'top-right-cluster',
      viewToolbarFloatingRect: {
        x: 12,
        y: 24,
        width: 280,
        height: 360,
      },
    }))

    const serialized = serializeWorkspaceLayout(state)
    expect(serialized.leftDockWidth).toBe(408)
    expect(serialized.isLeftDockViewportSplit).toBe(true)
    expect(serialized.browserShell.presentationMode).toBe('essentials')
    expect(serialized.browserShell.position).toEqual({ x: 44, y: 129 })
    expect(serialized.browserShell.size).toEqual({ width: 481, height: 603 })
    expect(
      serialized.viewportChromeById[defaultPrimaryWorkspaceViewportId]?.localViewState,
    ).toEqual(expect.objectContaining({
      viewportResultMode: 'final',
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'top-right-cluster',
      viewToolbarFloatingRect: {
        x: 12,
        y: 24,
        width: 280,
        height: 360,
      },
    }))

    const serializedRecord = serialized as PersistedWorkspaceLayout & Record<string, unknown>
    expect(serializedRecord.activeLeftDockPreviewPanelId).toBeUndefined()
    expect(serializedRecord.leftDockResizeMenu).toBeUndefined()
    expect(serializedRecord.workspaceSplitMenu).toBeUndefined()

    expectRedoPreserved(marker)
  })

  it('keeps remaining raw workspace shell seams serialized or session-only, history-free, and redo-preserving', () => {
    const marker = seedRedoEntry()

    const workspace = useWorkspaceStore.getState()
    workspace.setLeftDockWidth(533.2)
    workspace.setLeftDockViewportSplit(true)
    workspace.setBrowserFloating(true)
    workspace.setBrowserFloatingPosition({ x: 88.6, y: 104.2 })
    workspace.setBrowserFloatingSize({ width: 550.9, height: 610.4 })
    workspace.setBrowserViewportSplit(true)
    workspace.setBrowserViewportSplitRatio(0.7)
    workspace.setBrowserViewportSplitDockSide('bottom')
    workspace.setBrowserPoppedOut(true)
    workspace.setBrowserPopoutState({
      ...defaultBrowserPopoutState,
      childWindowId: 'browser-popout-readiness-proof',
      windowName: 'parahook-browser-readiness-proof',
    })

    const detachableSlotId = workspace.splitViewportSlot(defaultPrimaryViewportSlotId, 'right', {
      surfaceKind: 'catalog',
      preferredRatio: 0.68,
    })
    expect(detachableSlotId).not.toBeNull()
    useWorkspaceStore.getState().setViewportSlotSurfaceKind(detachableSlotId ?? '', 'browser', {
      surfaceInstanceId: 'browser-phase-1-2b-detached',
    })
    const detachedSurface = useWorkspaceStore
      .getState()
      .detachViewportSlotSurface(detachableSlotId ?? '', 'floating')
    expect(detachedSurface?.surfaceInstanceId).toBe('browser-phase-1-2b-detached')

    const removedSlotId = useWorkspaceStore
      .getState()
      .splitViewportSlot(defaultPrimaryViewportSlotId, 'bottom', {
        surfaceKind: 'dashboard',
        preferredRatio: 0.42,
      })
    expect(removedSlotId).not.toBeNull()
    useWorkspaceStore.getState().removeViewportSlot(removedSlotId ?? '')

    useWorkspaceStore.getState().setViewportResultMode(defaultPrimaryWorkspaceViewportId, 'draft')
    useWorkspaceStore.getState().setViewportLocalViewState(defaultPrimaryWorkspaceViewportId, {
      projectionMode: 'orthographic',
      axisOverlayEnabled: false,
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'below-axis',
      viewToolbarFloatingRect: {
        x: 34,
        y: 56,
        width: 240,
        height: 320,
      },
    })
    useWorkspaceStore.getState().setActiveLeftDockPreviewPanelId('browser')
    useWorkspaceStore.getState().setLeftDockResizeMenu({ x: 11, y: 22 })
    useWorkspaceStore.getState().setWorkspaceSplitMenu({
      x: 33,
      y: 44,
      scope: 'divider',
      targetSurfaceInstanceId: defaultPrimaryWorkspaceViewportId,
    })

    const state = useWorkspaceStore.getState()
    expect(state.leftDockWidth).toBe(533)
    expect(state.isLeftDockViewportSplit).toBe(true)
    expect(state.browserShell.isFloating).toBe(false)
    expect(state.browserShell.isViewportSplit).toBe(true)
    expect(state.browserShell.position).toEqual({ x: 89, y: 104 })
    expect(state.browserShell.size).toEqual({ width: 551, height: 610 })
    expect(state.browserShell.viewportSplitRatio).toBe(0.7)
    expect(state.browserShell.viewportSplitDockSide).toBe('bottom')
    expect(state.browserShell.isPoppedOut).toBe(true)
    expect(state.browserShell.popoutState).toEqual(expect.objectContaining({
      childWindowId: 'browser-popout-readiness-proof',
      windowName: 'parahook-browser-readiness-proof',
    }))
    expect(state.viewportSlotsById[detachableSlotId ?? '']).toBeUndefined()
    expect(state.viewportSlotsById[removedSlotId ?? '']).toBeUndefined()
    expect(state.detachedSlotSurfaceById['browser-phase-1-2b-detached']).toEqual(
      expect.objectContaining({
        surfaceKind: 'browser',
        hostMode: 'floating',
      }),
    )

    const serialized = serializeWorkspaceLayout(state)
    expect(serialized.leftDockWidth).toBe(533)
    expect(serialized.isLeftDockViewportSplit).toBe(true)
    expect(serialized.browserShell).toEqual(expect.objectContaining({
      isFloating: false,
      isViewportSplit: true,
      viewportSplitRatio: 0.7,
      viewportSplitDockSide: 'bottom',
      isPoppedOut: true,
    }))
    expect(serialized.browserShell.position).toEqual({ x: 89, y: 104 })
    expect(serialized.browserShell.size).toEqual({ width: 551, height: 610 })
    expect(serialized.browserShell.popoutState).toEqual(expect.objectContaining({
      childWindowId: 'browser-popout-readiness-proof',
      windowName: 'parahook-browser-readiness-proof',
    }))
    expect(serialized.viewportSlotsById[detachableSlotId ?? '']).toBeUndefined()
    expect(serialized.viewportSlotsById[removedSlotId ?? '']).toBeUndefined()
    expect(serialized.detachedSlotSurfaceById['browser-phase-1-2b-detached']).toEqual(
      expect.objectContaining({
        surfaceKind: 'browser',
        hostMode: 'floating',
      }),
    )
    expect(
      serialized.viewportChromeById[defaultPrimaryWorkspaceViewportId]?.localViewState,
    ).toEqual(expect.objectContaining({
      projectionMode: 'orthographic',
      axisOverlayEnabled: false,
      viewportResultMode: 'draft',
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
      viewToolbarDockMode: 'below-axis',
      viewToolbarFloatingRect: {
        x: 34,
        y: 56,
        width: 240,
        height: 320,
      },
    }))

    const serializedRecord = serialized as PersistedWorkspaceLayout & Record<string, unknown>
    expect(serializedRecord.activeLeftDockPreviewPanelId).toBeUndefined()
    expect(serializedRecord.leftDockResizeMenu).toBeUndefined()
    expect(serializedRecord.workspaceSplitMenu).toBeUndefined()

    expectRedoPreserved(marker)
  })

  it('keeps raw UI preference writes serialized, session-helper-free, history-free, and redo-preserving', () => {
    const marker = seedRedoEntry()

    const prefs = useUiPrefsStore.getState()
    prefs.setWorkspaceStartupSurface('modelViewer')
    prefs.setWorkspaceRestorePersistence(false)
    prefs.setViewSettingsPersistence(false)
    prefs.setEnvironmentPersistence(false)
    prefs.setDashboardPersistence(false)
    prefs.setNotepadPersistence(false)
    prefs.applyEnvironmentPreset('studio')
    prefs.setEnvironmentGrade({ exposure: 1.35 })
    prefs.captureEnvironmentLook()
    prefs.toggleEnvironmentLookComparison()

    const state = useUiPrefsStore.getState()
    const serialized = serializePersistedUiPrefs(
      state.view,
      state.workspaceStartupSurface,
      defaultSpaghettiWindowAppearance,
      {
        workspaceRestorePersistence: state.workspaceRestorePersistence,
        viewSettingsPersistence: state.viewSettingsPersistence,
        environmentPersistence: state.environmentPersistence,
        dashboardPersistence: state.dashboardPersistence,
        notepadPersistence: state.notepadPersistence,
      },
    )

    expect(serialized).toEqual(expect.objectContaining({
      version: 3,
      workspaceStartupSurface: 'modelViewer',
      workspaceRestorePersistence: false,
      viewSettingsPersistence: false,
      environmentPersistence: false,
      dashboardPersistence: false,
      notepadPersistence: false,
      spaghettiWindowAppearanceDefaults: normalizeSpaghettiWindowAppearance(
        defaultSpaghettiWindowAppearance,
      ),
    }))
    expect(serialized.view.envPreset).toBe('studio')
    expect(serialized.view.environmentGrade).toEqual(expect.objectContaining({
      exposure: 1.35,
    }))

    const serializedRecord = serialized as typeof serialized & Record<string, unknown>
    expect(serializedRecord.capturedEnvironmentLook).toBeUndefined()
    expect(serializedRecord.environmentLookComparisonActive).toBeUndefined()

    expectRedoPreserved(marker)
  })
})
