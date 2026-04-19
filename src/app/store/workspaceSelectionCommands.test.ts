import { describe, expect, it, vi } from 'vitest'
import {
  clearWorkspaceTargetSelection,
  commitWorkspaceExplicitSelection,
  commitWorkspaceTargetSelection,
  deleteWorkspaceSelectedEnvironmentLight,
} from './workspaceSelectionCommands'
import { useUiPrefsStore } from './uiPrefsStore'

describe('workspaceSelectionCommands', () => {
  it('commits a single workspace target through one shared selection outcome seam', () => {
    const setWorkspaceSelectedTarget = vi.fn()
    const selectPart = vi.fn()
    const setActiveSurface = vi.fn()
    const requestConsoleContextSync = vi.fn()
    const requestConsoleWorkspaceContextHandoff = vi.fn()

    commitWorkspaceTargetSelection(
      {
        setWorkspaceSelectedTarget,
        selectPart,
        setActiveSurface,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
      },
      {
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      },
      {
        selectedPartKey: null,
        activeSurface: 'browser',
      },
    )

    expect(setWorkspaceSelectedTarget).toHaveBeenCalledWith({
      kind: 'reference-item',
      referenceId: 'shoe:shoe-1',
    })
    expect(selectPart).toHaveBeenCalledWith(null)
    expect(setActiveSurface).toHaveBeenCalledWith('browser')
    expect(requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: {
        kind: 'reference-item',
        referenceId: 'shoe:shoe-1',
      },
    })
    expect(requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
  })

  it('commits explicit multi-selection through the same shared side-effect seam', () => {
    const setWorkspaceExplicitSelection = vi.fn()
    const selectPart = vi.fn()
    const setActiveSurface = vi.fn()
    const requestConsoleContextSync = vi.fn()
    const requestConsoleWorkspaceContextHandoff = vi.fn()

    commitWorkspaceExplicitSelection(
      {
        setWorkspaceExplicitSelection,
        selectPart,
        setActiveSurface,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
      },
      {
        selectedTarget: { kind: 'object', objectId: 'object-2' },
        explicitSelectedTargets: [
          { kind: 'assembly', assemblyId: 'assembly-1' },
          { kind: 'object', objectId: 'object-2' },
        ],
        selectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
      },
      {
        selectedPartKey: 'part:object-2',
        activeSurface: 'viewer',
      },
    )

    expect(setWorkspaceExplicitSelection).toHaveBeenCalledWith({
      selectedTarget: { kind: 'object', objectId: 'object-2' },
      explicitSelectedTargets: [
        { kind: 'assembly', assemblyId: 'assembly-1' },
        { kind: 'object', objectId: 'object-2' },
      ],
      selectionAnchorTarget: { kind: 'assembly', assemblyId: 'assembly-1' },
    })
    expect(selectPart).toHaveBeenCalledWith('part:object-2')
    expect(setActiveSurface).toHaveBeenCalledWith('viewer')
    expect(requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'viewer',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: { kind: 'object', objectId: 'object-2' },
    })
    expect(requestConsoleContextSync).toHaveBeenCalledWith('target-selection')
  })

  it('clears workspace selection through the same canonical clear path', () => {
    const setWorkspaceSelectedTarget = vi.fn()
    const selectPart = vi.fn()
    const requestConsoleContextSync = vi.fn()
    const requestConsoleWorkspaceContextHandoff = vi.fn()

    clearWorkspaceTargetSelection(
      {
        setWorkspaceSelectedTarget,
        selectPart,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
      },
      {
        syncReason: 'surface-clear',
      },
    )

    expect(setWorkspaceSelectedTarget).toHaveBeenCalledWith(null)
    expect(selectPart).toHaveBeenCalledWith(null)
    expect(requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: null,
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: null,
    })
    expect(requestConsoleContextSync).toHaveBeenCalledWith('surface-clear')
  })

  it('deletes a selected environment light through the shared selection path', () => {
    const setWorkspaceSelectedTarget = vi.fn()
    const selectLight = vi.fn()
    const setActiveSurface = vi.fn()
    const requestConsoleContextSync = vi.fn()
    const requestConsoleWorkspaceContextHandoff = vi.fn()
    const deleteLight = vi.fn()
    const getStateSpy = vi.spyOn(useUiPrefsStore, 'getState').mockReturnValue({
      view: {
        lighting: {
          lights: [
            { id: 'light-a' },
            { id: 'light-b' },
          ],
          selectedLightId: 'light-b',
        },
      },
    } as any)

    deleteWorkspaceSelectedEnvironmentLight(
      {
        setWorkspaceSelectedTarget,
        selectLight,
        setActiveSurface,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
        deleteLight,
      },
      {
        kind: 'environment-light',
        lightId: 'light-a',
      },
      {
        activeSurface: 'browser',
      },
    )

    expect(deleteLight).toHaveBeenCalledWith('light-a')
    expect(setWorkspaceSelectedTarget).toHaveBeenCalledWith({
      kind: 'environment-light',
      lightId: 'light-b',
    })
    expect(selectLight).toHaveBeenCalledWith('light-b')
    expect(setActiveSurface).toHaveBeenCalledWith('browser')
    expect(requestConsoleWorkspaceContextHandoff).toHaveBeenCalledWith({
      sourceSurface: 'browser',
      mode: 'selection',
      graphDocumentId: null,
      nodeId: null,
      editorViewportId: null,
      selectedTarget: {
        kind: 'environment-light',
        lightId: 'light-b',
      },
    })
    expect(requestConsoleContextSync).toHaveBeenCalledWith('target-selection')

    getStateSpy.mockRestore()
  })

  it('clears shared selection after deleting the last selected environment light', () => {
    const setWorkspaceSelectedTarget = vi.fn()
    const selectLight = vi.fn()
    const requestConsoleContextSync = vi.fn()
    const requestConsoleWorkspaceContextHandoff = vi.fn()
    const deleteLight = vi.fn()
    const getStateSpy = vi.spyOn(useUiPrefsStore, 'getState').mockReturnValue({
      view: {
        lighting: {
          lights: [{ id: 'light-a' }],
          selectedLightId: null,
        },
      },
    } as any)

    const result = deleteWorkspaceSelectedEnvironmentLight(
      {
        setWorkspaceSelectedTarget,
        selectLight,
        requestConsoleContextSync,
        requestConsoleWorkspaceContextHandoff,
        deleteLight,
      },
      {
        kind: 'environment-light',
        lightId: 'light-a',
      },
    )

    expect(result).toEqual({
      deletedTarget: {
        kind: 'environment-light',
        lightId: 'light-a',
      },
      nextSelectedTarget: null,
    })
    expect(deleteLight).toHaveBeenCalledWith('light-a')
    expect(setWorkspaceSelectedTarget).toHaveBeenCalledWith(null)
    expect(selectLight).toHaveBeenCalledWith(null)
    expect(requestConsoleContextSync).toHaveBeenCalledWith('target-selection')

    getStateSpy.mockRestore()
  })
})
