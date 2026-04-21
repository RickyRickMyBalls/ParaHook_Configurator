// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { readPersistedUiPrefs } from '../store/uiPrefsPersistence'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { useUiPrefsPersistenceBridge } from '../store/useUiPrefsPersistenceBridge'
import {
  graphBrowserStoragePolicyKey,
  graphBrowserStorageSnapshotKey,
  readGraphBrowserStoragePolicy,
} from '../spaghetti/store/graphBrowserStoragePersistence'
import {
  readRecentItemsPolicy,
  recentItemsStoragePolicyKey,
  recentItemsStorageSnapshotKey,
} from '../recentItems/recentItemsPersistence'
import { dashboardStorageKey } from '../dashboard/dashboardPersistence'
import { notepadStorageKey } from '../notepad/notepadPersistence'
import {
  pubPartsDownloadsFolderPath,
  pubPartsDownloadsStorageKey,
  pubPartsLocalLibraryFolderPath,
  readPubPartsDownloadsStorage,
} from '../catalog/pubPartsDownloadsStorage'
import { HomePageSurface } from './HomePageSurface'
import { homePageDocsUrl, homePageGithubUrl, homePageWhatIsNewSummary, homePageVersionLabel } from './homePageOrientation'
import { uiPrefsStorageKey } from '../store/uiPrefsPersistence'
import { workspaceLayoutStorageKey } from './workspacePersistence'
import { homePageRecentItemsPersistenceNote } from './homePageStorageTransparency'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

function HomePageSurfaceHarness() {
  useUiPrefsPersistenceBridge()

  return (
    <HomePageSurface
      surfaceInstanceId="home-page-workspace-slot-primary"
      slotId="workspace-slot-primary"
      onOpenSurface={vi.fn()}
    />
  )
}

const findStoragePolicyToggle = (
  container: HTMLDivElement | null,
  labelText: string,
): HTMLInputElement | null =>
  (Array.from(
    container?.querySelectorAll('.HomePageSurfaceStoragePolicyToggle') ?? [],
  ).find((label) => label.textContent === labelText)?.querySelector('input') as
    | HTMLInputElement
    | null) ?? null

describe('HomePageSurface', () => {
  let container: HTMLDivElement | null = null
  let root: Root | null = null

  beforeEach(() => {
    useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
    window.localStorage.clear()
  })

  afterEach(async () => {
    Reflect.deleteProperty(navigator, 'storage')
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    root = null
    container = null
    document.body.innerHTML = ''
  })

  it('updates the persisted startup preference from the visible toggle', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const modelViewerToggle = container?.querySelector(
      'input[aria-label="Start in Model Viewport"]',
    ) as HTMLInputElement | null
    expect(modelViewerToggle).not.toBeNull()
    expect(modelViewerToggle?.checked).toBe(false)
    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('homePage')
    expect(readPersistedUiPrefs()?.workspaceStartupSurface).toBe('homePage')

    await act(async () => {
      modelViewerToggle?.click()
    })

    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('modelViewer')
    expect(readPersistedUiPrefs()?.workspaceStartupSurface).toBe('modelViewer')

    expect(modelViewerToggle?.checked).toBe(true)

    await act(async () => {
      modelViewerToggle?.click()
    })

    expect(useUiPrefsStore.getState().workspaceStartupSurface).toBe('homePage')
    expect(readPersistedUiPrefs()?.workspaceStartupSurface).toBe('homePage')
    expect(modelViewerToggle?.checked).toBe(false)
  })

  it('renders the Home Page control deck with a left rail and main region', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const controlDeck = container?.querySelector(
      '[aria-label="Home Page control deck"]',
    ) as HTMLElement | null
    const controlRail = container?.querySelector(
      '[aria-label="Home Page control rail"]',
    ) as HTMLElement | null
    const mainRegion = container?.querySelector(
      '[aria-label="Home Page main region"]',
    ) as HTMLElement | null

    expect(controlDeck).not.toBeNull()
    expect(controlRail).not.toBeNull()
    expect(mainRegion).not.toBeNull()
    expect(controlRail?.querySelector('.HomePageSurfaceIntro')?.textContent).toContain(
      'Home Page',
    )
    expect(controlRail?.querySelector('.HomePageSurfaceStartupToggle')).not.toBeNull()
    expect(controlRail?.querySelector('.HomePageSurfaceLaunchActions')).not.toBeNull()
    expect(controlRail?.querySelector('[aria-label="Home Page help shortcuts"]')).not.toBeNull()
    expect(
      controlRail?.querySelector('[data-home-page-rail-shortcut="docs"]')?.getAttribute('href'),
    ).toBe(homePageDocsUrl)
    expect(
      controlRail?.querySelector('[data-home-page-rail-shortcut="github"]')?.getAttribute('href'),
    ).toBe(homePageGithubUrl)
    expect(
      controlRail?.querySelector('[data-home-page-rail-debug-affordance="advanced"]')
        ?.textContent,
    ).toContain('Read-only status')
    expect(mainRegion?.querySelector('[aria-label="Orientation"]')).not.toBeNull()
    expect(mainRegion?.querySelector('[aria-label="Storage Management"]')).not.toBeNull()
  })

  it('shows visible persistence policy toggles on the matching storage rows', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const persistenceLabels = Array.from(
      container?.querySelectorAll('.HomePageSurfaceStoragePolicyToggle') ?? [],
    )
    expect(persistenceLabels.map((label) => label.textContent)).toEqual(
      expect.arrayContaining([
        'Workspace restore',
        'View settings',
        'Environment',
        'Graph working set',
        'Recent items',
        'PubParts Library',
      ]),
    )

    const checkboxes = Array.from(
      container?.querySelectorAll('.HomePageSurfaceStoragePolicyToggle input[type="checkbox"]') ??
        [],
    ) as HTMLInputElement[]

    expect(checkboxes).toHaveLength(8)
    expect(
      checkboxes
        .filter((checkbox) => checkbox !== findStoragePolicyToggle(container, 'PubParts Library'))
        .every((checkbox) => checkbox.checked),
    ).toBe(true)
    expect(findStoragePolicyToggle(container, 'PubParts Library')?.checked).toBe(false)

    const workspaceRestoreToggle = findStoragePolicyToggle(container, 'Workspace restore')
    const viewSettingsToggle = findStoragePolicyToggle(container, 'View settings')
    const environmentToggle = findStoragePolicyToggle(container, 'Environment')

    await act(async () => {
      workspaceRestoreToggle?.click()
      viewSettingsToggle?.click()
      environmentToggle?.click()
    })

    expect(useUiPrefsStore.getState().workspaceRestorePersistence).toBe(false)
    expect(useUiPrefsStore.getState().viewSettingsPersistence).toBe(false)
    expect(useUiPrefsStore.getState().environmentPersistence).toBe(false)

    expect(readPersistedUiPrefs()).toMatchObject({
      version: 2,
      workspaceRestorePersistence: false,
      viewSettingsPersistence: false,
      environmentPersistence: false,
      dashboardPersistence: true,
      notepadPersistence: true,
    })
  })

  it('shows visible persistence policy toggles for dashboard and notepad storage buckets', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const persistenceLabels = Array.from(
      container?.querySelectorAll('.HomePageSurfaceStoragePolicyToggle') ?? [],
    ).map((label) => label.textContent)
    expect(persistenceLabels).toEqual(
      expect.arrayContaining(['Dashboard', 'Notepad']),
    )
    expect(
      container?.querySelector('[aria-label="Storage Management"]')?.textContent,
    ).toContain('graphBrowserStoragePersistence.ts')
    expect(
      container?.querySelector('[aria-label="Storage Management"]')?.textContent,
    ).toContain(homePageRecentItemsPersistenceNote)

    const checkboxes = Array.from(
      container?.querySelectorAll('.HomePageSurfaceStoragePolicyToggle input[type="checkbox"]') ??
        [],
    ) as HTMLInputElement[]
    expect(checkboxes).toHaveLength(8)

    const dashboardToggle = findStoragePolicyToggle(container, 'Dashboard')
    const notepadToggle = findStoragePolicyToggle(container, 'Notepad')

    await act(async () => {
      dashboardToggle?.click()
      notepadToggle?.click()
    })

    expect(useUiPrefsStore.getState().dashboardPersistence).toBe(false)
    expect(useUiPrefsStore.getState().notepadPersistence).toBe(false)
    expect(readPersistedUiPrefs()).toMatchObject({
      dashboardPersistence: false,
      notepadPersistence: false,
    })
  })

  it('shows and updates the graph browser-storage remember policy without using graph file IO as owner', async () => {
    window.localStorage.setItem(graphBrowserStorageSnapshotKey, '{"version":1}')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const graphPolicyToggle = findStoragePolicyToggle(container, 'Graph working set')

    expect(graphPolicyToggle).not.toBeNull()
    expect(graphPolicyToggle?.checked).toBe(true)
    expect(container?.querySelector('[aria-label="Storage Management"]')?.textContent).toContain(
      'graphBrowserStoragePersistence.ts',
    )

    await act(async () => {
      graphPolicyToggle?.click()
    })

    expect(graphPolicyToggle?.checked).toBe(false)
    expect(readGraphBrowserStoragePolicy()).toEqual({
      version: 1,
      rememberGraphWorkingSet: false,
    })
    expect(window.localStorage.getItem(graphBrowserStoragePolicyKey)).toContain(
      '"rememberGraphWorkingSet":false',
    )
    expect(window.localStorage.getItem(graphBrowserStorageSnapshotKey)).toBeNull()
  })

  it('shows and updates the recent-items remember policy through the recent-items owner seam', async () => {
    window.localStorage.setItem(recentItemsStorageSnapshotKey, '{"version":1}')

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const recentItemsToggle = findStoragePolicyToggle(container, 'Recent items')

    expect(recentItemsToggle).not.toBeNull()
    expect(recentItemsToggle?.checked).toBe(true)
    expect(container?.querySelector('[aria-label="Storage Management"]')?.textContent).toContain(
      'recentItemsPersistence.ts',
    )
    expect(container?.querySelector('[aria-label="Storage Management"]')?.textContent).toContain(
      recentItemsStorageSnapshotKey,
    )

    await act(async () => {
      recentItemsToggle?.click()
    })

    expect(recentItemsToggle?.checked).toBe(false)
    expect(readRecentItemsPolicy()).toEqual({
      version: 1,
      rememberRecentItems: false,
    })
    expect(window.localStorage.getItem(recentItemsStoragePolicyKey)).toContain(
      '"rememberRecentItems":false',
    )
    expect(window.localStorage.getItem(recentItemsStorageSnapshotKey)).toBeNull()
  })

  it('shows a compact orientation quick-start card with repo and docs status', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const orientationStrip = container?.querySelector(
      '[aria-label="Orientation"]',
    ) as HTMLElement | null
    const storageSection = container?.querySelector(
      '[aria-label="Storage Management"]',
    ) as HTMLElement | null

    expect(orientationStrip).not.toBeNull()
    expect(orientationStrip?.textContent).toContain('Quick start')
    expect(orientationStrip?.textContent).toContain('Status, repo, and version read.')
    expect(orientationStrip?.textContent).toContain('Get Started with ParaHook')
    expect(
      orientationStrip?.querySelector(
        '[data-home-page-orientation-affordance="get-started"]',
      ),
    ).not.toBeNull()
    expect(orientationStrip?.textContent).toContain(homePageVersionLabel)
    expect(orientationStrip?.textContent).toContain(homePageWhatIsNewSummary)
    expect(orientationStrip?.querySelectorAll('[data-home-page-orientation-link]')).toHaveLength(2)
    expect(
      orientationStrip
        ?.querySelector('[data-home-page-orientation-link="github"]')
        ?.getAttribute('href'),
    ).toBe(homePageGithubUrl)
    expect(
      orientationStrip
        ?.querySelector('[data-home-page-orientation-link="docs"]')
        ?.getAttribute('href'),
    ).toBe(homePageDocsUrl)
    expect(storageSection).not.toBeNull()
    expect((orientationStrip?.textContent ?? '').length).toBeLessThan(
      storageSection?.textContent?.length ?? 0,
    )
  })

  it('invokes the first launch callbacks from the visible launch actions', async () => {
    const onOpenSurface = vi.fn()

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <HomePageSurface
          surfaceInstanceId="home-page-workspace-slot-primary"
          slotId="workspace-slot-primary"
          onOpenSurface={onOpenSurface}
        />,
      )
    })

    expect(
      container?.querySelector('.HomePageSurfaceControlRail .HomePageSurfaceLaunchActions'),
    ).not.toBeNull()
    expect(container?.querySelector('.HomePageSurfaceLaunchActions')?.textContent).toContain(
      'Open viewport',
    )

    const launchButtons = Array.from(container?.querySelectorAll('.HomePageSurfaceLaunchActions button') ?? []) as HTMLButtonElement[]
    expect(launchButtons.map((button) => button.textContent)).toEqual([
      'Model Viewport',
      'Browser',
      'Catalog',
      'Console',
      'Spaghetti Editor',
      'Dashboard',
      'Notepad',
    ])
    expect(launchButtons.map((button) => button.textContent)).not.toEqual(
      expect.arrayContaining(['Docker', 'Scratchpad', 'Hotspot']),
    )
    const openModelViewportButton = launchButtons.find((button) => button.textContent === 'Model Viewport')
    expect(openModelViewportButton).not.toBeUndefined()

    await act(async () => {
      openModelViewportButton?.click()
    })
    expect(onOpenSurface).toHaveBeenLastCalledWith('modelViewer')

    const openBrowserButton = launchButtons.find((button) => button.textContent === 'Browser')
    const openCatalogButton = launchButtons.find((button) => button.textContent === 'Catalog')
    const openConsoleButton = launchButtons.find((button) => button.textContent === 'Console')
    const openSpaghettiEditorButton = launchButtons.find(
      (button) => button.textContent === 'Spaghetti Editor',
    )
    const openDashboardButton = launchButtons.find((button) => button.textContent === 'Dashboard')
    const openNotepadButton = launchButtons.find((button) => button.textContent === 'Notepad')

    await act(async () => {
      openBrowserButton?.click()
      openCatalogButton?.click()
      openConsoleButton?.click()
      openSpaghettiEditorButton?.click()
      openDashboardButton?.click()
      openNotepadButton?.click()
    })

    expect(onOpenSurface.mock.calls).toEqual([
      ['modelViewer'],
      ['browser'],
      ['catalog'],
      ['console'],
      ['spaghettiEditor'],
      ['dashboard'],
      ['notepad'],
    ])
  })

  it('shows Storage Management inventory and preserves selected-key wipe behavior', async () => {
    window.localStorage.setItem(workspaceLayoutStorageKey, '{"layout":"alpha"}')
    window.localStorage.setItem(uiPrefsStorageKey, '{"view":"beta"}')
    window.localStorage.setItem(dashboardStorageKey, '{"widgets":"gamma"}')
    window.localStorage.setItem(graphBrowserStorageSnapshotKey, '{"graphs":"epsilon"}')
    window.localStorage.setItem(recentItemsStorageSnapshotKey, '{"recent":"zeta"}')
    window.localStorage.setItem(pubPartsDownloadsStorageKey, '{"downloads":"eta"}')
    Object.defineProperty(navigator, 'storage', {
      configurable: true,
      value: {
        estimate: vi.fn(async () => ({
          usage: 2048,
          quota: 8192,
        })),
      },
    })

    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
      await Promise.resolve()
    })

    const storageSection = container?.querySelector(
      '[aria-label="Storage Management"]',
    ) as HTMLElement | null
    expect(storageSection).not.toBeNull()
    expect(storageSection?.textContent).toContain('Storage Management')
    expect(storageSection?.textContent).toContain(
      'Manage ParaHook-owned browser persistence buckets without changing owners.',
    )
    expect(storageSection?.textContent).toContain('Workspace layout')
    expect(storageSection?.textContent).toContain(workspaceLayoutStorageKey)
    expect(storageSection?.textContent).toContain('UI preferences')
    expect(storageSection?.textContent).toContain(uiPrefsStorageKey)
    expect(storageSection?.textContent).toContain('Dashboard widgets')
    expect(storageSection?.textContent).toContain(dashboardStorageKey)
    expect(storageSection?.textContent).toContain('Notepad notes')
    expect(storageSection?.textContent).toContain(notepadStorageKey)
    expect(storageSection?.textContent).toContain('Graph working set')
    expect(storageSection?.textContent).toContain(graphBrowserStorageSnapshotKey)
    expect(storageSection?.textContent).toContain('Recent items')
    expect(storageSection?.textContent).toContain(recentItemsStorageSnapshotKey)
    expect(storageSection?.textContent).toContain('PubParts downloads')
    expect(storageSection?.textContent).toContain(pubPartsDownloadsStorageKey)
    expect(storageSection?.textContent).toContain(pubPartsDownloadsFolderPath)
    expect(storageSection?.textContent).toContain(pubPartsLocalLibraryFolderPath)
    expect(storageSection?.textContent).toContain('Browser origin storage estimate: 2.0 KiB used of 8.0 KiB')
    expect(storageSection?.textContent).toContain('graphBrowserStoragePersistence.ts')
    expect(storageSection?.textContent).toContain(homePageRecentItemsPersistenceNote)

    const storageRows = Array.from(
      container?.querySelectorAll('[data-home-page-storage-bucket-key]') ?? [],
    ) as HTMLElement[]
    expect(storageRows).toHaveLength(7)
    expect(
      container?.querySelector('.HomePageSurfaceStorageTransparencyList[role="list"]'),
    ).not.toBeNull()
    expect(
      container?.querySelectorAll('.HomePageSurfaceStorageDetailAffordance'),
    ).toHaveLength(7)
    expect(
      container?.querySelectorAll('.HomePageSurfaceStorageWipeButton'),
    ).toHaveLength(7)
    expect(storageRows.map((row) => row.textContent)).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/\bB approx\./),
        expect.stringContaining('0 B stored'),
      ]),
    )

    const workspaceLayoutRow = container?.querySelector(
      `[data-home-page-storage-bucket-key="${workspaceLayoutStorageKey}"]`,
    ) as HTMLElement | null
    const workspaceLayoutWipeButton = workspaceLayoutRow?.querySelector(
      '.HomePageSurfaceStorageWipeButton',
    ) as HTMLButtonElement | null

    await act(async () => {
      workspaceLayoutWipeButton?.click()
    })

    expect(window.localStorage.getItem(workspaceLayoutStorageKey)).toBeNull()
    expect(workspaceLayoutRow?.textContent).toContain('0 B stored')
  })

  it('toggles the PubParts Library status through the PubParts storage owner seam', async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(<HomePageSurfaceHarness />)
    })

    const pubPartsLibraryToggle = findStoragePolicyToggle(container, 'PubParts Library')
    expect(pubPartsLibraryToggle).not.toBeNull()
    expect(pubPartsLibraryToggle?.checked).toBe(false)
    expect(readPubPartsDownloadsStorage(window.localStorage).library.status).toBe(
      'not-configured',
    )

    await act(async () => {
      pubPartsLibraryToggle?.click()
    })

    expect(pubPartsLibraryToggle?.checked).toBe(true)
    expect(readPubPartsDownloadsStorage(window.localStorage).library).toEqual(
      expect.objectContaining({
        status: 'permission-needed',
        rootFolderPath: pubPartsLocalLibraryFolderPath,
      }),
    )

    await act(async () => {
      pubPartsLibraryToggle?.click()
    })

    expect(pubPartsLibraryToggle?.checked).toBe(false)
    expect(readPubPartsDownloadsStorage(window.localStorage).library.status).toBe('disabled')
  })
})
