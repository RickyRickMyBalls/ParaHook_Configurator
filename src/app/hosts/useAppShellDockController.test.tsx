// @vitest-environment jsdom

import { act, createRef } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from '../store/editHistoryStore'
import { useWorkspaceStore } from '../workspace/useWorkspaceStore'
import { defaultLeftDockWidth } from '../workspace/workspaceShellTypes'
import { useAppShellDockController } from './useAppShellDockController'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

function DockControllerHarness() {
  const leftDockWidth = useWorkspaceStore((state) => state.leftDockWidth)
  const setLeftDockWidth = useWorkspaceStore((state) => state.setLeftDockWidth)
  const leftDockResizeMenu = useWorkspaceStore((state) => state.leftDockResizeMenu)
  const setLeftDockResizeMenu = useWorkspaceStore((state) => state.setLeftDockResizeMenu)
  const workspaceSplitMenu = useWorkspaceStore((state) => state.workspaceSplitMenu)
  const setWorkspaceSplitMenu = useWorkspaceStore((state) => state.setWorkspaceSplitMenu)
  const controller = useAppShellDockController({
    appShellRef: createRef<HTMLDivElement>(),
    dockedBrowserHostRef: createRef<HTMLDivElement>(),
    dockedMeatballHostRef: createRef<HTMLDivElement>(),
    leftDockWidth,
    setLeftDockWidth,
    leftDockResizeMenu,
    setLeftDockResizeMenu,
    workspaceSplitMenu,
    setWorkspaceSplitMenu,
  })

  return (
    <button type="button" onClick={controller.handleResetLeftDockWidth}>
      Reset left dock width
    </button>
  )
}

describe('useAppShellDockController', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  beforeEach(() => {
    editHistoryStore.clear()
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
  })

  it('routes the default-width reset command through canonical workspace layout history', async () => {
    useWorkspaceStore.getState().setLeftDockWidth(548)
    useWorkspaceStore.getState().setLeftDockResizeMenu({ x: 100, y: 120 })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<DockControllerHarness />)
    })

    const resetButton = container.querySelector('button') as HTMLButtonElement | null

    await act(async () => {
      resetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useWorkspaceStore.getState().leftDockWidth).toBe(defaultLeftDockWidth)
    expect(useWorkspaceStore.getState().leftDockResizeMenu).toBeNull()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toEqual(expect.objectContaining({
      label: 'Reset left dock width',
      source: {
        surface: 'workspace-layout',
        sourceId: 'left-dock',
        sourceLabel: 'Left dock',
      },
      targetId: 'workspace:left-dock:width',
      targetLabel: 'Left dock width',
    }))

    let undoneTargetId: string | undefined
    await act(async () => {
      undoneTargetId = editHistoryStore.undo()?.targetId
    })
    expect(undoneTargetId).toBe('workspace:left-dock:width')
    expect(useWorkspaceStore.getState().leftDockWidth).toBe(548)
  })
})
