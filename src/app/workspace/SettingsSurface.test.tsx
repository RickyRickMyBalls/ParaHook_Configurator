// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'
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
    useWorkspaceStore.setState(useWorkspaceStore.getInitialState(), true)
    useUiPrefsStore.setState({
      view: structuredClone(DEFAULT_VIEW_SETTINGS),
      workspaceStartupSurface: 'homePage',
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

    expect(sectionButtons.map((button) => button.textContent)).toEqual([
      'All Overview',
      'General Startup',
      'Workspace Layout',
      'Viewport View',
      'Spaghetti Editor Defaults',
      'Browser Dock',
      'Storage Persistence',
    ])

    const content = container?.querySelector('[aria-label="Settings content"]') as HTMLElement | null
    expect(content).not.toBeNull()
    expect(content?.textContent).toContain('Startup surface')
    expect(content?.textContent).toContain('Left dock width')
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
})
