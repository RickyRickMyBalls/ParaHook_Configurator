import { editHistoryStore } from './editHistoryStore'
import {
  defaultLeftDockWidth,
  type BrowserPresentationMode,
} from '../workspace/workspaceShellTypes'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'

type WorkspaceLayoutHistoryOptions = {
  entryId?: string
}

let workspaceLayoutHistorySequence = 0

const workspaceLayoutHistorySource = {
  surface: 'workspace-layout',
}

const nextWorkspaceLayoutHistoryEntryId = (): string => {
  workspaceLayoutHistorySequence += 1
  return `workspace-layout-${workspaceLayoutHistorySequence}`
}

export const resolveNextBrowserPresentationMode = (
  presentationMode: BrowserPresentationMode,
): BrowserPresentationMode =>
  presentationMode === 'expanded'
    ? 'essentials'
    : presentationMode === 'essentials'
      ? 'collapsed'
      : 'expanded'

type BrowserPresentationSnapshot = {
  presentationMode: BrowserPresentationMode
}

const captureBrowserPresentationSnapshot = (): BrowserPresentationSnapshot => ({
  presentationMode: useWorkspaceStore.getState().browserShell.presentationMode,
})

const restoreBrowserPresentationSnapshot = (snapshot: BrowserPresentationSnapshot): void => {
  useWorkspaceStore.getState().setBrowserPresentationMode(snapshot.presentationMode)
}

export const setBrowserPresentationModeWithHistory = (
  nextPresentationMode: BrowserPresentationMode,
  options: WorkspaceLayoutHistoryOptions = {},
): boolean => {
  const before = captureBrowserPresentationSnapshot()
  useWorkspaceStore.getState().setBrowserPresentationMode(nextPresentationMode)
  const after = captureBrowserPresentationSnapshot()

  if (before.presentationMode === after.presentationMode) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextWorkspaceLayoutHistoryEntryId(),
    label: 'Change Browser presentation',
    source: {
      ...workspaceLayoutHistorySource,
      sourceId: 'browser-shell',
      sourceLabel: 'Browser shell',
    },
    targetId: 'workspace:browser-shell:presentation',
    targetLabel: 'Browser presentation',
    undo: () => restoreBrowserPresentationSnapshot(before),
    redo: () => restoreBrowserPresentationSnapshot(after),
  })
}

export const cycleBrowserPresentationModeWithHistory = (
  currentPresentationMode: BrowserPresentationMode,
  options?: WorkspaceLayoutHistoryOptions,
): boolean =>
  setBrowserPresentationModeWithHistory(
    resolveNextBrowserPresentationMode(currentPresentationMode),
    options,
  )

export const resetLeftDockWidthWithHistory = (
  options: WorkspaceLayoutHistoryOptions = {},
): boolean => {
  const beforeWidth = useWorkspaceStore.getState().leftDockWidth
  useWorkspaceStore.getState().setLeftDockWidth(defaultLeftDockWidth)
  const afterWidth = useWorkspaceStore.getState().leftDockWidth

  if (Object.is(beforeWidth, afterWidth)) {
    return false
  }

  return editHistoryStore.commitEntry({
    entryId: options.entryId ?? nextWorkspaceLayoutHistoryEntryId(),
    label: 'Reset left dock width',
    source: {
      ...workspaceLayoutHistorySource,
      sourceId: 'left-dock',
      sourceLabel: 'Left dock',
    },
    targetId: 'workspace:left-dock:width',
    targetLabel: 'Left dock width',
    undo: () => useWorkspaceStore.getState().setLeftDockWidth(beforeWidth),
    redo: () => useWorkspaceStore.getState().setLeftDockWidth(afterWidth),
  })
}
