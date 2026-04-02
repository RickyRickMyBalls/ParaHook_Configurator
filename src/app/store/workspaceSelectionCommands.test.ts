import { describe, expect, it, vi } from 'vitest'
import {
  clearWorkspaceTargetSelection,
  commitWorkspaceExplicitSelection,
  commitWorkspaceTargetSelection,
} from './workspaceSelectionCommands'

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
})
