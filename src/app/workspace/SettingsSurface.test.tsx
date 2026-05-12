// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'
import { editHistoryStore } from '../store/editHistoryStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useWorkspaceStore } from './useWorkspaceStore'
import { SettingsSurface } from './SettingsSurface'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('SettingsSurface', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    window.localStorage.clear()
    editHistoryStore.clear()
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    useUiPrefsStore.setState({
      view: structuredClone(DEFAULT_VIEW_SETTINGS),
      workspaceStartupSurface: 'homePage',
      consoleInputPriorityMode: 'console-first',
      workspacePanelShellPaddingPx: 0,
      workspaceNestedResizeKeepsFarPane: true,
      workspaceRestorePersistence: true,
      viewSettingsPersistence: true,
      environmentPersistence: true,
      dashboardPersistence: true,
      notepadPersistence: true,
    })
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

  it('renders an all-first section rail and an editable settings projection pane', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
        />,
      )
    })

    const sectionButtons = Array.from(
      container?.querySelectorAll('.SettingsSurfaceSectionButton') ?? [],
    ) as HTMLButtonElement[]
    const sharedShell = container?.querySelector(
      '[data-workspace-panel-shell="settings"]',
    ) as HTMLDivElement | null
    const resizeHandle = container?.querySelector(
      '[aria-label="Resize Settings sections panel"]',
    ) as HTMLDivElement | null

    expect(sharedShell).not.toBeNull()
    expect(sharedShell?.classList.contains('WorkspacePanelSplitShell')).toBe(true)
    expect(resizeHandle?.getAttribute('role')).toBe('separator')
    expect(resizeHandle?.getAttribute('aria-orientation')).toBe('vertical')
    expect(sectionButtons.map((button) => button.textContent)).toEqual([
      'All Overview',
      'General Startup',
      'Key Bindings Shortcuts',
      'Workspace Layout',
      'Viewport View',
      'Spaghetti Editor Defaults',
      'Browser Dock',
      'Storage Persistence',
    ])

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    expect(content).not.toBeNull()
    expect(content?.textContent).toContain('Startup surface')
    expect(content?.textContent).toContain('Console input priority')
    expect(content?.textContent).toContain('Console first')
    expect(content?.textContent).toContain('Left dock width')
    expect(content?.textContent).toContain('Workspace corner radius')
    expect(content?.textContent).toContain('Workspace panel shell padding')
    expect(content?.textContent).toContain('Keep far pane fixed on nested resize')
    expect(content?.textContent).toContain('Title bar opacity')
    expect(content?.textContent).toContain('Browser presentation')
  })

  it('routes the right pane to the clicked section while keeping All as the first rail item', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
        />,
      )
    })

    const workspaceButton = Array.from(
      container?.querySelectorAll('.SettingsSurfaceSectionButton') ?? [],
    ).find((button) => button.textContent?.startsWith('Workspace')) as HTMLButtonElement | undefined
    expect(workspaceButton).toBeDefined()

    await act(async () => {
      workspaceButton?.click()
    })

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    expect(content?.textContent).toContain('Workspace')
    expect(content?.textContent).toContain('Left dock width')
    expect(content?.textContent).toContain('Workspace panel shell padding')
    expect(content?.textContent).toContain('Keep far pane fixed on nested resize')
    expect(content?.textContent).toContain('Dashboard persistence')
    expect(content?.textContent).not.toContain('Browser presentation')
    expect(
      Array.from(container?.querySelectorAll('.SettingsSurfaceSectionButton') ?? [])[0]?.textContent,
    ).toBe('All Overview')
  })

  it('edits the Spaghetti Editor defaults through the dedicated settings section', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
        />,
      )
    })

    const spaghettiButton = Array.from(
      container?.querySelectorAll('.SettingsSurfaceSectionButton') ?? [],
    ).find((button) => button.textContent?.startsWith('Spaghetti Editor')) as
      | HTMLButtonElement
      | undefined
    expect(spaghettiButton).toBeDefined()

    await act(async () => {
      spaghettiButton?.click()
    })

    expect(container?.textContent).toContain('Reset to defaults')
    expect(container?.textContent).toContain('Title bar opacity')
    expect(container?.textContent).toContain('Body color')
    expect(container?.textContent).toContain('Text size')
  })

  it('keeps Console input priority out of the General section', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
          initialSectionId="general"
        />,
      )
    })

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    const priorityToggle = container?.querySelector(
      'input[aria-label="Console first input priority"]',
    ) as HTMLInputElement | null

    expect(content?.textContent).toContain('General')
    expect(content?.textContent).toContain('Startup surface')
    expect(content?.textContent).not.toContain('Console input priority')
    expect(content?.textContent).not.toContain('Console first input priority')
    expect(priorityToggle).toBeNull()
  })

  it('edits Console input priority through the Key Bindings section control', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
          initialSectionId="keyBindings"
        />,
      )
    })

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    const priorityToggle = container?.querySelector(
      'input[aria-label="Console first input priority"]',
    ) as HTMLInputElement | null

    expect(content?.textContent).toContain('Key Bindings')
    expect(content?.textContent).toContain('Console input priority')
    expect(content?.textContent).toContain('Console first')
    expect(content?.textContent).toContain('Console first input priority')
    expect(content?.textContent).toContain('Shift+letter')
    expect(content?.textContent).toContain('Grouped shortcut rows and preset selection')
    expect(priorityToggle).not.toBeNull()
    expect(priorityToggle?.checked).toBe(true)

    await act(async () => {
      priorityToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('shortcuts-first')
    expect(content?.textContent).toContain('Shortcuts first')
    expect(editHistoryStore.getUndoEntries().at(-1)).toMatchObject({
      label: 'Change Console input priority',
      targetId: 'ui-pref:consoleInputPriorityMode',
    })

    let undoneTargetId: string | undefined
    await act(async () => {
      undoneTargetId = editHistoryStore.undo()?.targetId
    })

    expect(undoneTargetId).toBe('ui-pref:consoleInputPriorityMode')
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('console-first')
  })

  it('routes directly into the Key Bindings section from initialSectionId', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
          initialSectionId="keyBindings"
        />,
      )
    })

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    expect(content?.textContent).toContain('Key Bindings')
    expect(content?.textContent).toContain('Console input priority')
    expect(content?.textContent).not.toContain('Startup surface')
  })

  it('opens on a requested section when the surface is launched from a contextual float-window shortcut', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
          initialSectionId="browser"
        />,
      )
    })

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    expect(content?.textContent).toContain('Browser')
    expect(content?.textContent).toContain('Browser presentation')
    expect(content?.textContent).not.toContain('Startup surface')
  })

  it('edits the workspace corner radius through the workspace section slider', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
          initialSectionId="workspace"
        />,
      )
    })

    const valueButton = container?.querySelector(
      'button[aria-label="Edit Workspace corner radius value"]',
    ) as HTMLButtonElement | null
    expect(valueButton).not.toBeNull()

    await act(async () => {
      valueButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const valueInput = container?.querySelector(
      'input[aria-label="Edit Workspace corner radius value"]',
    ) as HTMLInputElement | null
    expect(valueInput).not.toBeNull()

    await act(async () => {
      if (valueInput !== null) {
        valueInput.value = '18'
        valueInput.dispatchEvent(new Event('input', { bubbles: true }))
        valueInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      valueInput?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(useUiPrefsStore.getState().workspacePaneFilletRadiusPx).toBe(18)
    expect(container?.textContent).toContain('Workspace corner radius')
  })

  it('edits the shared workspace panel shell padding through the workspace section slider', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
          initialSectionId="workspace"
        />,
      )
    })

    const settingsSurface = container?.querySelector('.SettingsSurface') as HTMLDivElement | null
    const valueButton = container?.querySelector(
      'button[aria-label="Edit Workspace panel shell padding value"]',
    ) as HTMLButtonElement | null
    expect(settingsSurface?.style.getPropertyValue('--settings-surface-panel-shell-padding')).toBe(
      '0px',
    )
    expect(valueButton).not.toBeNull()

    await act(async () => {
      valueButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const valueInput = container?.querySelector(
      'input[aria-label="Edit Workspace panel shell padding value"]',
    ) as HTMLInputElement | null
    expect(valueInput).not.toBeNull()

    await act(async () => {
      if (valueInput !== null) {
        valueInput.value = '10'
        valueInput.dispatchEvent(new Event('input', { bubbles: true }))
        valueInput.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      valueInput?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    })

    expect(useUiPrefsStore.getState().workspacePanelShellPaddingPx).toBe(10)
    expect(settingsSurface?.style.getPropertyValue('--settings-surface-panel-shell-padding')).toBe(
      '10px',
    )
  })

  it('toggles the nested divider resize behavior through the workspace section switch', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <SettingsSurface
          slotId="workspace-slot-settings"
          surfaceInstanceId="settings-workspace-slot-settings"
          initialSectionId="workspace"
        />,
      )
    })

    const resizeToggle = container?.querySelector(
      'input[aria-label="Keep far pane fixed on nested resize"]',
    ) as HTMLInputElement | null
    expect(resizeToggle).not.toBeNull()
    expect(resizeToggle?.checked).toBe(true)

    await act(async () => {
      resizeToggle?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(useUiPrefsStore.getState().workspaceNestedResizeKeepsFarPane).toBe(false)
  })
})
