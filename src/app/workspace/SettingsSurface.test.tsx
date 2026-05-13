// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'
import { useShortcutPreferencesStore } from '../shortcutPreferencesStore'
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
    useShortcutPreferencesStore.getState().resetShortcutPreferences()
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
    expect(content?.textContent).toContain('Default reads the current cataloged shortcut set.')
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

  it('renders the Key Bindings preset selector and grouped shortcut read', async () => {
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
    const shortcutPresetSelect = container?.querySelector(
      'select[aria-label="Shortcut preset"]',
    ) as HTMLSelectElement | null
    const viewerCameraGroup = container?.querySelector(
      '[data-shortcut-group-id="viewer-camera-shortcuts"]',
    ) as HTMLElement | null
    const flyModeGroup = container?.querySelector(
      '[data-shortcut-group-id="viewer-fly-mode-entry"]',
    ) as HTMLElement | null
    const normalCameraControlsGroup = container?.querySelector(
      '[data-shortcut-group-id="viewer-normal-camera-controls"]',
    ) as HTMLElement | null
    const displayModeGroup = container?.querySelector(
      '[data-shortcut-group-id="viewer-display-mode-shortcut"]',
    ) as HTMLElement | null

    expect(shortcutPresetSelect).not.toBeNull()
    expect(Array.from(shortcutPresetSelect?.options ?? []).map((option) => option.textContent)).toEqual([
      'Default',
      'Blender (working)',
    ])
    expect(flyModeGroup?.textContent).toContain('Fly Mode')
    expect(flyModeGroup?.textContent).toContain('Entry')
    expect(flyModeGroup?.textContent).toContain('Enter Fly Mode')
    expect(flyModeGroup?.textContent).toContain('Right click hold')
    expect(flyModeGroup?.textContent).toContain('Current default fly activation mode.')
    expect(flyModeGroup?.textContent).toContain('While flying')
    expect(flyModeGroup?.textContent).toContain('Look')
    expect(flyModeGroup?.textContent).toContain('Mouse move')
    expect(flyModeGroup?.textContent).toContain('Forward')
    expect(flyModeGroup?.textContent).toContain('W')
    expect(flyModeGroup?.textContent).toContain('Backward')
    expect(flyModeGroup?.textContent).toContain('S')
    expect(flyModeGroup?.textContent).toContain('Left')
    expect(flyModeGroup?.textContent).toContain('A')
    expect(flyModeGroup?.textContent).toContain('Right')
    expect(flyModeGroup?.textContent).toContain('D')
    expect(flyModeGroup?.textContent).toContain('Up')
    expect(flyModeGroup?.textContent).toContain('Space')
    expect(flyModeGroup?.textContent).toContain('Down')
    expect(flyModeGroup?.textContent).toContain('Control')
    expect(flyModeGroup?.textContent).toContain('Boost')
    expect(flyModeGroup?.textContent).toContain('Shift')
    expect(flyModeGroup?.textContent).toContain('Roll left')
    expect(flyModeGroup?.textContent).toContain('Q')
    expect(flyModeGroup?.textContent).toContain('Roll right')
    expect(flyModeGroup?.textContent).toContain('E')
    expect(flyModeGroup?.textContent).toContain('Drone mode only.')
    expect(normalCameraControlsGroup?.textContent).toContain('Normal camera controls')
    expect(normalCameraControlsGroup?.textContent).toContain('Normal camera')
    expect(normalCameraControlsGroup?.textContent).toContain('Orbit')
    expect(normalCameraControlsGroup?.textContent).toContain('Ctrl+middle mouse drag')
    expect(normalCameraControlsGroup?.textContent).toContain('Pan')
    expect(normalCameraControlsGroup?.textContent).toContain('Middle mouse drag')
    expect(normalCameraControlsGroup?.textContent).toContain(
      'Starts after the held middle button moves past the click threshold.',
    )
    expect(normalCameraControlsGroup?.textContent).toContain('Zoom')
    expect(normalCameraControlsGroup?.textContent).toContain('Mouse wheel')
    expect(normalCameraControlsGroup?.textContent).toContain(
      'Normal viewing uses OrbitControls wheel zoom; Fly Mode remaps wheel to speed.',
    )
    expect(
      normalCameraControlsGroup?.querySelector(
        'button[aria-label="Edit Orbit shortcut"], button[aria-label="Edit Pan shortcut"], button[aria-label="Edit Zoom shortcut"]',
      ),
    ).toBeNull()
    expect(content?.textContent).toContain('Viewer camera shortcuts')
    expect(viewerCameraGroup?.textContent).toContain('Viewport')
    expect(viewerCameraGroup?.textContent).toContain('Cataloged')
    expect(viewerCameraGroup?.textContent).toContain('Top')
    expect(viewerCameraGroup?.textContent).toContain('Numpad 5')
    expect(viewerCameraGroup?.textContent).toContain('Zoom Object')
    expect(viewerCameraGroup?.textContent).toContain('Shift+Z')
    expect(displayModeGroup?.textContent).toContain('Routing owner')
    expect(displayModeGroup?.textContent).toContain('Shift+D')
    expect(content?.textContent).toContain('without one clean binding-owner seam')
  })

  it('switches the active shortcut preset without changing input preferences', async () => {
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

    const nextPresetButton = container?.querySelector(
      'button[aria-label="Next Shortcut preset"]',
    ) as HTMLButtonElement | null
    expect(nextPresetButton).not.toBeNull()

    await act(async () => {
      nextPresetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    const shortcutPresetSelect = container?.querySelector(
      'select[aria-label="Shortcut preset"]',
    ) as HTMLSelectElement | null

    expect(shortcutPresetSelect?.value).toBe('blender-working')
    expect(content?.textContent).toContain(
      'Blender (working) currently reads the Default shortcut set',
    )
    expect(content?.textContent).toContain('Numpad 5')
    expect(content?.textContent).toContain('Shift+Z')
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('console-first')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  })

  it('edits a supported shortcut value and marks the Default preset as custom', async () => {
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

    const topShortcutButton = container?.querySelector(
      'button[aria-label="Edit Top shortcut"]',
    ) as HTMLButtonElement | null
    expect(topShortcutButton).not.toBeNull()

    await act(async () => {
      topShortcutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(topShortcutButton?.textContent).toBe('Listening...')

    await act(async () => {
      topShortcutButton?.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          code: 'Digit1',
          key: '1',
        }),
      )
    })

    const shortcutPresetSelect = container?.querySelector(
      'select[aria-label="Shortcut preset"]',
    ) as HTMLSelectElement | null
    expect(shortcutPresetSelect?.selectedOptions[0]?.textContent).toBe('Default (custom)')
    expect(topShortcutButton?.textContent).toBe('1')
    expect(useUiPrefsStore.getState().consoleInputPriorityMode).toBe('console-first')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  })

  it('edits the Blender working preset into a custom variant and can reset it to base', async () => {
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

    const nextPresetButton = container?.querySelector(
      'button[aria-label="Next Shortcut preset"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      nextPresetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const topShortcutButton = container?.querySelector(
      'button[aria-label="Edit Top shortcut"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      topShortcutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })
    await act(async () => {
      topShortcutButton?.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          code: 'Digit2',
          key: '2',
        }),
      )
    })

    const shortcutPresetSelect = container?.querySelector(
      'select[aria-label="Shortcut preset"]',
    ) as HTMLSelectElement | null
    const resetButton = container?.querySelector(
      '.SettingsSurfaceEditorResetButton',
    ) as HTMLButtonElement | null

    expect(shortcutPresetSelect?.selectedOptions[0]?.textContent).toBe(
      'Blender (working custom)',
    )
    expect(topShortcutButton?.textContent).toBe('2')
    expect(resetButton?.disabled).toBe(false)

    await act(async () => {
      resetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(shortcutPresetSelect?.selectedOptions[0]?.textContent).toBe('Blender (working)')
    expect(topShortcutButton?.textContent).toBe('Numpad 5')
    expect(resetButton?.disabled).toBe(true)
  })

  it('accepts overlapping shortcut edits inline and anchors messages on both rows', async () => {
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

    const frontShortcutButton = container?.querySelector(
      'button[aria-label="Edit Front shortcut"]',
    ) as HTMLButtonElement | null
    await act(async () => {
      frontShortcutButton?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true }),
      )
    })
    await act(async () => {
      frontShortcutButton?.dispatchEvent(
        new KeyboardEvent('keydown', {
          bubbles: true,
          cancelable: true,
          code: 'Numpad5',
          key: '5',
        }),
      )
    })

    const topRow = container?.querySelector(
      '[data-shortcut-row-id="viewer-camera-shortcuts:preset-top"]',
    ) as HTMLElement | null
    const frontRow = container?.querySelector(
      '[data-shortcut-row-id="viewer-camera-shortcuts:preset-front"]',
    ) as HTMLElement | null

    expect(frontShortcutButton?.textContent).toBe('Numpad 5')
    expect(topRow?.querySelector('.SettingsSurfaceShortcutConflict')?.textContent).toContain(
      'Overlaps Front',
    )
    expect(frontRow?.querySelector('.SettingsSurfaceShortcutConflict')?.textContent).toContain(
      'Overlaps Top',
    )
    expect(container?.querySelector('[role="dialog"]')).toBeNull()
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
