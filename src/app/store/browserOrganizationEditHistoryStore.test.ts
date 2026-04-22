import { afterEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from './editHistoryStore'
import {
  type ProjectContentState,
  useAppStore,
} from './useAppStore'

const createProjectContent = (): ProjectContentState => ({
  assembliesById: {
    'assembly-a': {
      assemblyId: 'assembly-a',
      label: 'Assembly A',
      assemblySourceKind: 'authored',
      childRowIds: ['component-a', 'component-b', 'component-runtime'],
    },
    'assembly-b': {
      assemblyId: 'assembly-b',
      label: 'Assembly B',
      assemblySourceKind: 'authored',
      childRowIds: ['component-c'],
    },
  },
  componentsById: {
    'component-a': {
      componentId: 'component-a',
      parentAssemblyId: 'assembly-a',
      parentComponentId: null,
      ownerGraphDocumentId: null,
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      sourceNodeId: null,
      label: 'Component A',
      componentSourceKind: 'authored',
      resolutionState: 'resolved',
      receiveId: null,
      childObjectIds: ['object-a', 'object-runtime'],
    },
    'component-b': {
      componentId: 'component-b',
      parentAssemblyId: 'assembly-a',
      parentComponentId: null,
      ownerGraphDocumentId: null,
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      sourceNodeId: null,
      label: 'Component B',
      componentSourceKind: 'authored',
      resolutionState: 'resolved',
      receiveId: null,
      childObjectIds: [],
    },
    'component-c': {
      componentId: 'component-c',
      parentAssemblyId: 'assembly-b',
      parentComponentId: null,
      ownerGraphDocumentId: null,
      sourceGraphDocumentId: null,
      sourceOutputEntryId: null,
      sourceNodeId: null,
      label: 'Component C',
      componentSourceKind: 'authored',
      resolutionState: 'resolved',
      receiveId: null,
      childObjectIds: [],
    },
    'component-runtime': {
      componentId: 'component-runtime',
      parentAssemblyId: 'assembly-a',
      parentComponentId: null,
      ownerGraphDocumentId: 'graph-document-1',
      sourceGraphDocumentId: 'graph-document-1',
      sourceOutputEntryId: 'output-1',
      sourceNodeId: 'node-1',
      label: 'Runtime Component',
      componentSourceKind: 'published-component',
      resolutionState: 'resolved',
      receiveId: null,
      childObjectIds: [],
    },
  },
  objectsById: {
    'object-a': {
      objectId: 'object-a',
      ownerGraphDocumentId: 'graph-document-1',
      parentAssemblyId: 'assembly-a',
      parentComponentId: 'component-a',
      objectSourceKind: 'published-object',
      sourceGraphDocumentId: 'graph-document-1',
      sourceOutputEntryId: 'output-object-a',
      sourceNodeId: 'node-object-a',
      slotId: null,
      label: 'Object A',
      resolutionState: 'resolved',
    },
    'object-runtime': {
      objectId: 'object-runtime',
      ownerGraphDocumentId: 'graph-document-1',
      parentAssemblyId: 'assembly-a',
      parentComponentId: 'component-a',
      objectSourceKind: 'published-object',
      sourceGraphDocumentId: 'graph-document-1',
      sourceOutputEntryId: 'output-object-runtime',
      sourceNodeId: 'node-object-runtime',
      slotId: null,
      label: 'Runtime Object',
      resolutionState: 'resolved',
    },
  },
})

const resetStores = (): void => {
  editHistoryStore.clear()
  useAppStore.setState(useAppStore.getInitialState(), true)
}

const seedBrowserProjectContent = (): void => {
  useAppStore.setState((state) => ({
    projectContent: createProjectContent(),
    runtimeContentPlacementByRowId: {
      'object-runtime': {
        parentAssemblyId: 'assembly-a',
        parentComponentId: 'component-a',
      },
    },
    workspaceSelection: {
      ...state.workspaceSelection,
      selectedTarget: { kind: 'component', componentId: 'component-a' },
    },
  }))
}

const assemblyLabel = (assemblyId: string): string | undefined =>
  useAppStore.getState().projectContent.assembliesById[assemblyId]?.label

const componentLabel = (componentId: string): string | undefined =>
  useAppStore.getState().projectContent.componentsById[componentId]?.label

const assemblyChildRows = (assemblyId: string): string[] | undefined =>
  useAppStore.getState().projectContent.assembliesById[assemblyId]?.childRowIds

const componentChildObjects = (componentId: string): string[] | undefined =>
  useAppStore.getState().projectContent.componentsById[componentId]?.childObjectIds

const assemblyExists = (assemblyId: string): boolean =>
  useAppStore.getState().projectContent.assembliesById[assemblyId] !== undefined

const componentExists = (componentId: string): boolean =>
  useAppStore.getState().projectContent.componentsById[componentId] !== undefined

const objectExists = (objectId: string): boolean =>
  useAppStore.getState().projectContent.objectsById[objectId] !== undefined

const objectParent = (objectId: string): {
  parentAssemblyId?: string | null
  parentComponentId: string | null
} | undefined => {
  const objectRow = useAppStore.getState().projectContent.objectsById[objectId]
  return objectRow === undefined
    ? undefined
    : {
        parentAssemblyId: objectRow.parentAssemblyId,
        parentComponentId: objectRow.parentComponentId,
      }
}

describe('browser organization edit history store adapters', () => {
  afterEach(() => {
    resetStores()
  })

  it('commits assembly rename as one canonical undoable and redoable entry', () => {
    seedBrowserProjectContent()
    const selectionBeforeRename = useAppStore.getState().workspaceSelection
    const referenceWorkspaceBeforeRename = useAppStore.getState().referenceWorkspace

    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'assembly', assemblyId: 'assembly-a' },
        '  Renamed   Assembly  ',
      ),
    ).toBe(true)

    expect(assemblyLabel('assembly-a')).toBe('Renamed Assembly')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Rename Browser item',
      source: {
        surface: 'browser',
        sourceId: 'browser-project-organization',
        sourceLabel: 'Browser Project Organization',
      },
      targetId: 'assembly-a',
      targetLabel: 'Renamed Assembly',
    })

    expect(editHistoryStore.undo()?.label).toBe('Rename Browser item')
    expect(assemblyLabel('assembly-a')).toBe('Assembly A')
    expect(useAppStore.getState().workspaceSelection).toBe(selectionBeforeRename)
    expect(useAppStore.getState().referenceWorkspace).toBe(referenceWorkspaceBeforeRename)

    expect(editHistoryStore.redo()?.label).toBe('Rename Browser item')
    expect(assemblyLabel('assembly-a')).toBe('Renamed Assembly')
    expect(useAppStore.getState().workspaceSelection).toBe(selectionBeforeRename)
    expect(useAppStore.getState().referenceWorkspace).toBe(referenceWorkspaceBeforeRename)
  })

  it('commits authored component rename as one canonical undoable and redoable entry', () => {
    seedBrowserProjectContent()

    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'component', componentId: 'component-a' },
        'Renamed Component',
      ),
    ).toBe(true)

    expect(componentLabel('component-a')).toBe('Renamed Component')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Rename Browser item',
      targetId: 'component-a',
      targetLabel: 'Renamed Component',
    })

    expect(editHistoryStore.undo()?.label).toBe('Rename Browser item')
    expect(componentLabel('component-a')).toBe('Component A')
    expect(editHistoryStore.redo()?.label).toBe('Rename Browser item')
    expect(componentLabel('component-a')).toBe('Renamed Component')
  })

  it('keeps unchanged and invalid rename attempts out of canonical history', () => {
    seedBrowserProjectContent()

    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'assembly', assemblyId: 'assembly-a' },
        'Renamed Assembly',
      ),
    ).toBe(true)
    expect(editHistoryStore.undo()?.label).toBe('Rename Browser item')
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)

    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'assembly', assemblyId: 'assembly-a' },
        '  Assembly   A  ',
      ),
    ).toBe(true)
    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'assembly', assemblyId: 'missing-assembly' },
        'Missing Assembly',
      ),
    ).toBe(false)
    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'object', objectId: 'object-a' },
        'Unsupported Object',
      ),
    ).toBe(false)
    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'component', componentId: 'component-runtime' },
        'Unsupported Runtime Component',
      ),
    ).toBe(false)
    expect(
      useAppStore.getState().renameProjectContentOwnerWithHistory(
        { kind: 'component', componentId: 'component-a' },
        '   ',
      ),
    ).toBe(false)

    expect(assemblyLabel('assembly-a')).toBe('Assembly A')
    expect(componentLabel('component-runtime')).toBe('Runtime Component')
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)
  })

  it('commits authored assembly create as one canonical undoable and redoable entry', () => {
    seedBrowserProjectContent()

    const assemblyId = useAppStore.getState().createProjectAssemblyWithHistory()

    expect(assemblyExists(assemblyId)).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Create Browser item',
      targetId: assemblyId,
      targetLabel: 'Assembly 1',
    })

    useAppStore.setState((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: { kind: 'component', componentId: 'component-b' },
      },
    }))
    const selectionBeforeUndo = useAppStore.getState().workspaceSelection

    expect(editHistoryStore.undo()?.label).toBe('Create Browser item')
    expect(assemblyExists(assemblyId)).toBe(false)
    expect(useAppStore.getState().workspaceSelection).toEqual(selectionBeforeUndo)

    expect(editHistoryStore.redo()?.label).toBe('Create Browser item')
    expect(assemblyExists(assemblyId)).toBe(true)
    expect(assemblyLabel(assemblyId)).toBe('Assembly 1')
    expect(useAppStore.getState().workspaceSelection).toEqual(selectionBeforeUndo)
  })

  it('commits authored component create as one canonical undoable and redoable entry', () => {
    seedBrowserProjectContent()

    const componentId = useAppStore.getState().createProjectComponentWithHistory('assembly-b')
    expect(componentId).not.toBeNull()

    expect(componentExists(componentId!)).toBe(true)
    expect(assemblyChildRows('assembly-b')).toEqual(['component-c', componentId])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Create Browser item',
      targetId: componentId,
      targetLabel: 'Component 1',
    })

    expect(editHistoryStore.undo()?.label).toBe('Create Browser item')
    expect(componentExists(componentId!)).toBe(false)
    expect(assemblyChildRows('assembly-b')).toEqual(['component-c'])

    expect(editHistoryStore.redo()?.label).toBe('Create Browser item')
    expect(componentExists(componentId!)).toBe(true)
    expect(componentLabel(componentId!)).toBe('Component 1')
    expect(assemblyChildRows('assembly-b')).toEqual(['component-c', componentId])
  })

  it('commits authored component delete with child objects as one canonical entry', () => {
    seedBrowserProjectContent()

    expect(
      useAppStore.getState().deleteProjectContentOwnerWithHistory({
        kind: 'component',
        componentId: 'component-a',
      }),
    ).toBe(true)

    expect(componentExists('component-a')).toBe(false)
    expect(objectExists('object-a')).toBe(false)
    expect(objectExists('object-runtime')).toBe(false)
    expect(assemblyChildRows('assembly-a')).toEqual(['component-b', 'component-runtime'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Delete Browser item',
      targetId: 'component-a',
      targetLabel: 'Component A',
    })

    useAppStore.setState((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: { kind: 'component', componentId: 'component-b' },
      },
    }))
    const selectionBeforeUndo = useAppStore.getState().workspaceSelection

    expect(editHistoryStore.undo()?.label).toBe('Delete Browser item')
    expect(componentExists('component-a')).toBe(true)
    expect(objectExists('object-a')).toBe(true)
    expect(objectExists('object-runtime')).toBe(true)
    expect(assemblyChildRows('assembly-a')).toEqual([
      'component-a',
      'component-b',
      'component-runtime',
    ])
    expect(componentChildObjects('component-a')).toEqual(['object-a', 'object-runtime'])
    expect(useAppStore.getState().workspaceSelection).toEqual(selectionBeforeUndo)

    expect(editHistoryStore.redo()?.label).toBe('Delete Browser item')
    expect(componentExists('component-a')).toBe(false)
    expect(objectExists('object-a')).toBe(false)
    expect(objectExists('object-runtime')).toBe(false)
    expect(useAppStore.getState().workspaceSelection).toEqual(selectionBeforeUndo)
  })

  it('commits authored assembly delete with subtree payload as one canonical entry', () => {
    seedBrowserProjectContent()
    useAppStore.setState((state) => ({
      projectContent: {
        ...state.projectContent,
        assembliesById: {
          ...state.projectContent.assembliesById,
          'assembly-a': {
            ...state.projectContent.assembliesById['assembly-a']!,
            childRowIds: ['component-a', 'assembly-child', 'component-b', 'component-runtime'],
          },
          'assembly-child': {
            assemblyId: 'assembly-child',
            label: 'Nested Assembly',
            assemblySourceKind: 'authored',
            childRowIds: ['component-child'],
          },
        },
        componentsById: {
          ...state.projectContent.componentsById,
          'component-child': {
            componentId: 'component-child',
            parentAssemblyId: 'assembly-child',
            parentComponentId: null,
            ownerGraphDocumentId: null,
            sourceGraphDocumentId: null,
            sourceOutputEntryId: null,
            sourceNodeId: null,
            label: 'Nested Component',
            componentSourceKind: 'authored',
            resolutionState: 'resolved',
            receiveId: null,
            childObjectIds: ['object-child'],
          },
        },
        objectsById: {
          ...state.projectContent.objectsById,
          'object-child': {
            objectId: 'object-child',
            ownerGraphDocumentId: 'graph-document-1',
            parentAssemblyId: 'assembly-child',
            parentComponentId: 'component-child',
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-object-child',
            sourceNodeId: 'node-object-child',
            slotId: null,
            label: 'Nested Object',
            resolutionState: 'resolved',
          },
        },
      },
    }))

    expect(
      useAppStore.getState().deleteProjectContentOwnerWithHistory({
        kind: 'assembly',
        assemblyId: 'assembly-a',
      }),
    ).toBe(true)

    expect(assemblyExists('assembly-a')).toBe(false)
    expect(assemblyExists('assembly-child')).toBe(false)
    expect(componentExists('component-child')).toBe(false)
    expect(objectExists('object-child')).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Delete Browser item',
      targetId: 'assembly-a',
      targetLabel: 'Assembly A',
    })

    expect(editHistoryStore.undo()?.label).toBe('Delete Browser item')
    expect(assemblyExists('assembly-a')).toBe(true)
    expect(assemblyExists('assembly-child')).toBe(true)
    expect(componentExists('component-child')).toBe(true)
    expect(objectExists('object-child')).toBe(true)
    expect(assemblyChildRows('assembly-a')).toEqual([
      'component-a',
      'assembly-child',
      'component-b',
      'component-runtime',
    ])
    expect(assemblyChildRows('assembly-child')).toEqual(['component-child'])

    expect(editHistoryStore.redo()?.label).toBe('Delete Browser item')
    expect(assemblyExists('assembly-a')).toBe(false)
    expect(assemblyExists('assembly-child')).toBe(false)
    expect(componentExists('component-child')).toBe(false)
    expect(objectExists('object-child')).toBe(false)
  })

  it('keeps raw create calls and invalid create/delete attempts out of canonical history', () => {
    seedBrowserProjectContent()

    const rawAssemblyId = useAppStore.getState().createProjectAssembly()
    const rawComponentId = useAppStore.getState().createProjectComponent('assembly-a')
    expect(rawAssemblyId).toBeTruthy()
    expect(rawComponentId).toBeTruthy()
    expect(editHistoryStore.getUndoEntries()).toEqual([])

    expect(useAppStore.getState().createProjectComponentWithHistory('missing-assembly')).toBeNull()
    expect(
      useAppStore.getState().deleteProjectContentOwnerWithHistory({
        kind: 'assembly',
        assemblyId: 'missing-assembly',
      }),
    ).toBe(false)
    expect(
      useAppStore.getState().deleteProjectContentOwnerWithHistory({
        kind: 'component',
        componentId: 'component-runtime',
      }),
    ).toBe(false)

    useAppStore.setState((state) => ({
      projectContent: {
        ...state.projectContent,
        assembliesById: {
          ...state.projectContent.assembliesById,
          'assembly-runtime-root': {
            assemblyId: 'assembly-runtime-root',
            label: 'Runtime Root',
            assemblySourceKind: 'runtime-root',
            childRowIds: [],
          },
        },
      },
    }))
    expect(
      useAppStore.getState().deleteProjectContentOwnerWithHistory({
        kind: 'assembly',
        assemblyId: 'assembly-runtime-root',
      }),
    ).toBe(false)

    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })

  it('commits same-parent reorder as one canonical undoable and redoable entry', () => {
    seedBrowserProjectContent()
    const beforeSnapshot =
      useAppStore.getState().captureProjectContentOrganizationHistorySnapshot()

    expect(
      useAppStore.getState().moveProjectContentOwner(
        { kind: 'component', componentId: 'component-b' },
        { kind: 'component', componentId: 'component-a', position: 'before' },
      ),
    ).toBe(true)
    expect(
      useAppStore.getState().commitProjectContentOrganizationMoveHistory(beforeSnapshot, {
        targetId: 'component-b',
        targetLabel: 'Component B',
      }),
    ).toBe(true)

    expect(assemblyChildRows('assembly-a')).toEqual([
      'component-b',
      'component-a',
      'component-runtime',
    ])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Move Browser item',
      source: {
        surface: 'browser',
        sourceId: 'browser-project-organization',
        sourceLabel: 'Browser Project Organization',
      },
      targetId: 'component-b',
      targetLabel: 'Component B',
    })

    expect(editHistoryStore.undo()?.label).toBe('Move Browser item')
    expect(assemblyChildRows('assembly-a')).toEqual([
      'component-a',
      'component-b',
      'component-runtime',
    ])

    expect(editHistoryStore.redo()?.label).toBe('Move Browser item')
    expect(assemblyChildRows('assembly-a')).toEqual([
      'component-b',
      'component-a',
      'component-runtime',
    ])
  })

  it('commits reparent as one canonical undoable and redoable entry without restoring selection', () => {
    seedBrowserProjectContent()
    const beforeSnapshot =
      useAppStore.getState().captureProjectContentOrganizationHistorySnapshot()

    expect(
      useAppStore.getState().moveProjectContentOwner(
        { kind: 'object', objectId: 'object-a' },
        { kind: 'component', componentId: 'component-b', position: 'into' },
      ),
    ).toBe(true)
    expect(
      useAppStore.getState().commitProjectContentOrganizationMoveHistory(beforeSnapshot, {
        targetId: 'object-a',
        targetLabel: 'Object A',
      }),
    ).toBe(true)

    const selectionAfterMove = useAppStore.getState().workspaceSelection
    expect(componentChildObjects('component-a')).toEqual(['object-runtime'])
    expect(componentChildObjects('component-b')).toEqual(['object-a'])
    expect(objectParent('object-a')).toEqual({
      parentAssemblyId: 'assembly-a',
      parentComponentId: 'component-b',
    })

    useAppStore.setState((state) => ({
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: null,
      },
    }))
    const selectionBeforeUndo = useAppStore.getState().workspaceSelection

    expect(editHistoryStore.undo()?.label).toBe('Move Browser item')
    expect(componentChildObjects('component-a')).toEqual(['object-a', 'object-runtime'])
    expect(componentChildObjects('component-b')).toEqual([])
    expect(objectParent('object-a')).toEqual({
      parentAssemblyId: 'assembly-a',
      parentComponentId: 'component-a',
    })
    expect(useAppStore.getState().workspaceSelection).toEqual(selectionBeforeUndo)
    expect(useAppStore.getState().workspaceSelection).not.toEqual(selectionAfterMove)

    expect(editHistoryStore.redo()?.label).toBe('Move Browser item')
    expect(componentChildObjects('component-a')).toEqual(['object-runtime'])
    expect(componentChildObjects('component-b')).toEqual(['object-a'])
    expect(useAppStore.getState().workspaceSelection).toEqual(selectionBeforeUndo)
  })

  it('collapses a multi-step completed drop into one canonical entry', () => {
    seedBrowserProjectContent()
    const beforeSnapshot =
      useAppStore.getState().captureProjectContentOrganizationHistorySnapshot()

    expect(
      useAppStore.getState().moveProjectContentOwner(
        { kind: 'component', componentId: 'component-b' },
        { kind: 'assembly', assemblyId: 'assembly-b', position: 'into' },
      ),
    ).toBe(true)
    expect(
      useAppStore.getState().moveProjectContentOwner(
        { kind: 'component', componentId: 'component-b' },
        { kind: 'component', componentId: 'component-c', position: 'before' },
      ),
    ).toBe(true)
    expect(
      useAppStore.getState().commitProjectContentOrganizationMoveHistory(beforeSnapshot, {
        targetId: 'component-b',
        targetLabel: 'Component B',
      }),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(assemblyChildRows('assembly-a')).toEqual(['component-a', 'component-runtime'])
    expect(assemblyChildRows('assembly-b')).toEqual(['component-b', 'component-c'])

    expect(editHistoryStore.undo()?.label).toBe('Move Browser item')
    expect(assemblyChildRows('assembly-a')).toEqual([
      'component-a',
      'component-b',
      'component-runtime',
    ])
    expect(assemblyChildRows('assembly-b')).toEqual(['component-c'])

    expect(editHistoryStore.redo()?.label).toBe('Move Browser item')
    expect(assemblyChildRows('assembly-a')).toEqual(['component-a', 'component-runtime'])
    expect(assemblyChildRows('assembly-b')).toEqual(['component-b', 'component-c'])
  })

  it('commits grouped moves as one entry and restores runtime placement side effects', () => {
    seedBrowserProjectContent()
    const beforeSnapshot =
      useAppStore.getState().captureProjectContentOrganizationHistorySnapshot()

    expect(
      useAppStore.getState().moveProjectContentOwnersBatch(
        [
          { kind: 'object', objectId: 'object-a' },
          { kind: 'object', objectId: 'object-runtime' },
        ],
        { kind: 'component', componentId: 'component-b', position: 'into' },
      ),
    ).toBe(true)
    expect(
      useAppStore.getState().commitProjectContentOrganizationMoveHistory(beforeSnapshot, {
        targetId: 'object-a,object-runtime',
        targetLabel: '2 Browser items',
      }),
    ).toBe(true)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(componentChildObjects('component-a')).toEqual([])
    expect(componentChildObjects('component-b')).toEqual(['object-a', 'object-runtime'])
    expect(useAppStore.getState().runtimeContentPlacementByRowId['object-runtime']).toEqual({
      parentAssemblyId: 'assembly-a',
      parentComponentId: 'component-b',
    })

    expect(editHistoryStore.undo()?.label).toBe('Move Browser item')
    expect(componentChildObjects('component-a')).toEqual(['object-a', 'object-runtime'])
    expect(componentChildObjects('component-b')).toEqual([])
    expect(useAppStore.getState().runtimeContentPlacementByRowId['object-runtime']).toEqual({
      parentAssemblyId: 'assembly-a',
      parentComponentId: 'component-a',
    })

    expect(editHistoryStore.redo()?.label).toBe('Move Browser item')
    expect(componentChildObjects('component-a')).toEqual([])
    expect(componentChildObjects('component-b')).toEqual(['object-a', 'object-runtime'])
  })

  it('keeps invalid and no-change drop attempts out of canonical history', () => {
    seedBrowserProjectContent()
    const beforeSnapshot =
      useAppStore.getState().captureProjectContentOrganizationHistorySnapshot()

    expect(
      useAppStore.getState().moveProjectContentOwner(
        { kind: 'component', componentId: 'missing-component' },
        { kind: 'component', componentId: 'component-a', position: 'before' },
      ),
    ).toBe(false)
    expect(
      useAppStore.getState().commitProjectContentOrganizationMoveHistory(beforeSnapshot, {
        targetId: 'missing-component',
      }),
    ).toBe(false)

    expect(
      useAppStore.getState().commitProjectContentOrganizationMoveHistory(
        useAppStore.getState().captureProjectContentOrganizationHistorySnapshot(),
        {
          targetId: 'component-a',
        },
      ),
    ).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toEqual([])
    expect(editHistoryStore.getRedoEntries()).toEqual([])
  })
})
