import { beforeAll, describe, expect, it } from 'vitest'
import {
  getWorkspaceSurfaceCatalogEntries,
  getWorkspaceSurfaceDefaultLabel,
} from '../workspace/workspaceSurfaceCatalog'
import type { WorkspaceSurfaceKind } from '../workspace/workspaceShellTypes'

class MockWorker {
  public addEventListener(): void {}
  public removeEventListener(): void {}
  public postMessage(): void {}
  public terminate(): void {}
}

let createConsoleRootSession: typeof import('./stagedNavigation').createConsoleRootSession
let createConsoleStagedNavigationContext: typeof import('./stagedNavigation').createConsoleStagedNavigationContext
let submitConsoleStagedNavigationToken: typeof import('./stagedNavigation').submitConsoleStagedNavigationToken

beforeAll(async () => {
  globalThis.Worker = MockWorker as unknown as typeof Worker
  ;({
    createConsoleRootSession,
    createConsoleStagedNavigationContext,
    submitConsoleStagedNavigationToken,
  } = await import('./stagedNavigation'))
})

describe('stagedNavigation workspace modes', () => {
  it('adds Workspace Modes to the root staged session choices', () => {
    const result = createConsoleRootSession()

    expect(result.scopeId).toBe('root')
    expect(result.breadcrumb).toEqual(['Root'])
    expect(result.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'GRAPH',
      'SKETCH',
      'NEW_SKETCH',
      'CONTENT',
      'REFERENCES',
      'HIDE',
      'UNHIDEALL',
      'WORKSPACEMODES',
      'SETTINGS',
      'CONSOLEINPUT',
      'CAMERA',
      'RADIO',
      'ZOOM',
      'PAN',
      'ORBIT',
    ])
  })

  it('advances into the workspace modes viewport picker and exposes split choices for the chosen viewport', () => {
    const context = createConsoleStagedNavigationContext(
      [{ graphDocumentId: 'graph-document-1', name: 'Graph 1' }],
      [],
      [],
      {
        hasSelection: false,
        hasPrevious: false,
        preferredTool: 'LINE',
      },
      {},
      {},
      {},
      {},
      {},
      {},
      [
        {
          viewportId: 'model-viewer-workspace-slot-1',
          slotId: 'workspace-slot-1',
          isPrimary: true,
          label: 'Model Viewport 1',
          surfaceKind: 'modelViewer',
        },
        {
          viewportId: 'browser-workspace-slot-2',
          slotId: 'workspace-slot-2',
          isPrimary: false,
          label: 'Browser Viewport',
          surfaceKind: 'browser',
        },
        {
          viewportId: 'home-page-workspace-slot-3',
          slotId: 'workspace-slot-3',
          isPrimary: false,
          label: 'Home Page 3',
          surfaceKind: 'homePage',
        },
        {
          viewportId: 'model-viewer-workspace-slot-4',
          slotId: 'workspace-slot-4',
          isPrimary: false,
          label: 'Model Viewport 2',
          surfaceKind: 'modelViewer',
        },
        {
          viewportId: 'console-workspace-slot-5',
          slotId: 'workspace-slot-5',
          isPrimary: false,
          label: 'Console Viewport',
          surfaceKind: 'console',
        },
        {
          viewportId: 'catalog-workspace-slot-6',
          slotId: 'workspace-slot-6',
          isPrimary: false,
          label: 'Catalog Viewport',
          surfaceKind: 'catalog',
        },
        {
          viewportId: 'home-page-floating-1',
          surfaceInstanceId: 'home-page-floating-1',
          hostMode: 'floating',
          label: 'Home Page (Floating)',
          surfaceKind: 'homePage',
        },
        {
          viewportId: 'console-popout-1',
          surfaceInstanceId: 'console-popout-1',
          hostMode: 'popout',
          label: 'Console Viewport (Popout)',
          surfaceKind: 'console',
        },
      ],
    )

    const workspaceModesRoot = submitConsoleStagedNavigationToken(createConsoleRootSession(), 'wm', context)
    expect(workspaceModesRoot.kind).toBe('advance')
    if (workspaceModesRoot.kind !== 'advance') {
      throw new Error('Expected workspace modes token to advance')
    }
    expect(workspaceModesRoot.session.scopeId).toBe('workspaceModesRoot')
    expect(workspaceModesRoot.session.breadcrumb).toEqual(['Root', 'Workspace Modes'])
    expect(workspaceModesRoot.validChoices.map((choice) => choice.label)).toEqual([
      'Model Viewport 1',
      'Browser Viewport',
      'Home Page 3',
      'Model Viewport 2',
      'Console Viewport',
      'Catalog Viewport',
      'Home Page (Floating)',
      'Console Viewport (Popout)',
      'Back',
    ])

    const backFromWorkspaceModesRoot = submitConsoleStagedNavigationToken(
      workspaceModesRoot.session,
      'b',
      context,
    )
    expect(backFromWorkspaceModesRoot.kind).toBe('advance')
    if (backFromWorkspaceModesRoot.kind !== 'advance') {
      throw new Error('Expected back token to advance from workspace modes root')
    }
    expect(backFromWorkspaceModesRoot.session.scopeId).toBe('root')

    const selectedViewport = submitConsoleStagedNavigationToken(workspaceModesRoot.session, 'br', context)
    expect(selectedViewport.kind).toBe('advance')
    if (selectedViewport.kind !== 'advance') {
      throw new Error('Expected viewport selection token to advance')
    }
    expect(selectedViewport.session.scopeId).toBe('workspaceModeViewportSelected')
    expect(selectedViewport.session.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
    ])
    expect(selectedViewport.session.selections.workspaceViewportId).toBe('browser-workspace-slot-2')
    expect(selectedViewport.validChoices.map((choice) => choice.label)).toEqual([
      'Split Menu',
      'Viewport Type Menu',
      'Float',
      'Open In New Browser',
      'Close',
      'Back',
    ])

    const selectedHomePage = submitConsoleStagedNavigationToken(workspaceModesRoot.session, 'h', context)
    expect(selectedHomePage.kind).toBe('advance')
    if (selectedHomePage.kind !== 'advance') {
      throw new Error('Expected home page selection token to advance')
    }
    expect(selectedHomePage.session.scopeId).toBe('workspaceModeViewportSelected')
    expect(selectedHomePage.session.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Home Page 3',
    ])
    expect(selectedHomePage.session.selections.workspaceViewportId).toBe('home-page-workspace-slot-3')
    expect(selectedHomePage.validChoices.map((choice) => choice.label)).toEqual([
      'Split Menu',
      'Viewport Type Menu',
      'Float',
      'Open In New Browser',
      'Close',
      'Back',
    ])

    const selectedModelViewport = submitConsoleStagedNavigationToken(workspaceModesRoot.session, 'm', context)
    expect(selectedModelViewport.kind).toBe('advance')
    if (selectedModelViewport.kind !== 'advance') {
      throw new Error('Expected model viewport selection token to advance')
    }
    expect(selectedModelViewport.validChoices.map((choice) => choice.label)).toEqual([
      'Split Menu',
      'Viewport Type Menu',
      'Open In New Browser',
      'Back',
    ])

    const selectedNonPrimaryModelViewport = submitConsoleStagedNavigationToken(
      workspaceModesRoot.session,
      '4',
      context,
    )
    expect(selectedNonPrimaryModelViewport.kind).toBe('advance')
    if (selectedNonPrimaryModelViewport.kind !== 'advance') {
      throw new Error('Expected non-primary model viewport selection token to advance')
    }
    expect(selectedNonPrimaryModelViewport.validChoices.map((choice) => choice.label)).toEqual([
      'Split Menu',
      'Viewport Type Menu',
      'Float',
      'Open In New Browser',
      'Close',
      'Back',
    ])

    const selectedConsoleViewport = submitConsoleStagedNavigationToken(
      workspaceModesRoot.session,
      '5',
      context,
    )
    expect(selectedConsoleViewport.kind).toBe('advance')
    if (selectedConsoleViewport.kind !== 'advance') {
      throw new Error('Expected console viewport selection token to advance')
    }
    expect(selectedConsoleViewport.validChoices.map((choice) => choice.label)).toEqual([
      'Split Menu',
      'Viewport Type Menu',
      'Float',
      'Open In New Browser',
      'Close',
      'Back',
    ])

    const selectedCatalogViewport = submitConsoleStagedNavigationToken(
      workspaceModesRoot.session,
      '6',
      context,
    )
    expect(selectedCatalogViewport.kind).toBe('advance')
    if (selectedCatalogViewport.kind !== 'advance') {
      throw new Error('Expected catalog viewport selection token to advance')
    }
    expect(selectedCatalogViewport.validChoices.map((choice) => choice.label)).toEqual([
      'Split Menu',
      'Viewport Type Menu',
      'Float',
      'Close',
      'Back',
    ])

    const selectedFloatingHomePage = submitConsoleStagedNavigationToken(
      workspaceModesRoot.session,
      '7',
      context,
    )
    expect(selectedFloatingHomePage.kind).toBe('advance')
    if (selectedFloatingHomePage.kind !== 'advance') {
      throw new Error('Expected floating home page selection token to advance')
    }
    expect(selectedFloatingHomePage.session.scopeId).toBe('workspaceModeViewportSelected')
    expect(selectedFloatingHomePage.session.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Home Page (Floating)',
    ])
    expect(selectedFloatingHomePage.session.selections.workspaceViewportId).toBe('home-page-floating-1')
    expect(selectedFloatingHomePage.validChoices.map((choice) => choice.label)).toEqual(['Back'])

    const selectedPopoutConsole = submitConsoleStagedNavigationToken(
      workspaceModesRoot.session,
      '8',
      context,
    )
    expect(selectedPopoutConsole.kind).toBe('advance')
    if (selectedPopoutConsole.kind !== 'advance') {
      throw new Error('Expected popout console selection token to advance')
    }
    expect(selectedPopoutConsole.session.scopeId).toBe('workspaceModeViewportSelected')
    expect(selectedPopoutConsole.session.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Console Viewport (Popout)',
    ])
    expect(selectedPopoutConsole.session.selections.workspaceViewportId).toBe('console-popout-1')
    expect(selectedPopoutConsole.validChoices.map((choice) => choice.label)).toEqual(['Back'])

    const floatBrowserViewport = submitConsoleStagedNavigationToken(selectedViewport.session, 'f', context)
    expect(floatBrowserViewport.kind).toBe('execute')
    if (floatBrowserViewport.kind !== 'execute') {
      throw new Error('Expected browser float token to execute')
    }
    expect(floatBrowserViewport.actionId).toBe('workspace.viewport.float')
    expect(floatBrowserViewport.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Float',
    ])

    const closeMenu = submitConsoleStagedNavigationToken(selectedViewport.session, 'c', context)
    expect(closeMenu.kind).toBe('advance')
    if (closeMenu.kind !== 'advance') {
      throw new Error('Expected close token to advance')
    }
    expect(closeMenu.session.scopeId).toBe('workspaceModeViewportCloseConfirmSelected')
    expect(closeMenu.session.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Close',
    ])
    expect(closeMenu.validChoices.map((choice) => choice.label)).toEqual([
      'Confirm Close',
      'Back',
    ])

    const confirmClose = submitConsoleStagedNavigationToken(closeMenu.session, 'c', context)
    expect(confirmClose.kind).toBe('execute')
    if (confirmClose.kind !== 'execute') {
      throw new Error('Expected confirm close token to execute')
    }
    expect(confirmClose.actionId).toBe('workspace.viewport.close')
    expect(confirmClose.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Close',
      'Confirm Close',
    ])

    const splitMenu = submitConsoleStagedNavigationToken(selectedViewport.session, 's', context)
    expect(splitMenu.kind).toBe('advance')
    if (splitMenu.kind !== 'advance') {
      throw new Error('Expected split menu token to advance')
    }
    expect(splitMenu.session.scopeId).toBe('workspaceModeViewportSplitSelected')
    expect(splitMenu.session.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Split Menu',
    ])
    expect(splitMenu.validChoices.map((choice) => choice.label)).toEqual([
      'Split Top',
      'Split Right',
      'Split Bottom',
      'Split Left',
      'Back',
    ])

    const viewportType = submitConsoleStagedNavigationToken(selectedViewport.session, 'v', context)
    expect(viewportType.kind).toBe('advance')
    if (viewportType.kind !== 'advance') {
      throw new Error('Expected viewport type token to advance')
    }
    expect(viewportType.session.scopeId).toBe('workspaceModeViewportTypeSelected')
    expect(viewportType.session.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Viewport Type Menu',
    ])
    const getExpectedViewportTypeLabel = (surfaceKind: WorkspaceSurfaceKind) =>
      surfaceKind === 'modelViewer'
        ? getWorkspaceSurfaceDefaultLabel(surfaceKind)
        : getWorkspaceSurfaceDefaultLabel(surfaceKind).replace(/ Viewport$/, '')
    const expectedViewportTypeLabels = getWorkspaceSurfaceCatalogEntries()
      .filter((entry) => entry.supports.slotted)
      .map((entry) => getExpectedViewportTypeLabel(entry.kind))
    expect(viewportType.validChoices.map((choice) => choice.label)).toEqual([
      ...expectedViewportTypeLabels,
      'Back',
    ])

    const chooseBrowser = submitConsoleStagedNavigationToken(viewportType.session, 'br', context)
    expect(chooseBrowser.kind).toBe('execute')
    if (chooseBrowser.kind !== 'execute') {
      throw new Error('Expected browser viewport type token to execute')
    }
    expect(chooseBrowser.actionId).toBe('workspace.viewport.type.browser')
    expect(chooseBrowser.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Viewport Type Menu',
      'Browser',
    ])

    const backFromViewportType = submitConsoleStagedNavigationToken(viewportType.session, 'b', context)
    expect(backFromViewportType.kind).toBe('advance')
    if (backFromViewportType.kind !== 'advance') {
      throw new Error('Expected back token to advance from viewport type submenu')
    }
    expect(backFromViewportType.session.scopeId).toBe('workspaceModeViewportSelected')

    const chooseConsole = submitConsoleStagedNavigationToken(viewportType.session, 'console', context)
    expect(chooseConsole.kind).toBe('execute')
    if (chooseConsole.kind !== 'execute') {
      throw new Error('Expected console viewport type token to execute')
    }
    expect(chooseConsole.actionId).toBe('workspace.viewport.type.console')
    expect(chooseConsole.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Viewport Type Menu',
      'Console',
    ])

    const chooseSpaghettiEditor = submitConsoleStagedNavigationToken(viewportType.session, 's', context)
    expect(chooseSpaghettiEditor.kind).toBe('execute')
    if (chooseSpaghettiEditor.kind !== 'execute') {
      throw new Error('Expected spaghetti editor viewport type token to execute')
    }
    expect(chooseSpaghettiEditor.actionId).toBe('workspace.viewport.type.spaghettiEditor')
    expect(chooseSpaghettiEditor.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Viewport Type Menu',
      'Spaghetti Editor',
    ])

    const chooseHomePage = submitConsoleStagedNavigationToken(viewportType.session, 'hp', context)
    expect(chooseHomePage.kind).toBe('execute')
    if (chooseHomePage.kind !== 'execute') {
      throw new Error('Expected home page viewport type token to execute')
    }
    expect(chooseHomePage.actionId).toBe('workspace.viewport.type.homePage')
    expect(chooseHomePage.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Viewport Type Menu',
      'Home Page',
    ])

    for (const catalogEntry of getWorkspaceSurfaceCatalogEntries().filter((entry) => entry.supports.slotted)) {
      const chooseCatalogSurface = submitConsoleStagedNavigationToken(
        viewportType.session,
        getExpectedViewportTypeLabel(catalogEntry.kind),
        context,
      )
      expect(chooseCatalogSurface.kind).toBe('execute')
      if (chooseCatalogSurface.kind !== 'execute') {
        throw new Error(`Expected ${catalogEntry.kind} viewport type token to execute`)
      }
      expect(chooseCatalogSurface.actionId).toBe(`workspace.viewport.type.${catalogEntry.kind}`)
    }

    const openInNewBrowser = submitConsoleStagedNavigationToken(
      selectedModelViewport.session,
      'o',
      context,
    )
    expect(openInNewBrowser.kind).toBe('execute')
    if (openInNewBrowser.kind !== 'execute') {
      throw new Error('Expected open in new browser token to execute')
    }
    expect(openInNewBrowser.actionId).toBe('workspace.viewport.openInNewBrowser')
    expect(openInNewBrowser.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Model Viewport 1',
      'Open In New Browser',
    ])

    const openBrowserInNewBrowser = submitConsoleStagedNavigationToken(
      selectedViewport.session,
      'o',
      context,
    )
    expect(openBrowserInNewBrowser.kind).toBe('execute')
    if (openBrowserInNewBrowser.kind !== 'execute') {
      throw new Error('Expected browser open in new browser token to execute')
    }
    expect(openBrowserInNewBrowser.actionId).toBe('workspace.viewport.openInNewBrowser')
    expect(openBrowserInNewBrowser.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Open In New Browser',
    ])

    const splitRight = submitConsoleStagedNavigationToken(splitMenu.session, 'r', context)
    expect(splitRight.kind).toBe('execute')
    if (splitRight.kind !== 'execute') {
      throw new Error('Expected split right token to execute')
    }
    expect(splitRight.actionId).toBe('workspace.viewport.split.right')
    expect(splitRight.breadcrumb).toEqual([
      'Root',
      'Workspace Modes',
      'Browser Viewport',
      'Split Menu',
      'Split Right',
    ])

    const backFromSplitMenu = submitConsoleStagedNavigationToken(splitMenu.session, 'ba', context)
    expect(backFromSplitMenu.kind).toBe('advance')
    if (backFromSplitMenu.kind !== 'advance') {
      throw new Error('Expected back token to advance from split menu')
    }
    expect(backFromSplitMenu.session.scopeId).toBe('workspaceModeViewportSelected')

    const splitBottom = submitConsoleStagedNavigationToken(splitMenu.session, 'b', context)
    expect(splitBottom.kind).toBe('execute')
    if (splitBottom.kind !== 'execute') {
      throw new Error('Expected split bottom token to execute')
    }
    expect(splitBottom.actionId).toBe('workspace.viewport.split.bottom')
  })
})
