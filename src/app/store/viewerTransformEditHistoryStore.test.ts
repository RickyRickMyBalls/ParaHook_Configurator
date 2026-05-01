import { afterEach, describe, expect, it } from 'vitest'
import { editHistoryStore } from './editHistoryStore'
import {
  selectActiveViewerTransformHistoryEntries,
  useAppStore,
} from './useAppStore'
import { useUiPrefsStore } from './uiPrefsStore'
import type { ReferenceTransformOverride } from '../references/referenceManifest'

const defaultTransform = (): ReferenceTransformOverride => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const movedTransform = (x: number, y = 0, z = 0): ReferenceTransformOverride => ({
  ...defaultTransform(),
  position: { x, y, z },
})

const resetStores = (): void => {
  editHistoryStore.clear()
  useAppStore.setState(useAppStore.getInitialState(), true)
  useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
}

const addReference = (fileName: string): string =>
  useAppStore.getState().addImportedReference({
    fileName,
    fileType: 'glb',
    objectUrl: `blob:${fileName}`,
  })

const commitReferenceMove = (referenceId: string, transform: ReferenceTransformOverride): void => {
  const store = useAppStore.getState()
  store.beginViewerTransformShell({ kind: 'reference', referenceId })
  store.beginActiveViewerTransformEntry('translate')
  useAppStore.getState().setActiveViewerTransformDraft(transform)
  useAppStore.getState().commitActiveViewerTransformEntry()
}

const commitContentObjectMove = (objectId: string, transform: ReferenceTransformOverride): void => {
  const store = useAppStore.getState()
  store.beginViewerTransformShell({ kind: 'content-object', objectId })
  store.beginActiveViewerTransformEntry('translate')
  useAppStore.getState().setActiveViewerTransformDraft(transform)
  useAppStore.getState().commitActiveViewerTransformEntry()
}

afterEach(() => {
  resetStores()
})

describe('viewer transform edit history', () => {
  it('commits reference transform changes as one undoable canonical entry', () => {
    resetStores()
    const referenceId = addReference('reference-transform.glb')

    commitReferenceMove(referenceId, movedTransform(5, 1, 0))

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById[referenceId]).toMatchObject({
      position: { x: 5, y: 1, z: 0 },
    })
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId[referenceId],
    ).toHaveLength(1)

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(
      Object.prototype.hasOwnProperty.call(
        useAppStore.getState().referenceWorkspace.transformOverrideById,
        referenceId,
      ),
    ).toBe(true)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById[referenceId]).toBeNull()
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId[referenceId],
    ).toEqual([])

    expect(editHistoryStore.redo()).not.toBeNull()
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById[referenceId]).toMatchObject({
      position: { x: 5, y: 1, z: 0 },
    })
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId[referenceId],
    ).toHaveLength(1)
  })

  it('commits content-object transform changes as one undoable canonical entry', () => {
    resetStores()
    const objectId = 'content-object-a'

    commitContentObjectMove(objectId, movedTransform(-2, 4, 1))

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(
      useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById[objectId],
    ).toMatchObject({
      position: { x: -2, y: 4, z: 1 },
    })
    expect(useAppStore.getState().referenceWorkspace.transformHistoryByObjectId[objectId]).toHaveLength(1)

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(
      useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById[objectId],
    ).toBeUndefined()
    expect(useAppStore.getState().referenceWorkspace.transformHistoryByObjectId[objectId]).toEqual([])

    expect(editHistoryStore.redo()).not.toBeNull()
    expect(
      useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById[objectId],
    ).toMatchObject({
      position: { x: -2, y: 4, z: 1 },
    })
    expect(useAppStore.getState().referenceWorkspace.transformHistoryByObjectId[objectId]).toHaveLength(1)
  })

  it('ignores unchanged commits and preserves existing redo', () => {
    resetStores()
    const referenceId = addReference('reference-unchanged.glb')
    commitReferenceMove(referenceId, movedTransform(3))
    expect(editHistoryStore.undo()).not.toBeNull()
    expect(editHistoryStore.canRedo()).toBe(true)

    const store = useAppStore.getState()
    store.beginViewerTransformShell({ kind: 'reference', referenceId })
    store.beginActiveViewerTransformEntry('translate')
    useAppStore.getState().setActiveViewerTransformDraft(defaultTransform())
    useAppStore.getState().commitActiveViewerTransformEntry()

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps live drafts history-free', () => {
    resetStores()
    const referenceId = addReference('reference-draft.glb')

    const store = useAppStore.getState()
    store.beginViewerTransformShell({ kind: 'reference', referenceId })
    store.beginActiveViewerTransformEntry('translate')
    useAppStore.getState().setActiveViewerTransformDraft(movedTransform(6))

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById[referenceId] ?? undefined).toBeUndefined()
  })

  it('keeps scrub movement history-free without invalidating redo', () => {
    resetStores()
    const referenceId = addReference('reference-scrub.glb')
    commitReferenceMove(referenceId, movedTransform(8))

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(editHistoryStore.canRedo()).toBe(true)

    useAppStore.getState().beginViewerTransformShell({ kind: 'reference', referenceId })
    useAppStore.getState().setActiveViewerTransformHistoryScrubIndex(0)

    expect(editHistoryStore.canRedo()).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  })

  it('commits environment-light transform changes as one undoable canonical entry', () => {
    resetStores()
    const light = useUiPrefsStore
      .getState()
      .view.lighting.lights.find((candidate) => candidate.position !== undefined)
    expect(light).toBeDefined()
    const lightId = light!.id
    const originalPosition = { ...light!.position! }

    const store = useAppStore.getState()
    store.beginViewerTransformShell({ kind: 'environment-light', lightId })
    store.beginActiveViewerTransformEntry('translate')
    useAppStore.getState().setActiveViewerTransformDraft(movedTransform(10, 11, 12))
    useAppStore.getState().commitActiveViewerTransformEntry()

    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByEnvironmentLightId[lightId],
    ).toHaveLength(1)
    expect(
      useUiPrefsStore.getState().view.lighting.lights.find((candidate) => candidate.id === lightId)
        ?.position,
    ).toEqual({ x: 10, y: 11, z: 12 })

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(
      useUiPrefsStore.getState().view.lighting.lights.find((candidate) => candidate.id === lightId)
        ?.position,
    ).toEqual(originalPosition)
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByEnvironmentLightId[lightId] ?? [],
    ).toEqual([])

    expect(editHistoryStore.redo()).not.toBeNull()
    expect(
      useUiPrefsStore.getState().view.lighting.lights.find((candidate) => candidate.id === lightId)
        ?.position,
    ).toEqual({ x: 10, y: 11, z: 12 })
    expect(
      useAppStore.getState().referenceWorkspace.transformHistoryByEnvironmentLightId[lightId],
    ).toHaveLength(1)
  })

  it('preserves unrelated targets and local runtime/view state across transform undo and redo', () => {
    resetStores()
    const editedReferenceId = addReference('reference-edited.glb')
    const unrelatedReferenceId = addReference('reference-unrelated.glb')
    const unrelatedObjectId = 'content-object-unrelated'

    useAppStore.getState().setReferenceTransformOverride(unrelatedReferenceId, movedTransform(20))
    useAppStore.getState().setContentObjectTransformOverride(unrelatedObjectId, movedTransform(30))
    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'object',
      objectId: 'selection-should-survive',
    })

    commitReferenceMove(editedReferenceId, movedTransform(4))

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById[unrelatedReferenceId]).toMatchObject({
      position: { x: 20, y: 0, z: 0 },
    })
    expect(
      useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById[unrelatedObjectId],
    ).toMatchObject({
      position: { x: 30, y: 0, z: 0 },
    })
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'object',
      objectId: 'selection-should-survive',
    })

    expect(editHistoryStore.redo()).not.toBeNull()
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById[unrelatedReferenceId]).toMatchObject({
      position: { x: 20, y: 0, z: 0 },
    })
    expect(
      useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById[unrelatedObjectId],
    ).toMatchObject({
      position: { x: 30, y: 0, z: 0 },
    })
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'object',
      objectId: 'selection-should-survive',
    })
  })

  it('restores explicit null reference transform override keys on undo', () => {
    resetStores()
    const referenceId = addReference('reference-explicit-null.glb')
    useAppStore.setState((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        transformOverrideById: {
          ...state.referenceWorkspace.transformOverrideById,
          [referenceId]: null,
        },
      },
    }))

    commitReferenceMove(referenceId, movedTransform(7))

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(
      Object.prototype.hasOwnProperty.call(
        useAppStore.getState().referenceWorkspace.transformOverrideById,
        referenceId,
      ),
    ).toBe(true)
    expect(useAppStore.getState().referenceWorkspace.transformOverrideById[referenceId]).toBeNull()
  })

  it('restores explicit null content-object transform override keys on undo', () => {
    resetStores()
    const objectId = 'content-object-explicit-null'
    useAppStore.setState((state) => ({
      referenceWorkspace: {
        ...state.referenceWorkspace,
        contentObjectTransformOverrideById: {
          ...state.referenceWorkspace.contentObjectTransformOverrideById,
          [objectId]: null,
        },
      },
    }))

    commitContentObjectMove(objectId, movedTransform(9))

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(
      Object.prototype.hasOwnProperty.call(
        useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById,
        objectId,
      ),
    ).toBe(true)
    expect(
      useAppStore.getState().referenceWorkspace.contentObjectTransformOverrideById[objectId],
    ).toBeNull()
  })

  it('keeps active reference transform history readers aligned with canonical undo and redo', () => {
    resetStores()
    const referenceId = addReference('reference-reader.glb')
    commitReferenceMove(referenceId, movedTransform(12))

    useAppStore.getState().beginViewerTransformShell({ kind: 'reference', referenceId })
    expect(selectActiveViewerTransformHistoryEntries(useAppStore.getState().referenceWorkspace)).toHaveLength(1)

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(selectActiveViewerTransformHistoryEntries(useAppStore.getState().referenceWorkspace)).toEqual([])

    expect(editHistoryStore.redo()).not.toBeNull()
    expect(selectActiveViewerTransformHistoryEntries(useAppStore.getState().referenceWorkspace)).toHaveLength(1)
  })

  it('keeps active content-object transform history readers aligned with canonical undo and redo', () => {
    resetStores()
    const objectId = 'content-object-reader'
    commitContentObjectMove(objectId, movedTransform(13))

    useAppStore.getState().beginViewerTransformShell({ kind: 'content-object', objectId })
    expect(selectActiveViewerTransformHistoryEntries(useAppStore.getState().referenceWorkspace)).toHaveLength(1)

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(selectActiveViewerTransformHistoryEntries(useAppStore.getState().referenceWorkspace)).toEqual([])

    expect(editHistoryStore.redo()).not.toBeNull()
    expect(selectActiveViewerTransformHistoryEntries(useAppStore.getState().referenceWorkspace)).toHaveLength(1)
  })

  it('keeps local transform history row controls outside canonical edit history', () => {
    resetStores()
    const referenceId = addReference('reference-local-row-controls.glb')
    commitReferenceMove(referenceId, movedTransform(3))
    const entryId =
      useAppStore.getState().referenceWorkspace.transformHistoryByReferenceId[referenceId]?.[0]?.entryId
    expect(entryId).toBeDefined()
    editHistoryStore.clear()

    useAppStore
      .getState()
      .toggleViewerTransformHistoryLock({ kind: 'reference', referenceId }, entryId!)
    useAppStore
      .getState()
      .setViewerTransformHistoryEntryDeltaValue({ kind: 'reference', referenceId }, entryId!, 'x', 5)
    useAppStore.getState().mergeViewerTransformHistory({ kind: 'reference', referenceId })
    useAppStore
      .getState()
      .deleteViewerTransformHistoryEntry({ kind: 'reference', referenceId }, entryId!)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.getRedoEntries()).toHaveLength(0)
  })
})
