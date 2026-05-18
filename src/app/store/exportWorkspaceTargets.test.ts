import { describe, expect, it, beforeEach } from 'vitest'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { getExportWorkspaceTargetKey, useAppStore } from './useAppStore'

describe('export workspace targets', () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState(), true)
    useSpaghettiStore.setState(useSpaghettiStore.getInitialState(), true)
  })

  it('builds a deduped export target list from explicit workspace selection', () => {
    useAppStore.getState().setWorkspaceExplicitSelection({
      selectedTarget: { kind: 'object', objectId: 'object-1' },
      explicitSelectedTargets: [
        { kind: 'object', objectId: 'object-1' },
        { kind: 'object', objectId: 'object-1' },
        { kind: 'component', componentId: 'component-1' },
        { kind: 'environment-light', lightId: 'light-1' },
      ],
      selectionAnchorTarget: { kind: 'object', objectId: 'object-1' },
    })

    useAppStore.getState().replaceExportWorkspaceTargetsFromSelection()

    expect(useAppStore.getState().exportWorkspaceTargets).toEqual([
      { kind: 'object', objectId: 'object-1' },
      { kind: 'component', componentId: 'component-1' },
    ])
    expect(useAppStore.getState().activeExportWorkspaceTargetKey).toBe('object:object-1')
  })

  it('falls back to the primary selected target when explicit selection is empty', () => {
    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'graph-document',
      graphDocumentId: 'graph-document-1',
    })

    useAppStore.getState().replaceExportWorkspaceTargetsFromSelection()

    expect(useAppStore.getState().exportWorkspaceTargets).toEqual([
      { kind: 'graph-document', graphDocumentId: 'graph-document-1' },
    ])
    expect(useAppStore.getState().activeExportWorkspaceTargetKey).toBe(
      'graph-document:graph-document-1',
    )
  })

  it('removes export targets without mutating workspace selection', () => {
    useAppStore.getState().setWorkspaceExplicitSelection({
      selectedTarget: { kind: 'object', objectId: 'object-1' },
      explicitSelectedTargets: [
        { kind: 'object', objectId: 'object-1' },
        { kind: 'component', componentId: 'component-1' },
      ],
      selectionAnchorTarget: { kind: 'object', objectId: 'object-1' },
    })
    useAppStore.getState().setExportWorkspaceTargets([
      { kind: 'object', objectId: 'object-1' },
      { kind: 'component', componentId: 'component-1' },
    ])

    useAppStore.getState().removeExportWorkspaceTarget('object:object-1')

    expect(useAppStore.getState().exportWorkspaceTargets).toEqual([
      { kind: 'component', componentId: 'component-1' },
    ])
    expect(useAppStore.getState().activeExportWorkspaceTargetKey).toBe('component:component-1')
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([
      { kind: 'object', objectId: 'object-1' },
      { kind: 'component', componentId: 'component-1' },
    ])
  })

  it('creates stable target keys for executable graph document export targets', () => {
    expect(
      getExportWorkspaceTargetKey({
        kind: 'graph-document',
        graphDocumentId: 'graph-document-1',
      }),
    ).toBe('graph-document:graph-document-1')
  })
})
