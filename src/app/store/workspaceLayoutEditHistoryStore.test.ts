import { beforeEach, describe, expect, it } from 'vitest'
import { type EditHistoryEntry, editHistoryStore } from './editHistoryStore'
import {
  resetLeftDockWidthWithHistory,
  setBrowserPresentationModeWithHistory,
} from './workspaceLayoutEditHistory'
import {
  defaultLeftDockWidth,
  defaultPrimaryWorkspaceViewportId,
} from '../workspace/workspaceShellTypes'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'

const redoEntryId = 'workspace-layout-history-redo'

const seedRedoEntry = () => {
  const marker = { value: 'after' }
  const entry: EditHistoryEntry = {
    entryId: redoEntryId,
    label: 'Workspace layout history redo',
    source: {
      surface: 'workspace-layout-history',
      sourceId: 'test',
      sourceLabel: 'Workspace layout history test',
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
  expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([redoEntryId])
  expect(editHistoryStore.canRedo()).toBe(true)
}

describe('workspace layout edit history', () => {
  beforeEach(() => {
    editHistoryStore.clear()
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
  })

  it('commits reader metadata for Browser presentation changes', () => {
    expect(setBrowserPresentationModeWithHistory('essentials')).toBe(true)

    const [entry] = editHistoryStore.getUndoEntries()
    expect(entry).toEqual(expect.objectContaining({
      label: 'Change Browser presentation',
      source: {
        surface: 'workspace-layout',
        sourceId: 'browser-shell',
        sourceLabel: 'Browser shell',
      },
      targetId: 'workspace:browser-shell:presentation',
      targetLabel: 'Browser presentation',
    }))
    expect(useWorkspaceStore.getState().browserShell.presentationMode).toBe('essentials')
  })

  it('undoes and redoes Browser presentation without rewinding unrelated shell state', () => {
    const workspace = useWorkspaceStore.getState()
    workspace.setBrowserFloating(true)
    workspace.setBrowserFloatingPosition({ x: 48, y: 96 })
    workspace.setBrowserFloatingSize({ width: 520, height: 640 })
    workspace.setBrowserViewportSplitRatio(0.64)

    expect(setBrowserPresentationModeWithHistory('collapsed')).toBe(true)

    useWorkspaceStore.getState().setBrowserFloatingPosition({ x: 240, y: 320 })
    useWorkspaceStore.getState().setBrowserViewportSplitRatio(0.72)
    useWorkspaceStore.getState().setLeftDockWidth(472)
    useWorkspaceStore.getState().setViewportLocalViewState(defaultPrimaryWorkspaceViewportId, {
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
    })

    expect(editHistoryStore.undo()?.targetId).toBe('workspace:browser-shell:presentation')
    let state = useWorkspaceStore.getState()
    expect(state.browserShell.presentationMode).toBe('expanded')
    expect(state.browserShell.isCollapsed).toBe(false)
    expect(state.browserShell.position).toEqual({ x: 240, y: 320 })
    expect(state.browserShell.viewportSplitRatio).toBe(0.72)
    expect(state.leftDockWidth).toBe(472)
    expect(
      state.viewportChromeById[defaultPrimaryWorkspaceViewportId]?.localViewState,
    ).toEqual(expect.objectContaining({
      viewToolbarOpen: true,
      viewToolbarHostMode: 'floating',
    }))

    expect(editHistoryStore.redo()?.targetId).toBe('workspace:browser-shell:presentation')
    state = useWorkspaceStore.getState()
    expect(state.browserShell.presentationMode).toBe('collapsed')
    expect(state.browserShell.isCollapsed).toBe(true)
    expect(state.browserShell.position).toEqual({ x: 240, y: 320 })
    expect(state.browserShell.viewportSplitRatio).toBe(0.72)
    expect(state.leftDockWidth).toBe(472)
  })

  it('commits reader metadata for left-dock default-width reset', () => {
    useWorkspaceStore.getState().setLeftDockWidth(486)

    expect(resetLeftDockWidthWithHistory()).toBe(true)

    const [entry] = editHistoryStore.getUndoEntries()
    expect(entry).toEqual(expect.objectContaining({
      label: 'Reset left dock width',
      source: {
        surface: 'workspace-layout',
        sourceId: 'left-dock',
        sourceLabel: 'Left dock',
      },
      targetId: 'workspace:left-dock:width',
      targetLabel: 'Left dock width',
    }))
    expect(useWorkspaceStore.getState().leftDockWidth).toBe(defaultLeftDockWidth)
  })

  it('undoes and redoes only left-dock width while preserving later shell changes', () => {
    useWorkspaceStore.getState().setLeftDockWidth(512)

    expect(resetLeftDockWidthWithHistory()).toBe(true)

    useWorkspaceStore.getState().setLeftDockViewportSplit(true)
    useWorkspaceStore.getState().setBrowserPresentationMode('essentials')
    useWorkspaceStore.getState().setBrowserFloatingPosition({ x: 72, y: 88 })

    expect(editHistoryStore.undo()?.targetId).toBe('workspace:left-dock:width')
    let state = useWorkspaceStore.getState()
    expect(state.leftDockWidth).toBe(512)
    expect(state.isLeftDockViewportSplit).toBe(true)
    expect(state.browserShell.presentationMode).toBe('essentials')
    expect(state.browserShell.position).toEqual({ x: 72, y: 88 })

    expect(editHistoryStore.redo()?.targetId).toBe('workspace:left-dock:width')
    state = useWorkspaceStore.getState()
    expect(state.leftDockWidth).toBe(defaultLeftDockWidth)
    expect(state.isLeftDockViewportSplit).toBe(true)
    expect(state.browserShell.presentationMode).toBe('essentials')
    expect(state.browserShell.position).toEqual({ x: 72, y: 88 })
  })

  it('keeps no-op wrapper calls history-free and redo-preserving', () => {
    const marker = seedRedoEntry()

    expect(setBrowserPresentationModeWithHistory('expanded')).toBe(false)
    expect(resetLeftDockWidthWithHistory()).toBe(false)

    expectRedoPreserved(marker)
  })

  it('keeps raw workspace shell setters history-free and redo-preserving', () => {
    const marker = seedRedoEntry()

    const workspace = useWorkspaceStore.getState()
    workspace.setBrowserPresentationMode('collapsed')
    workspace.setLeftDockWidth(604)

    expect(useWorkspaceStore.getState().browserShell.presentationMode).toBe('collapsed')
    expect(useWorkspaceStore.getState().leftDockWidth).toBe(604)
    expectRedoPreserved(marker)
  })
})
