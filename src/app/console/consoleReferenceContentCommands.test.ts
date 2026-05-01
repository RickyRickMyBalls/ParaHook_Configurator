// @vitest-environment jsdom

import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockResolveConsoleWorkspaceContextSync = vi.fn()

vi.mock('./stagedNavigation', async () => {
  const actual = await vi.importActual<typeof import('./stagedNavigation')>(
    './stagedNavigation',
  )
  return {
    ...actual,
    resolveConsoleWorkspaceContextSync: (...args: unknown[]) =>
      mockResolveConsoleWorkspaceContextSync(...args),
  }
})

type CommandsModule = typeof import('./consoleReferenceContentCommands')

class MockWorker {
  public addEventListener(): void {}
  public removeEventListener(): void {}
  public postMessage(): void {}
  public terminate(): void {}
}

let commands: CommandsModule

const makeSession = (overrides: Record<string, unknown> = {}) =>
  ({
    scopeId: 'contentRoot',
    breadcrumb: ['Root', 'Content'],
    selections: {
      graphDocumentId: null,
      selectedNodeId: null,
      sketchNodeId: null,
      referenceId: null,
      referenceCategoryId: null,
      contentAssemblyId: null,
      contentComponentId: null,
      contentObjectId: null,
    },
    validChoices: [],
    ...overrides,
  }) as any

const makeEntryRecorder = () => {
  const entries: any[] = []
  return {
    entries,
    appendConsoleEntry: (entry: any) => {
      entries.push(entry)
    },
  }
}

const makeReferenceTransformOverride = () => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const makePromptDeps = (overrides: Record<string, unknown> = {}) => {
  const { entries, appendConsoleEntry } = makeEntryRecorder()
  const appState = {
    renameProjectContentOwner: vi.fn(),
    requestConsoleContextSync: vi.fn(),
    referenceWorkspace: {},
    ...((overrides.appState as object | undefined) ?? {}),
  }
  const consolePromptSession =
    (overrides.consolePromptSession as any | undefined) ?? null
  const stagedNavigationSession =
    (overrides.stagedNavigationSession as any | undefined) ?? null

  return {
    entries,
    appState,
    appendConsoleEntry,
    applyReferenceTransformSpaceShortcut:
      (overrides.applyReferenceTransformSpaceShortcut as any) ?? vi.fn(() => false),
    buildFeatureAssistPromptText:
      (overrides.buildFeatureAssistPromptText as any) ?? vi.fn(() => 'assist'),
    clearConsolePromptSession:
      (overrides.clearConsolePromptSession as any) ?? vi.fn(),
    commitActiveReferenceTransformFromConsole:
      (overrides.commitActiveReferenceTransformFromConsole as any) ?? vi.fn(),
    createActiveContentObjectTransformRootSession:
      (overrides.createActiveContentObjectTransformRootSession as any) ??
      vi.fn((objectId: string) =>
        makeSession({
          scopeId: 'contentObjectTransformRoot',
          breadcrumb: ['Root', 'Content', 'Viewer Transform'],
          selections: { contentObjectId: objectId },
        }),
      ),
    createActiveEnvironmentLightTransformRootSession:
      (overrides.createActiveEnvironmentLightTransformRootSession as any) ??
      vi.fn((lightId: string) =>
        makeSession({
          scopeId: 'contentObjectTransformRoot',
          breadcrumb: ['Root', 'Environment', 'Viewer Transform'],
          selections: { environmentLightId: lightId },
        }),
      ),
    createActiveReferenceTransformRootSession:
      (overrides.createActiveReferenceTransformRootSession as any) ??
      vi.fn((referenceId: string) =>
        makeSession({
          scopeId: 'referenceTransformRoot',
          breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
          selections: { referenceId },
        }),
      ),
    deleteLatestContentObjectTransformEntry:
      (overrides.deleteLatestContentObjectTransformEntry as any) ?? vi.fn(() => null),
    deleteLatestEnvironmentLightTransformEntry:
      (overrides.deleteLatestEnvironmentLightTransformEntry as any) ?? vi.fn(() => null),
    deleteLatestReferenceTransformEntry:
      (overrides.deleteLatestReferenceTransformEntry as any) ?? vi.fn(() => null),
    getActiveFeatureAssistDescriptor:
      (overrides.getActiveFeatureAssistDescriptor as any) ?? vi.fn(() => null),
    getAppState: () => appState as any,
    getConsolePromptSession:
      (overrides.getConsolePromptSession as any) ?? vi.fn(() => consolePromptSession),
    getSpaghettiState:
      (overrides.getSpaghettiState as any) ??
      vi.fn(() => ({ geometrySketchSession: null, sketchPlanePickSession: null })),
    getStagedNavigationSession:
      (overrides.getStagedNavigationSession as any) ??
      vi.fn(() => stagedNavigationSession),
    getViewer: (overrides.getViewer as any) ?? vi.fn(() => null),
    pushCommandHistory: (overrides.pushCommandHistory as any) ?? vi.fn(),
    setInputText: (overrides.setInputText as any) ?? vi.fn(),
    setStagedNavigationSession:
      (overrides.setStagedNavigationSession as any) ?? vi.fn(),
    transitionReferenceTransformAxisPrompt:
      (overrides.transitionReferenceTransformAxisPrompt as any) ?? vi.fn(),
  }
}

const makeExecuteDeps = (overrides: Record<string, unknown> = {}) => {
  const { entries, appendConsoleEntry } = makeEntryRecorder()
  const appState =
    (overrides.appState as any | undefined) ??
    ({
      referenceWorkspace: {
        activeReferenceTransformSession: null,
        activeContentObjectTransformSession: null,
        activeEnvironmentLightTransformSession: null,
        transformHistoryByReferenceId: {},
        transformHistoryByObjectId: {},
        transformHistoryByEnvironmentLightId: {},
        transformSnapByReferenceId: {},
        transformSnapByObjectId: {},
      },
      workspaceSelection: {
        selectedTarget: null,
      },
      projectContent: {
        assembliesById: {},
        componentsById: {},
        objectsById: {},
      },
      selectedPartKey: null,
    } as any)
  let stagedNavigationSession =
    (overrides.stagedNavigationSession as any | undefined) ?? null
  const setStagedNavigationSession =
    (overrides.setStagedNavigationSession as any) ??
    vi.fn((session: any) => {
      stagedNavigationSession = session
    })

  return {
    entries,
    appState,
    appendConsoleEntry,
    activeReferenceSession:
      (overrides.activeReferenceSession as any) ??
      appState.referenceWorkspace.activeReferenceTransformSession ??
      null,
    buildFeatureAssistPromptText:
      (overrides.buildFeatureAssistPromptText as any) ?? vi.fn(() => 'assist'),
    commandIdentity: (overrides.commandIdentity as any) ?? 'cmd-test',
    createActiveContentObjectTransformRootSession:
      (overrides.createActiveContentObjectTransformRootSession as any) ??
      vi.fn((objectId: string) =>
        makeSession({
          scopeId: 'contentObjectTransformRoot',
          breadcrumb: ['Root', 'Content', 'Viewer Transform'],
          selections: { contentObjectId: objectId },
        }),
      ),
    createActiveEnvironmentLightTransformRootSession:
      (overrides.createActiveEnvironmentLightTransformRootSession as any) ??
      vi.fn((lightId: string) =>
        makeSession({
          scopeId: 'contentObjectTransformRoot',
          breadcrumb: ['Root', 'Environment', 'Viewer Transform'],
          selections: { environmentLightId: lightId },
        }),
      ),
    createActiveContentObjectTransformSnapSession:
      (overrides.createActiveContentObjectTransformSnapSession as any) ??
      vi.fn((objectId: string, mode: string) =>
        makeSession({
          scopeId: 'contentObjectTransformSnapRoot',
          breadcrumb: ['Root', 'Content', 'Viewer Transform', 'Snap'],
          selections: { contentObjectId: objectId, mode },
        }),
      ),
    createActiveReferenceTransformRootSession:
      (overrides.createActiveReferenceTransformRootSession as any) ??
      vi.fn((referenceId: string) =>
        makeSession({
          scopeId: 'referenceTransformRoot',
          breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
          selections: { referenceId },
        }),
      ),
    createActiveReferenceTransformSnapSession:
      (overrides.createActiveReferenceTransformSnapSession as any) ??
      vi.fn((referenceId: string, mode: string) =>
        makeSession({
          scopeId: 'referenceTransformSnapRoot',
          breadcrumb: ['Root', 'Reference', 'Viewer Transform', 'Snap'],
          selections: { referenceId, mode },
        }),
      ),
    createDeleteLatestTransformConfirmPromptSession:
      (overrides.createDeleteLatestTransformConfirmPromptSession as any) ??
      vi.fn((target: any, returnSession: any) =>
        commands.createDeleteLatestTransformConfirmPromptSession(target, returnSession),
      ),
    deleteLatestContentObjectTransformEntry:
      (overrides.deleteLatestContentObjectTransformEntry as any) ?? vi.fn(() => null),
    deleteLatestEnvironmentLightTransformEntry:
      (overrides.deleteLatestEnvironmentLightTransformEntry as any) ?? vi.fn(() => null),
    deleteLatestReferenceTransformEntry:
      (overrides.deleteLatestReferenceTransformEntry as any) ?? vi.fn(() => null),
    getActiveFeatureAssistDescriptor:
      (overrides.getActiveFeatureAssistDescriptor as any) ?? vi.fn(() => null),
    getAppState: () => appState,
    getSpaghettiState:
      (overrides.getSpaghettiState as any) ??
      vi.fn(() => ({ geometrySketchSession: null, sketchPlanePickSession: null })),
    getStagedNavigationSession:
      (overrides.getStagedNavigationSession as any) ??
      vi.fn(() => stagedNavigationSession),
    getViewer: (overrides.getViewer as any) ?? vi.fn(() => null),
    inputText: (overrides.inputText as any) ?? 'go',
    requestRadioBurst: (overrides.requestRadioBurst as any) ?? vi.fn(),
    setConsolePromptSession:
      (overrides.setConsolePromptSession as any) ?? vi.fn(),
    setStagedNavigationSession,
  }
}

const makeActiveReferenceSubmitDeps = (overrides: Record<string, unknown> = {}) => {
  const { entries, appendConsoleEntry } = makeEntryRecorder()
  const appState =
    (overrides.appState as any | undefined) ??
    ({
      referenceWorkspace: {
        activeReferenceTransformSession: {
          referenceId: 'reference-1',
          entryActive: true,
          mode: 'translate',
          space: 'local',
          draftTransform: makeReferenceTransformOverride(),
        },
        transformSnapByReferenceId: {},
      },
      setActiveReferenceTransformHandle: vi.fn(),
      setActiveReferenceTransformDraft: vi.fn(),
    } as any)

  return {
    entries,
    appState,
    appendConsoleEntry,
    activeStagedSession:
      (overrides.activeStagedSession as any) ??
      makeSession({ scopeId: 'referenceTransformRoot', selections: { referenceId: 'reference-1' } }),
    applyReferenceTransformSpaceShortcut:
      (overrides.applyReferenceTransformSpaceShortcut as any) ?? vi.fn(() => true),
    cancelActiveReferenceTransformSession:
      (overrides.cancelActiveReferenceTransformSession as any) ?? vi.fn(),
    commitActiveReferenceTransformFromConsole:
      (overrides.commitActiveReferenceTransformFromConsole as any) ?? vi.fn(),
    createActiveReferenceTransformSnapSession:
      (overrides.createActiveReferenceTransformSnapSession as any) ??
      vi.fn((referenceId: string, mode: string) =>
        makeSession({
          scopeId: 'referenceTransformSnapRoot',
          breadcrumb: ['Root', 'Reference', 'Viewer Transform', 'Snap'],
          selections: { referenceId, mode },
        }),
      ),
    dispatchImmediateShortcut:
      (overrides.dispatchImmediateShortcut as any) ?? vi.fn(),
    featureAssistChoiceMatcher:
      (overrides.featureAssistChoiceMatcher as any) ?? vi.fn(() => null),
    featureAssistDescriptor:
      (overrides.featureAssistDescriptor as any) ?? null,
    getAppState: () => appState,
    getConsolePromptSession:
      (overrides.getConsolePromptSession as any) ?? vi.fn(() => null),
    getViewer: (overrides.getViewer as any) ?? vi.fn(() => null),
    inputText: (overrides.inputText as any) ?? 'move',
    openReferenceTransformAxisPrompt:
      (overrides.openReferenceTransformAxisPrompt as any) ?? vi.fn(),
    openReferenceTransformPlanePrompt:
      (overrides.openReferenceTransformPlanePrompt as any) ?? vi.fn(),
    pushCommandHistory: (overrides.pushCommandHistory as any) ?? vi.fn(),
    requestRadioBurst: (overrides.requestRadioBurst as any) ?? vi.fn(),
    resolveFeatureAssistSubmitIdentity:
      (overrides.resolveFeatureAssistSubmitIdentity as any) ??
      vi.fn(() => 'assist-id'),
    setInputText: (overrides.setInputText as any) ?? vi.fn(),
    setStagedNavigationSession:
      (overrides.setStagedNavigationSession as any) ?? vi.fn(),
  }
}

beforeEach(async () => {
  vi.resetModules()
  vi.clearAllMocks()
  mockResolveConsoleWorkspaceContextSync.mockReset()
  globalThis.Worker = MockWorker as unknown as typeof Worker
  commands = await import('./consoleReferenceContentCommands')
})

describe('consoleReferenceContentCommands', () => {
  it('formats delete-latest confirm prompt sessions from a return session', () => {
    const { createDeleteLatestTransformConfirmPromptSession } = commands
    const promptSession = createDeleteLatestTransformConfirmPromptSession(
      { kind: 'reference', referenceId: 'reference-1' },
      {
        scopeId: 'referenceTransformRoot',
        breadcrumb: ['Select', 'Reference', 'Viewer Transform'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
          referenceId: 'reference-1',
        },
        validChoices: [],
      } as any,
    )

    expect(promptSession).toEqual({
      kind: 'transform.delete-latest.confirm',
      breadcrumb: ['Select', 'Reference', 'Viewer Transform', 'DeleteLatest'],
      label: 'Are you sure?',
      prefill: 'yes',
      returnSession: {
        scopeId: 'referenceTransformRoot',
        breadcrumb: ['Select', 'Reference', 'Viewer Transform'],
        selections: {
          graphDocumentId: null,
          selectedNodeId: null,
          sketchNodeId: null,
          referenceId: 'reference-1',
        },
        validChoices: [],
      },
      target: { kind: 'reference', referenceId: 'reference-1' },
    })
  })

  it('maps reference snap scopes to mode and axis helpers', () => {
    const {
      getReferenceTransformSnapScopeAxis,
      getReferenceTransformSnapScopeMode,
      isReferenceTransformSnapScope,
    } = commands

    expect(getReferenceTransformSnapScopeMode('referenceTransformMoveSnapRoot')).toBe(
      'translate',
    )
    expect(getReferenceTransformSnapScopeMode('referenceTransformRotateSnapXRoot')).toBe(
      'rotate',
    )
    expect(getReferenceTransformSnapScopeMode('referenceTransformScaleSnapZRoot')).toBe(
      'scale',
    )

    expect(getReferenceTransformSnapScopeAxis('referenceTransformMoveSnapYRoot')).toBe('y')
    expect(getReferenceTransformSnapScopeAxis('referenceTransformRotateSnapZRoot')).toBe(
      'z',
    )
    expect(getReferenceTransformSnapScopeAxis('referenceTransformSnapRoot')).toBeNull()

    expect(isReferenceTransformSnapScope('referenceTransformSnapRoot')).toBe(true)
    expect(isReferenceTransformSnapScope('referenceTransformScaleSnapXRoot')).toBe(true)
    expect(isReferenceTransformSnapScope('referenceTransformRoot')).toBe(false)
  })

  it('formats snap labels consistently', () => {
    const { formatReferenceTransformSnapValue, getReferenceTransformSnapAxisLabel } = commands

    expect(formatReferenceTransformSnapValue(4)).toBe('4')
    expect(formatReferenceTransformSnapValue(1.25)).toBe('1.25')
    expect(getReferenceTransformSnapAxisLabel('x')).toBe('X')
    expect(getReferenceTransformSnapAxisLabel('z')).toBe('Z')
  })

  it('handles delete-latest confirm yes by restoring the reference transform root', () => {
    const returnSession = makeSession({
      scopeId: 'referenceTransformRoot',
      breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
      selections: { referenceId: 'reference-1' },
    })
    const nextTransformRootSession = makeSession({
      scopeId: 'referenceTransformRoot',
      breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
      selections: { referenceId: 'reference-1' },
    })
    const deps = makePromptDeps({
      createActiveReferenceTransformRootSession: vi.fn(() => nextTransformRootSession),
      deleteLatestReferenceTransformEntry: vi.fn(() => ({ entryId: 'entry-1' })),
    })

    const handled = commands.tryHandleReferenceContentPromptSubmission({
      activePromptSession: commands.createDeleteLatestTransformConfirmPromptSession(
        { kind: 'reference', referenceId: 'reference-1' },
        returnSession,
      ) as any,
      appendConsoleEntry: deps.appendConsoleEntry,
      applyReferenceTransformSpaceShortcut: deps.applyReferenceTransformSpaceShortcut,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      clearConsolePromptSession: deps.clearConsolePromptSession,
      commitActiveReferenceTransformFromConsole:
        deps.commitActiveReferenceTransformFromConsole,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getConsolePromptSession: deps.getConsolePromptSession,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: 'yes',
      pushCommandHistory: deps.pushCommandHistory,
      setInputText: deps.setInputText,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      transitionReferenceTransformAxisPrompt:
        deps.transitionReferenceTransformAxisPrompt,
    })

    expect(handled).toBe(true)
    expect(deps.deleteLatestReferenceTransformEntry).toHaveBeenCalledWith('reference-1')
    expect(deps.clearConsolePromptSession).toHaveBeenCalledOnce()
    expect(deps.setStagedNavigationSession).toHaveBeenCalledWith(nextTransformRootSession)
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Deleted latest transform entry',
      }),
    )
  })

  it('handles delete-latest cancel by restoring the return session', () => {
    const returnSession = makeSession({
      scopeId: 'referenceTransformRoot',
      breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
      selections: { referenceId: 'reference-1' },
    })
    const deps = makePromptDeps()

    const handled = commands.tryHandleReferenceContentPromptSubmission({
      activePromptSession: commands.createDeleteLatestTransformConfirmPromptSession(
        { kind: 'reference', referenceId: 'reference-1' },
        returnSession,
      ) as any,
      appendConsoleEntry: deps.appendConsoleEntry,
      applyReferenceTransformSpaceShortcut: deps.applyReferenceTransformSpaceShortcut,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      clearConsolePromptSession: deps.clearConsolePromptSession,
      commitActiveReferenceTransformFromConsole:
        deps.commitActiveReferenceTransformFromConsole,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getConsolePromptSession: deps.getConsolePromptSession,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: 'n',
      pushCommandHistory: deps.pushCommandHistory,
      setInputText: deps.setInputText,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      transitionReferenceTransformAxisPrompt:
        deps.transitionReferenceTransformAxisPrompt,
    })

    expect(handled).toBe(true)
    expect(deps.clearConsolePromptSession).toHaveBeenCalledOnce()
    expect(deps.setStagedNavigationSession).toHaveBeenCalledWith(returnSession)
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Delete latest cancelled',
      }),
    )
  })

  it('rejects empty content-owner rename input and preserves the prompt', () => {
    const returnSession = makeSession({
      scopeId: 'contentOwnerRoot',
      breadcrumb: ['Root', 'Content', 'Component'],
      selections: { contentComponentId: 'component-1' },
    })
    const deps = makePromptDeps()

    const handled = commands.tryHandleReferenceContentPromptSubmission({
      activePromptSession: {
        kind: 'content.owner.label',
        breadcrumb: ['Root', 'Content', 'Rename'],
        label: 'Component Name',
        prefill: 'Component 1',
        returnSession,
        target: { kind: 'component', componentId: 'component-1' },
      } as any,
      appendConsoleEntry: deps.appendConsoleEntry,
      applyReferenceTransformSpaceShortcut: deps.applyReferenceTransformSpaceShortcut,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      clearConsolePromptSession: deps.clearConsolePromptSession,
      commitActiveReferenceTransformFromConsole:
        deps.commitActiveReferenceTransformFromConsole,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getConsolePromptSession: deps.getConsolePromptSession,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: '   ',
      pushCommandHistory: deps.pushCommandHistory,
      setInputText: deps.setInputText,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      transitionReferenceTransformAxisPrompt:
        deps.transitionReferenceTransformAxisPrompt,
    })

    expect(handled).toBe(true)
    expect(deps.appState.renameProjectContentOwner).not.toHaveBeenCalled()
    expect(deps.setInputText).toHaveBeenCalledWith('')
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Diagnostics',
        text: 'Name cannot be empty',
      }),
    )
  })

  it('renames a content owner and returns to the saved session', () => {
    const returnSession = makeSession({
      scopeId: 'contentOwnerRoot',
      breadcrumb: ['Root', 'Content', 'Component'],
      selections: { contentComponentId: 'component-1' },
    })
    const deps = makePromptDeps({
      appState: {
        renameProjectContentOwner: vi.fn(() => true),
        requestConsoleContextSync: vi.fn(),
        referenceWorkspace: {},
      },
    })

    const handled = commands.tryHandleReferenceContentPromptSubmission({
      activePromptSession: {
        kind: 'content.owner.label',
        breadcrumb: ['Root', 'Content', 'Rename'],
        label: 'Component Name',
        prefill: 'Component 1',
        returnSession,
        target: { kind: 'component', componentId: 'component-1' },
      } as any,
      appendConsoleEntry: deps.appendConsoleEntry,
      applyReferenceTransformSpaceShortcut: deps.applyReferenceTransformSpaceShortcut,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      clearConsolePromptSession: deps.clearConsolePromptSession,
      commitActiveReferenceTransformFromConsole:
        deps.commitActiveReferenceTransformFromConsole,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getConsolePromptSession: deps.getConsolePromptSession,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: 'Wheel Mount',
      pushCommandHistory: deps.pushCommandHistory,
      setInputText: deps.setInputText,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      transitionReferenceTransformAxisPrompt:
        deps.transitionReferenceTransformAxisPrompt,
    })

    expect(handled).toBe(true)
    expect(deps.appState.renameProjectContentOwner).toHaveBeenCalledWith(
      { kind: 'component', componentId: 'component-1' },
      'Wheel Mount',
    )
    expect(deps.appState.requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
    expect(deps.clearConsolePromptSession).toHaveBeenCalledOnce()
    expect(deps.setStagedNavigationSession).toHaveBeenCalledWith(returnSession)
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Browser',
        text: 'Renamed to Wheel Mount',
      }),
    )
  })

  it('opens a content-owner prompt after creating a new assembly', () => {
    const returnSession = makeSession({
      scopeId: 'contentOwnerRoot',
      breadcrumb: ['Root', 'Content', 'Assembly 1'],
      selections: { contentAssemblyId: 'assembly-1' },
    })
    mockResolveConsoleWorkspaceContextSync.mockReturnValue({ session: returnSession })
    const { entries, appendConsoleEntry } = makeEntryRecorder()
    const requestRadioBurst = vi.fn()
    const setConsolePromptSession = vi.fn()
    const setStagedNavigationSession = vi.fn()
    const appState = {
      createProjectAssembly: vi.fn(() => 'assembly-1'),
      requestConsoleContextSync: vi.fn(),
      projectContent: {
        assembliesById: {
          'assembly-1': { label: 'Assembly 1' },
        },
      },
    }

    const handled = commands.tryHandleContentOwnerPromptAction({
      appendConsoleEntry,
      buildStagedNavigationContextFromStoreState: vi.fn(() => ({}) as any),
      commandIdentity: 'cmd-test',
      getAppState: () => appState as any,
      getSpaghettiState: () => ({}) as any,
      requestRadioBurst,
      setConsolePromptSession,
      setStagedNavigationSession,
      stagedResult: {
        actionId: 'content.newAssembly',
        breadcrumb: ['Root', 'Content', 'New Assembly'],
        session: makeSession(),
        selections: {},
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.createProjectAssembly).toHaveBeenCalledOnce()
    expect(setStagedNavigationSession).toHaveBeenCalledWith(returnSession)
    expect(setConsolePromptSession).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'content.owner.label',
        target: { kind: 'assembly', assemblyId: 'assembly-1' },
      }),
    )
    expect(requestRadioBurst).toHaveBeenCalledWith('cmd-test', 'enter')
    expect(entries.at(-1)).toEqual(
      expect.objectContaining({
        layer: 'Commands',
        source: 'console',
        severity: 'info',
      }),
    )
  })

  it('opens a content-owner prompt after creating a new component', () => {
    const returnSession = makeSession({
      scopeId: 'contentOwnerRoot',
      breadcrumb: ['Root', 'Content', 'Assembly 1', 'Component 1'],
      selections: { contentComponentId: 'component-1' },
    })
    mockResolveConsoleWorkspaceContextSync.mockReturnValue({ session: returnSession })
    const requestRadioBurst = vi.fn()
    const setConsolePromptSession = vi.fn()
    const setStagedNavigationSession = vi.fn()
    const appState = {
      createProjectComponent: vi.fn(() => 'component-1'),
      requestConsoleContextSync: vi.fn(),
      projectContent: {
        componentsById: {
          'component-1': { label: 'Component 1' },
        },
      },
    }

    const handled = commands.tryHandleContentOwnerPromptAction({
      appendConsoleEntry: vi.fn(),
      buildStagedNavigationContextFromStoreState: vi.fn(() => ({}) as any),
      commandIdentity: 'cmd-test',
      getAppState: () => appState as any,
      getSpaghettiState: () => ({}) as any,
      requestRadioBurst,
      setConsolePromptSession,
      setStagedNavigationSession,
      stagedResult: {
        actionId: 'content.newComponent',
        breadcrumb: ['Root', 'Content', 'Assembly 1', 'New Component'],
        session: makeSession(),
        selections: { contentAssemblyId: 'assembly-1' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.createProjectComponent).toHaveBeenCalledWith('assembly-1')
    expect(setStagedNavigationSession).toHaveBeenCalledWith(returnSession)
    expect(setConsolePromptSession).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'content.owner.label',
        target: { kind: 'component', componentId: 'component-1' },
      }),
    )
    expect(requestRadioBurst).toHaveBeenCalledWith('cmd-test', 'enter')
  })

  it('opens a rename prompt for an existing content owner', () => {
    const requestRadioBurst = vi.fn()
    const setConsolePromptSession = vi.fn()
    const setStagedNavigationSession = vi.fn()
    const stagedSession = makeSession({
      scopeId: 'contentOwnerRoot',
      breadcrumb: ['Root', 'Content', 'Assembly 1'],
      selections: { contentAssemblyId: 'assembly-1' },
    })
    const appState = {
      projectContent: {
        assembliesById: {
          'assembly-1': { label: 'Assembly 1' },
        },
      },
    }

    const handled = commands.tryHandleContentOwnerPromptAction({
      appendConsoleEntry: vi.fn(),
      buildStagedNavigationContextFromStoreState: vi.fn(() => ({}) as any),
      commandIdentity: 'cmd-test',
      getAppState: () => appState as any,
      getSpaghettiState: () => ({}) as any,
      requestRadioBurst,
      setConsolePromptSession,
      setStagedNavigationSession,
      stagedResult: {
        actionId: 'content.rename',
        breadcrumb: ['Root', 'Content', 'Assembly 1', 'Rename'],
        session: stagedSession,
        selections: { contentAssemblyId: 'assembly-1' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(setStagedNavigationSession).not.toHaveBeenCalled()
    expect(setConsolePromptSession).toHaveBeenCalledWith(
      expect.objectContaining({
        kind: 'content.owner.label',
        target: { kind: 'assembly', assemblyId: 'assembly-1' },
      }),
    )
    expect(requestRadioBurst).toHaveBeenCalledWith('cmd-test', 'enter')
  })

  it('handles reference transform space changes through the extracted execute helper', () => {
    const appState = {
      referenceWorkspace: {
        activeReferenceTransformSession: {
          referenceId: 'reference-1',
          space: 'local',
        },
      },
      setActiveReferenceTransformSpace: vi.fn(),
    }
    const nextTransformRootSession = makeSession({
      scopeId: 'referenceTransformRoot',
      breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
      selections: { referenceId: 'reference-1' },
    })
    const deps = makeExecuteDeps({
      appState,
      createActiveReferenceTransformRootSession: vi.fn(() => nextTransformRootSession),
      activeReferenceSession: appState.referenceWorkspace.activeReferenceTransformSession,
    })

    const handled = commands.tryHandleReferenceContentExecuteAction({
      activeReferenceSession: deps.activeReferenceSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      commandIdentity: deps.commandIdentity,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveContentObjectTransformSnapSession:
        deps.createActiveContentObjectTransformSnapSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      createDeleteLatestTransformConfirmPromptSession:
        deps.createDeleteLatestTransformConfirmPromptSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: deps.inputText,
      requestRadioBurst: deps.requestRadioBurst,
      setConsolePromptSession: deps.setConsolePromptSession,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      stagedResult: {
        actionId: 'reference.transform.space.world',
        breadcrumb: ['Root', 'Reference', 'Viewer Transform', 'Space', 'World'],
        session: makeSession({
          scopeId: 'referenceTransformSpaceRoot',
          selections: { referenceId: 'reference-1' },
        }),
        selections: { referenceId: 'reference-1' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.setActiveReferenceTransformSpace).toHaveBeenCalledWith('world')
    expect(deps.setStagedNavigationSession).toHaveBeenLastCalledWith(nextTransformRootSession)
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Space: World applied',
      }),
    )
    expect(deps.requestRadioBurst).toHaveBeenCalledWith('cmd-test', 'enter')
  })

  it('handles reference snap actions through the extracted execute helper', () => {
    const appState = {
      referenceWorkspace: {
        activeReferenceTransformSession: {
          referenceId: 'reference-1',
          space: 'local',
          entryActive: false,
        },
        transformSnapByReferenceId: {} as Record<string, any>,
      },
      setReferenceTransformSnapEnabled: vi.fn(
        (referenceId: string, _mode: string, enabled: boolean) => {
          appState.referenceWorkspace.transformSnapByReferenceId[referenceId] = {
            translate: {
              enabled,
              locked: false,
              values: { x: 1, y: 1, z: 1 },
            },
            rotate: {
              enabled: false,
              locked: false,
              values: { x: 15, y: 15, z: 15 },
            },
            scale: {
              enabled: false,
              locked: false,
              values: { x: 1, y: 1, z: 1 },
            },
          }
        },
      ),
    }
    const nextTransformRootSession = makeSession({
      scopeId: 'referenceTransformRoot',
      breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
      selections: { referenceId: 'reference-1' },
    })
    const deps = makeExecuteDeps({
      appState,
      inputText: 'on',
      activeReferenceSession: appState.referenceWorkspace.activeReferenceTransformSession,
      createActiveReferenceTransformRootSession: vi.fn(() => nextTransformRootSession),
    })

    const handled = commands.tryHandleReferenceContentExecuteAction({
      activeReferenceSession: deps.activeReferenceSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      commandIdentity: deps.commandIdentity,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveContentObjectTransformSnapSession:
        deps.createActiveContentObjectTransformSnapSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      createDeleteLatestTransformConfirmPromptSession:
        deps.createDeleteLatestTransformConfirmPromptSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: deps.inputText,
      requestRadioBurst: deps.requestRadioBurst,
      setConsolePromptSession: deps.setConsolePromptSession,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      stagedResult: {
        actionId: 'reference.transform.snap.translate.on',
        breadcrumb: ['Root', 'Reference', 'Viewer Transform', 'Snap', 'Move', 'On'],
        session: makeSession({
          scopeId: 'referenceTransformSnapRoot',
          selections: { referenceId: 'reference-1' },
        }),
        selections: { referenceId: 'reference-1' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.setReferenceTransformSnapEnabled).toHaveBeenCalledWith(
      'reference-1',
      'translate',
      true,
    )
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Move snap: On',
      }),
    )
    expect(deps.requestRadioBurst).toHaveBeenCalledWith('cmd-test', 'enter')
  })

  it('handles content transform space changes through the extracted execute helper', () => {
    const appState = {
      referenceWorkspace: {
        activeContentObjectTransformSession: {
          objectId: 'object-1',
          space: 'world',
        },
      },
      setActiveContentObjectTransformSpace: vi.fn(),
    }
    const nextTransformRootSession = makeSession({
      scopeId: 'contentObjectTransformRoot',
      breadcrumb: ['Root', 'Content', 'Viewer Transform'],
      selections: { contentObjectId: 'object-1' },
    })
    const deps = makeExecuteDeps({
      appState,
      createActiveContentObjectTransformRootSession: vi.fn(() => nextTransformRootSession),
    })

    const handled = commands.tryHandleReferenceContentExecuteAction({
      activeReferenceSession: deps.activeReferenceSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      commandIdentity: deps.commandIdentity,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveContentObjectTransformSnapSession:
        deps.createActiveContentObjectTransformSnapSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      createDeleteLatestTransformConfirmPromptSession:
        deps.createDeleteLatestTransformConfirmPromptSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: deps.inputText,
      requestRadioBurst: deps.requestRadioBurst,
      setConsolePromptSession: deps.setConsolePromptSession,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      stagedResult: {
        actionId: 'content.transform.space.local',
        breadcrumb: ['Root', 'Content', 'Viewer Transform', 'Space', 'Local'],
        session: makeSession({
          scopeId: 'contentTransformSpaceRoot',
          selections: { contentObjectId: 'object-1' },
        }),
        selections: { contentObjectId: 'object-1' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.setActiveContentObjectTransformSpace).toHaveBeenCalledWith('local')
    expect(deps.setStagedNavigationSession).toHaveBeenLastCalledWith(nextTransformRootSession)
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Space: Local applied',
      }),
    )
    expect(deps.requestRadioBurst).toHaveBeenCalledWith('cmd-test', 'enter')
  })

  it('handles content transform move arming through the extracted execute helper', () => {
    const viewer = {
      activateRotateCenterHandle: vi.fn(),
      activateScaleCenterHandle: vi.fn(),
      activateTranslateCenterHandle: vi.fn(),
      setContentObjectTransformSession: vi.fn(),
      setSelectedPart: vi.fn(),
    }
    const appState = {
      referenceWorkspace: {
        activeContentObjectTransformSession: null as any,
      },
      workspaceSelection: {
        selectedTarget: { kind: 'object', objectId: 'object-1' },
      },
      projectContent: {
        assembliesById: {
          'assembly-1': {
            assemblyId: 'assembly-1',
            label: 'Assembly 1',
            parentAssemblyId: null,
            assemblySourceKind: 'authored',
            childRowIds: ['component-1'],
          },
        },
        componentsById: {
          'component-1': {
            componentId: 'component-1',
            label: 'Component 1',
            parentAssemblyId: 'assembly-1',
            sourceGraphDocumentId: 'graph-1',
            componentSourceKind: 'authored',
            childObjectIds: ['object-1'],
          },
        },
        objectsById: {
          'object-1': {
            objectId: 'object-1',
            label: 'Wheel',
            objectSourceKind: 'published-object',
            slotId: 'slot-1',
            ownerGraphDocumentId: 'graph-1',
            sourceGraphDocumentId: 'graph-1',
            parentComponentId: 'component-1',
            parentAssemblyId: 'assembly-1',
          },
        },
      },
      selectedPartKey: 'graph-1:slot-1',
      beginContentObjectTransformShell: vi.fn(() => {
        appState.referenceWorkspace.activeContentObjectTransformSession = {
          objectId: 'object-1',
          entryActive: false,
          mode: 'translate',
          space: 'local',
          entryOrigin: null,
        }
      }),
      beginContentObjectTransformEntry: vi.fn((mode: string) => {
        appState.referenceWorkspace.activeContentObjectTransformSession = {
          objectId: 'object-1',
          entryActive: true,
          mode,
          space: 'local',
          entryOrigin: null,
        }
      }),
      selectPart: vi.fn((partKey: string) => {
        appState.selectedPartKey = partKey
      }),
    }
    const stagedSession = makeSession({
      scopeId: 'contentTransformRoot',
      breadcrumb: ['Root', 'Content', 'Viewer Transform'],
      selections: { contentObjectId: 'object-1' },
      validChoices: [{ label: 'Move' }],
    })
    const deps = makeExecuteDeps({
      appState,
      getViewer: vi.fn(() => viewer),
      stagedNavigationSession: null,
    })

    const handled = commands.tryHandleReferenceContentExecuteAction({
      activeReferenceSession: deps.activeReferenceSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      commandIdentity: deps.commandIdentity,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveContentObjectTransformSnapSession:
        deps.createActiveContentObjectTransformSnapSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      createDeleteLatestTransformConfirmPromptSession:
        deps.createDeleteLatestTransformConfirmPromptSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: 'move',
      requestRadioBurst: deps.requestRadioBurst,
      setConsolePromptSession: deps.setConsolePromptSession,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      stagedResult: {
        actionId: 'content.transform.move',
        breadcrumb: ['Root', 'Content', 'Viewer Transform', 'Move'],
        session: stagedSession,
        selections: { contentObjectId: 'object-1' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.beginContentObjectTransformShell).toHaveBeenCalledWith('object-1')
    expect(appState.beginContentObjectTransformEntry).toHaveBeenCalledWith('translate')
    expect(appState.selectPart).toHaveBeenCalledWith('graph-1:slot-1')
    expect(viewer.setSelectedPart).toHaveBeenCalledWith('graph-1:slot-1')
    expect(viewer.activateTranslateCenterHandle).toHaveBeenCalledOnce()
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Move armed',
      }),
    )
    expect(deps.entries.at(-1)).toEqual(
      expect.objectContaining({
        layer: 'Commands',
        source: 'console',
        severity: 'info',
      }),
    )
    expect(deps.requestRadioBurst).toHaveBeenCalledWith('cmd-test', 'enter')
  })

  it('arms environment light move through the extracted execute helper', async () => {
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')
    useUiPrefsStore.setState((state) => ({
      ...state,
      view: {
        ...state.view,
        lighting: {
          ...state.view.lighting,
          lights: [
            {
              id: 'light-key',
              name: 'Key',
              type: 'point',
              enabled: true,
              color: '#ffffff',
              intensity: 1,
              position: { x: 0, y: 10, z: 0 },
            },
          ],
        },
      },
    }))

    const viewer = {
      activateTranslateCenterHandle: vi.fn(),
      setViewerTransformSession: vi.fn(),
    }
    const appState = {
      referenceWorkspace: {
        activeEnvironmentLightTransformSession: null as any,
      },
      workspaceSelection: {
        selectedTarget: { kind: 'environment-light', lightId: 'light-key' },
      },
      beginViewerTransformShell: vi.fn((target: { lightId: string }) => {
        appState.referenceWorkspace.activeEnvironmentLightTransformSession = {
          lightId: target.lightId,
          entryActive: false,
          mode: 'translate',
          space: 'world',
          entryOrigin: null,
          draftTransform: null,
        }
      }),
      beginActiveViewerTransformEntry: vi.fn((mode: string) => {
        appState.referenceWorkspace.activeEnvironmentLightTransformSession = {
          lightId: 'light-key',
          entryActive: true,
          mode,
          space: 'world',
          entryOrigin: null,
          draftTransform: null,
        }
      }),
    }
    const deps = makeExecuteDeps({
      appState,
      getViewer: vi.fn(() => viewer),
    })
    const stagedSession = makeSession({
      scopeId: 'contentObjectTransformRoot',
      breadcrumb: ['Select', 'Content', 'Environment', 'Key', 'Viewer Transform'],
      selections: { environmentLightId: 'light-key' },
      validChoices: [{ label: 'Move' }],
    })

    const handled = commands.tryHandleReferenceContentExecuteAction({
      activeReferenceSession: deps.activeReferenceSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      commandIdentity: deps.commandIdentity,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveContentObjectTransformSnapSession:
        deps.createActiveContentObjectTransformSnapSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      createDeleteLatestTransformConfirmPromptSession:
        deps.createDeleteLatestTransformConfirmPromptSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: 'move',
      requestRadioBurst: deps.requestRadioBurst,
      setConsolePromptSession: deps.setConsolePromptSession,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      stagedResult: {
        actionId: 'content.transform.move',
        breadcrumb: ['Select', 'Content', 'Environment', 'Key', 'Viewer Transform', 'Move'],
        session: stagedSession,
        selections: { environmentLightId: 'light-key' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.beginViewerTransformShell).toHaveBeenCalledWith({
      kind: 'environment-light',
      lightId: 'light-key',
    })
    expect(appState.beginActiveViewerTransformEntry).toHaveBeenCalledWith('translate')
    expect(appState.referenceWorkspace.activeEnvironmentLightTransformSession).toMatchObject({
      lightId: 'light-key',
      entryActive: true,
      mode: 'translate',
    })
    expect(viewer.setViewerTransformSession).toHaveBeenCalledWith(
      expect.objectContaining({
        targetKind: 'environment-light',
        targetId: 'light-key',
        mode: 'translate',
      }),
    )
    expect(viewer.activateTranslateCenterHandle).toHaveBeenCalledOnce()
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Move armed',
      }),
    )
  })

  it('warns when moving a non-positional environment light', async () => {
    const { useUiPrefsStore } = await import('../store/uiPrefsStore')
    useUiPrefsStore.setState((state) => ({
      ...state,
      view: {
        ...state.view,
        lighting: {
          ...state.view.lighting,
          lights: [
            {
              id: 'light-fill',
              name: 'Fill',
              type: 'hemisphere',
              enabled: true,
              color: '#ffffff',
              intensity: 1,
            },
          ],
        },
      },
    }))

    const appState = {
      referenceWorkspace: {
        activeEnvironmentLightTransformSession: null as any,
      },
      workspaceSelection: {
        selectedTarget: { kind: 'environment-light', lightId: 'light-fill' },
      },
      beginViewerTransformShell: vi.fn(),
      beginActiveViewerTransformEntry: vi.fn(),
    }
    const deps = makeExecuteDeps({ appState })

    const handled = commands.tryHandleReferenceContentExecuteAction({
      activeReferenceSession: deps.activeReferenceSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      buildFeatureAssistPromptText: deps.buildFeatureAssistPromptText,
      commandIdentity: deps.commandIdentity,
      createActiveContentObjectTransformRootSession:
        deps.createActiveContentObjectTransformRootSession,
      createActiveContentObjectTransformSnapSession:
        deps.createActiveContentObjectTransformSnapSession,
      createActiveReferenceTransformRootSession:
        deps.createActiveReferenceTransformRootSession,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      createDeleteLatestTransformConfirmPromptSession:
        deps.createDeleteLatestTransformConfirmPromptSession,
      deleteLatestContentObjectTransformEntry:
        deps.deleteLatestContentObjectTransformEntry,
      deleteLatestReferenceTransformEntry:
        deps.deleteLatestReferenceTransformEntry,
      getActiveFeatureAssistDescriptor: deps.getActiveFeatureAssistDescriptor,
      getAppState: deps.getAppState,
      getSpaghettiState: deps.getSpaghettiState,
      getStagedNavigationSession: deps.getStagedNavigationSession,
      getViewer: deps.getViewer,
      inputText: 'move',
      requestRadioBurst: deps.requestRadioBurst,
      setConsolePromptSession: deps.setConsolePromptSession,
      setStagedNavigationSession: deps.setStagedNavigationSession,
      stagedResult: {
        actionId: 'content.transform.move',
        breadcrumb: ['Select', 'Content', 'Environment', 'Fill', 'Viewer Transform', 'Move'],
        session: makeSession({
          scopeId: 'contentObjectTransformRoot',
          selections: { environmentLightId: 'light-fill' },
        }),
        selections: { environmentLightId: 'light-fill' },
      } as any,
    })

    expect(handled).toBe(true)
    expect(appState.beginViewerTransformShell).not.toHaveBeenCalled()
    expect(appState.beginActiveViewerTransformEntry).not.toHaveBeenCalled()
    expect(deps.entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Viewer Transform is only available for positional environment lights',
        severity: 'warn',
      }),
    )
  })

  it('handles the reference-transform root delete shortcut through the extracted helper', () => {
    const { entries, appendConsoleEntry } = makeEntryRecorder()
    const pushCommandHistory = vi.fn()
    const requestRadioBurst = vi.fn()
    const setStagedNavigationSession = vi.fn()
    const nextTransformRootSession = makeSession({
      scopeId: 'referenceTransformRoot',
      breadcrumb: ['Root', 'Reference', 'Viewer Transform'],
      selections: { referenceId: 'reference-1' },
    })

    const handled = commands.tryHandleReferenceTransformRootShortcut({
      activeReferenceId: 'reference-1',
      appendConsoleEntry,
      createActiveReferenceTransformRootSession: vi.fn(() => nextTransformRootSession),
      deleteLatestReferenceTransformEntry: vi.fn(() => ({ entryId: 'entry-1' } as any)),
      inputText: 'del',
      pushCommandHistory,
      requestRadioBurst,
      scopedCommandIdentity: 'root-delete',
      stagedSession: makeSession({
        scopeId: 'referenceTransformRoot',
        selections: { referenceId: 'reference-1' },
      }),
      setStagedNavigationSession,
    })

    expect(handled).toBe(true)
    expect(pushCommandHistory).toHaveBeenCalledWith('del')
    expect(requestRadioBurst).toHaveBeenCalledWith('root-delete', 'enter')
    expect(setStagedNavigationSession).toHaveBeenCalledWith(nextTransformRootSession)
    expect(entries).toContainEqual(
      expect.objectContaining({
        layer: 'Transforms',
        text: 'Deleted latest transform entry',
      }),
    )
  })

  it('opens the snap session from the active reference-transform submission helper', () => {
    const snapChoice = { canonicalToken: 'SNAP', aliases: [], label: 'Snap' }
    const snapSession = makeSession({
      scopeId: 'referenceTransformSnapRoot',
      breadcrumb: ['Root', 'Reference', 'Viewer Transform', 'Snap'],
      selections: { referenceId: 'reference-1' },
      validChoices: [{ label: 'On' }],
    })
    const deps = makeActiveReferenceSubmitDeps({
      inputText: 'snap',
      appState: {
        referenceWorkspace: {
          activeReferenceTransformSession: {
            referenceId: 'reference-1',
            entryActive: true,
            mode: 'translate',
            space: 'local',
            draftTransform: makeReferenceTransformOverride(),
          },
          transformSnapByReferenceId: {
            'reference-1': {
              translate: {
                enabled: true,
                locked: false,
                values: { x: 4, y: 4, z: 4 },
              },
            },
          },
        },
        setActiveReferenceTransformHandle: vi.fn(),
        setActiveReferenceTransformDraft: vi.fn(),
      },
      featureAssistDescriptor: {
        label: 'Move',
        choices: [snapChoice],
        prefill: 'snap',
      },
      featureAssistChoiceMatcher: vi.fn(() => snapChoice),
      createActiveReferenceTransformSnapSession: vi.fn(() => snapSession),
    })

    const handled = commands.tryHandleActiveReferenceTransformSubmission({
      activeStagedSession: deps.activeStagedSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      applyReferenceTransformSpaceShortcut: deps.applyReferenceTransformSpaceShortcut,
      cancelActiveReferenceTransformSession: deps.cancelActiveReferenceTransformSession,
      commitActiveReferenceTransformFromConsole:
        deps.commitActiveReferenceTransformFromConsole,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      dispatchImmediateShortcut: deps.dispatchImmediateShortcut,
      featureAssistChoiceMatcher: deps.featureAssistChoiceMatcher,
      featureAssistDescriptor: deps.featureAssistDescriptor,
      getAppState: deps.getAppState,
      getConsolePromptSession: deps.getConsolePromptSession,
      getViewer: deps.getViewer,
      inputText: deps.inputText,
      openReferenceTransformAxisPrompt: deps.openReferenceTransformAxisPrompt,
      openReferenceTransformPlanePrompt: deps.openReferenceTransformPlanePrompt,
      pushCommandHistory: deps.pushCommandHistory,
      requestRadioBurst: deps.requestRadioBurst,
      resolveFeatureAssistSubmitIdentity: deps.resolveFeatureAssistSubmitIdentity,
      setInputText: deps.setInputText,
      setStagedNavigationSession: deps.setStagedNavigationSession,
    })

    expect(handled).toBe(true)
    expect(deps.createActiveReferenceTransformSnapSession).toHaveBeenCalledWith(
      'reference-1',
      'translate',
    )
    expect(deps.setStagedNavigationSession).toHaveBeenCalledWith(snapSession)
    expect(deps.setInputText).toHaveBeenCalledWith('4', {
      preserveGuidedReplace: true,
    })
    expect(deps.requestRadioBurst).toHaveBeenCalledWith('assist-id', 'enter')
  })

  it('commits vec3 literals through the active reference-transform submission helper', () => {
    const viewer = {
      cancelReferenceTransformDrag: vi.fn(),
      clearReferenceTransformHandle: vi.fn(),
      setReferenceTransformOverride: vi.fn(),
    }
    const appState = {
      referenceWorkspace: {
        activeReferenceTransformSession: {
          referenceId: 'reference-1',
          entryActive: true,
          mode: 'translate',
          space: 'local',
          draftTransform: makeReferenceTransformOverride(),
        },
        transformSnapByReferenceId: {},
      },
      setActiveReferenceTransformHandle: vi.fn(),
      setActiveReferenceTransformDraft: vi.fn(),
    }
    const deps = makeActiveReferenceSubmitDeps({
      appState,
      inputText: '1, 2, 3',
      getViewer: vi.fn(() => viewer),
    })

    const handled = commands.tryHandleActiveReferenceTransformSubmission({
      activeStagedSession: deps.activeStagedSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      applyReferenceTransformSpaceShortcut: deps.applyReferenceTransformSpaceShortcut,
      cancelActiveReferenceTransformSession: deps.cancelActiveReferenceTransformSession,
      commitActiveReferenceTransformFromConsole:
        deps.commitActiveReferenceTransformFromConsole,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      dispatchImmediateShortcut: deps.dispatchImmediateShortcut,
      featureAssistChoiceMatcher: deps.featureAssistChoiceMatcher,
      featureAssistDescriptor: deps.featureAssistDescriptor,
      getAppState: deps.getAppState,
      getConsolePromptSession: deps.getConsolePromptSession,
      getViewer: deps.getViewer,
      inputText: deps.inputText,
      openReferenceTransformAxisPrompt: deps.openReferenceTransformAxisPrompt,
      openReferenceTransformPlanePrompt: deps.openReferenceTransformPlanePrompt,
      pushCommandHistory: deps.pushCommandHistory,
      requestRadioBurst: deps.requestRadioBurst,
      resolveFeatureAssistSubmitIdentity: deps.resolveFeatureAssistSubmitIdentity,
      setInputText: deps.setInputText,
      setStagedNavigationSession: deps.setStagedNavigationSession,
    })

    expect(handled).toBe(true)
    expect(viewer.cancelReferenceTransformDrag).toHaveBeenCalledOnce()
    expect(appState.setActiveReferenceTransformHandle).toHaveBeenCalledWith(null)
    expect(appState.setActiveReferenceTransformDraft).toHaveBeenCalledWith({
      position: { x: 1, y: 2, z: 3 },
      rotationDeg: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    expect(viewer.setReferenceTransformOverride).toHaveBeenCalledWith(
      'reference-1',
      expect.objectContaining({
        position: { x: 1, y: 2, z: 3 },
      }),
    )
    expect(deps.commitActiveReferenceTransformFromConsole).toHaveBeenCalledWith('1, 2, 3')
  })

  it('opens the axis prompt from the active reference-transform submission helper', () => {
    const axisChoice = { canonicalToken: 'X', aliases: [], label: 'X' }
    let promptSession: any = null
    const deps = makeActiveReferenceSubmitDeps({
      inputText: 'x',
      featureAssistDescriptor: {
        label: 'Move',
        choices: [axisChoice],
        prefill: 'x',
      },
      featureAssistChoiceMatcher: vi.fn(() => axisChoice),
      openReferenceTransformAxisPrompt: vi.fn(() => {
        promptSession = {
          kind: 'reference-transform.axis',
          breadcrumb: ['Root', 'Reference', 'Viewer Transform', 'Move', 'X'],
          label: 'Move X',
          prefill: '0',
          returnSession: makeSession({
            scopeId: 'referenceTransformRoot',
            selections: { referenceId: 'reference-1' },
          }),
          mode: 'translate',
          axis: 'x',
        }
      }),
      getConsolePromptSession: vi.fn(() => promptSession),
    })

    const handled = commands.tryHandleActiveReferenceTransformSubmission({
      activeStagedSession: deps.activeStagedSession,
      appendConsoleEntry: deps.appendConsoleEntry,
      applyReferenceTransformSpaceShortcut: deps.applyReferenceTransformSpaceShortcut,
      cancelActiveReferenceTransformSession: deps.cancelActiveReferenceTransformSession,
      commitActiveReferenceTransformFromConsole:
        deps.commitActiveReferenceTransformFromConsole,
      createActiveReferenceTransformSnapSession:
        deps.createActiveReferenceTransformSnapSession,
      dispatchImmediateShortcut: deps.dispatchImmediateShortcut,
      featureAssistChoiceMatcher: deps.featureAssistChoiceMatcher,
      featureAssistDescriptor: deps.featureAssistDescriptor,
      getAppState: deps.getAppState,
      getConsolePromptSession: deps.getConsolePromptSession,
      getViewer: deps.getViewer,
      inputText: deps.inputText,
      openReferenceTransformAxisPrompt: deps.openReferenceTransformAxisPrompt,
      openReferenceTransformPlanePrompt: deps.openReferenceTransformPlanePrompt,
      pushCommandHistory: deps.pushCommandHistory,
      requestRadioBurst: deps.requestRadioBurst,
      resolveFeatureAssistSubmitIdentity: deps.resolveFeatureAssistSubmitIdentity,
      setInputText: deps.setInputText,
      setStagedNavigationSession: deps.setStagedNavigationSession,
    })

    expect(handled).toBe(true)
    expect(deps.openReferenceTransformAxisPrompt).toHaveBeenCalledWith('x')
    expect(deps.entries.at(-1)).toEqual(
      expect.objectContaining({
        layer: 'Commands',
        source: 'console',
        severity: 'info',
      }),
    )
  })
})
