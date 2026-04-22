import { afterEach, describe, expect, it } from 'vitest'
import { useConsoleStore } from '../console/useConsoleStore'
import { editHistoryStore } from './editHistoryStore'
import { useAppStore } from './useAppStore'

const resetStores = (): void => {
  editHistoryStore.clear()
  useAppStore.setState(useAppStore.getInitialState(), true)
  useConsoleStore.setState(useConsoleStore.getInitialState(), true)
}

const appendStagedImportFile = (options: {
  fileName: string
  fileType: 'glb' | 'obj' | 'step'
  objectUrl: string
}): string => {
  useAppStore.getState().appendStagedImportDraftFiles([options])
  const stagedFileId =
    useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles.at(-1)
      ?.stagedFileId ?? null
  expect(stagedFileId).toBeTruthy()
  return stagedFileId!
}

const markStagedFileReady = (stagedFileId: string): void => {
  useAppStore.getState().resolveStagedImportFileStructureInspection(stagedFileId, {
    hasMultipleObjects: false,
    hasHierarchy: false,
    hasParts: false,
    labels: [],
    partRows: [],
  })
}

const findImportedReferenceIdByAssetPath = (assetPath: string): string | null => {
  const state = useAppStore.getState()
  return (
    state.referenceWorkspace.importedReferenceOrder.find(
      (referenceId) =>
        state.referenceWorkspace.importedReferencesById[referenceId]?.assetPath === assetPath,
    ) ?? null
  )
}

const readReferenceRuntimeState = (referenceId: string) => {
  const state = useAppStore.getState().referenceWorkspace
  return {
    visible: state.visibilityById[referenceId],
    loadState: state.loadStateById[referenceId],
    error: state.errorById[referenceId],
    transformOverride: state.transformOverrideById[referenceId],
    partRows: state.partRowsByReferenceId[referenceId],
  }
}

describe('accepted import edit history store adapters', () => {
  afterEach(() => {
    resetStores()
  })

  it('commits accepted staged imports as one canonical undoable and redoable entry', () => {
    resetStores()
    const unrelatedReferenceId = useAppStore.getState().addImportedReference({
      fileName: 'unrelated.glb',
      fileType: 'glb',
      objectUrl: 'blob:unrelated-reference',
    })
    useAppStore.getState().openStagedImportDraft({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    const stagedFileId = appendStagedImportFile({
      fileName: 'accepted.step',
      fileType: 'step',
      objectUrl: 'blob:accepted-step',
    })
    markStagedFileReady(stagedFileId)

    const commitResult = useAppStore.getState().commitStagedImportDraftWithHistory()

    expect(commitResult).toMatchObject({
      status: 'success',
      committedReferenceCount: 1,
    })
    const committedReferenceId = findImportedReferenceIdByAssetPath('blob:accepted-step')
    expect(committedReferenceId).toBeTruthy()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Accept Import',
      source: {
        surface: 'browser',
        sourceId: 'browser-accepted-import',
        sourceLabel: 'Browser Accepted Import',
      },
      targetLabel: '1 staged import',
    })

    const rootAssemblyId = useAppStore.getState().currentProject.rootAssemblyId
    expect(rootAssemblyId).toBeTruthy()
    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'assembly',
      assemblyId: rootAssemblyId!,
    })
    useAppStore.getState().setReferenceTransformMoveSnapDotsEnabled(false)
    useAppStore.getState().setReferenceItemVisibility(unrelatedReferenceId, false)
    useAppStore
      .getState()
      .setReferenceItemLoadState(unrelatedReferenceId, 'error', 'Changed after accept.')
    useAppStore.getState().setReferenceTransformOverride(unrelatedReferenceId, {
      position: { x: 12, y: 3, z: -4 },
      rotationDeg: { x: 15, y: 30, z: 45 },
      scale: { x: 2, y: 2, z: 2 },
    })
    useAppStore.getState().setReferenceItemPartRows(unrelatedReferenceId, [
      {
        partKey: 'unrelated-part-1',
        label: 'Unrelated Part',
        sourceMeshIndex: 0,
      },
    ])
    useConsoleStore.getState().appendEntry({
      layer: 'Commands',
      text: 'local transcript after accept',
      source: 'user',
      severity: 'info',
    })
    const transcriptEntryCount = useConsoleStore.getState().entries.length
    const unrelatedReferenceStateAfterAccept = readReferenceRuntimeState(unrelatedReferenceId)

    expect(editHistoryStore.undo()?.label).toBe('Accept Import')
    expect(findImportedReferenceIdByAssetPath('blob:accepted-step')).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles).toHaveLength(0)
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'assembly',
      assemblyId: rootAssemblyId!,
    })
    expect(useAppStore.getState().referenceWorkspace.moveSnapDotsEnabled).toBe(false)
    expect(readReferenceRuntimeState(unrelatedReferenceId)).toEqual(
      unrelatedReferenceStateAfterAccept,
    )
    expect(useConsoleStore.getState().entries).toHaveLength(transcriptEntryCount)

    expect(editHistoryStore.redo()?.label).toBe('Accept Import')
    expect(findImportedReferenceIdByAssetPath('blob:accepted-step')).toBe(committedReferenceId)
    expect(useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles).toHaveLength(0)
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'assembly',
      assemblyId: rootAssemblyId!,
    })
    expect(useAppStore.getState().referenceWorkspace.moveSnapDotsEnabled).toBe(false)
    expect(readReferenceRuntimeState(unrelatedReferenceId)).toEqual(
      unrelatedReferenceStateAfterAccept,
    )
    expect(useConsoleStore.getState().entries).toHaveLength(transcriptEntryCount)
  })

  it('keeps partial import recovery drafts outside canonical undo and redo', () => {
    resetStores()
    useAppStore.getState().openStagedImportDraft({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    const acceptedFileId = appendStagedImportFile({
      fileName: 'accepted.glb',
      fileType: 'glb',
      objectUrl: 'blob:partial-accepted',
    })
    const brokenFileId = appendStagedImportFile({
      fileName: 'broken.glb',
      fileType: 'glb',
      objectUrl: 'blob:partial-broken',
    })
    markStagedFileReady(acceptedFileId)
    useAppStore
      .getState()
      .failStagedImportFileStructureInspection(brokenFileId, 'Could not inspect broken.glb.')

    const commitResult = useAppStore.getState().commitStagedImportDraftWithHistory()

    expect(commitResult).toMatchObject({
      status: 'partial',
      committedReferenceCount: 1,
    })
    const committedReferenceId = findImportedReferenceIdByAssetPath('blob:partial-accepted')
    expect(committedReferenceId).toBeTruthy()
    expect(useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles).toEqual([
      expect.objectContaining({
        stagedFileId: brokenFileId,
        fileName: 'broken.glb',
      }),
    ])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    expect(editHistoryStore.undo()?.label).toBe('Accept Import')
    expect(findImportedReferenceIdByAssetPath('blob:partial-accepted')).toBeNull()
    expect(useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles).toEqual([
      expect.objectContaining({
        stagedFileId: brokenFileId,
        fileName: 'broken.glb',
      }),
    ])

    expect(editHistoryStore.redo()?.label).toBe('Accept Import')
    expect(findImportedReferenceIdByAssetPath('blob:partial-accepted')).toBe(committedReferenceId)
    expect(useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles).toEqual([
      expect.objectContaining({
        stagedFileId: brokenFileId,
        fileName: 'broken.glb',
      }),
    ])
  })

  it('keeps raw and failed-only staged import commits out of canonical history', () => {
    resetStores()

    expect(useAppStore.getState().commitStagedImportDraftWithHistory()).toBeNull()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)

    useAppStore.getState().openStagedImportDraft({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    expect(useAppStore.getState().commitStagedImportDraftWithHistory()).toBeNull()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)

    const brokenFileId = appendStagedImportFile({
      fileName: 'broken.step',
      fileType: 'step',
      objectUrl: 'blob:failed-only',
    })
    useAppStore
      .getState()
      .failStagedImportFileStructureInspection(brokenFileId, 'Could not inspect broken.step.')
    expect(useAppStore.getState().commitStagedImportDraftWithHistory()).toMatchObject({
      status: 'failed',
      committedReferenceCount: 0,
    })
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)

    resetStores()
    useAppStore.getState().openStagedImportDraft({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    const acceptedFileId = appendStagedImportFile({
      fileName: 'raw.step',
      fileType: 'step',
      objectUrl: 'blob:raw-accepted',
    })
    markStagedFileReady(acceptedFileId)

    expect(useAppStore.getState().commitStagedImportDraft()).toMatchObject({
      status: 'success',
      committedReferenceCount: 1,
    })
    expect(findImportedReferenceIdByAssetPath('blob:raw-accepted')).toBeTruthy()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  })
})

describe('catalog add to project edit history store adapters', () => {
  afterEach(() => {
    resetStores()
  })

  it('commits direct Catalog imported references as one canonical undoable and redoable entry', () => {
    resetStores()
    const parentAssemblyId = useAppStore.getState().createProjectAssembly()
    const unrelatedReferenceId = useAppStore.getState().addImportedReference({
      fileName: 'unrelated.glb',
      fileType: 'glb',
      objectUrl: 'blob:catalog-unrelated',
    })

    const referenceId = useAppStore.getState().addImportedReferenceWithHistory({
      catalogItemId: 'reference:shoe-1',
      catalogFamilyKey: 'shoes',
      fileName: 'Shoe 1',
      fileType: 'glb',
      objectUrl: '/Catalog/shoes/Shoe_1.glb',
      parentAssemblyId,
    })

    expect(
      useAppStore.getState().referenceWorkspace.importedReferencesById[referenceId],
    ).toMatchObject({
      referenceId,
      catalogItemId: 'reference:shoe-1',
      catalogFamilyKey: 'shoes',
      label: 'Shoe 1',
      assetPath: '/Catalog/shoes/Shoe_1.glb',
      parentAssemblyId,
    })
    expect(
      useAppStore.getState().referenceWorkspace.contentOrderByParentKey[
        `assembly:${parentAssemblyId}`
      ],
    ).toContain(`reference-item-row:${referenceId}`)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Add Catalog item to project',
      source: {
        surface: 'catalog',
        sourceId: 'catalog-add-to-project',
        sourceLabel: 'Catalog Add To Project',
      },
      targetId: referenceId,
      targetLabel: 'Shoe 1',
    })

    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'assembly',
      assemblyId: parentAssemblyId,
    })
    useAppStore.getState().setReferenceItemVisibility(unrelatedReferenceId, false)
    useAppStore
      .getState()
      .setReferenceItemLoadState(unrelatedReferenceId, 'error', 'Catalog state changed.')
    useAppStore.getState().setReferenceTransformOverride(unrelatedReferenceId, {
      position: { x: 1, y: 2, z: 3 },
      rotationDeg: { x: 0, y: 90, z: 0 },
      scale: { x: 0.5, y: 0.5, z: 0.5 },
    })
    useAppStore.getState().setReferenceItemPartRows(unrelatedReferenceId, [
      {
        partKey: 'catalog-unrelated-part',
        label: 'Catalog Unrelated Part',
        sourceMeshIndex: 4,
      },
    ])
    const unrelatedReferenceStateAfterAdd = readReferenceRuntimeState(unrelatedReferenceId)
    const postCatalogComponentId =
      useAppStore.getState().createProjectComponent(parentAssemblyId)
    expect(postCatalogComponentId).toBeTruthy()
    useAppStore.getState().setWorkspaceSelectedTarget({
      kind: 'assembly',
      assemblyId: parentAssemblyId,
    })
    const projectContentAfterPostCatalogMutation = useAppStore.getState().projectContent

    expect(editHistoryStore.undo()?.label).toBe('Add Catalog item to project')
    expect(useAppStore.getState().referenceWorkspace.importedReferencesById[referenceId]).toBe(
      undefined,
    )
    expect(
      useAppStore.getState().referenceWorkspace.importedReferenceOrder,
    ).not.toContain(referenceId)
    expect(
      useAppStore.getState().referenceWorkspace.contentOrderByParentKey[
        `assembly:${parentAssemblyId}`
      ] ?? [],
    ).not.toContain(`reference-item-row:${referenceId}`)
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'assembly',
      assemblyId: parentAssemblyId,
    })
    expect(readReferenceRuntimeState(unrelatedReferenceId)).toEqual(
      unrelatedReferenceStateAfterAdd,
    )
    expect(useAppStore.getState().projectContent).toEqual(
      projectContentAfterPostCatalogMutation,
    )

    expect(editHistoryStore.redo()?.label).toBe('Add Catalog item to project')
    expect(
      useAppStore.getState().referenceWorkspace.importedReferencesById[referenceId],
    ).toMatchObject({
      referenceId,
      catalogItemId: 'reference:shoe-1',
      catalogFamilyKey: 'shoes',
    })
    expect(
      useAppStore.getState().referenceWorkspace.importedReferenceOrder,
    ).toContain(referenceId)
    expect(
      useAppStore.getState().referenceWorkspace.contentOrderByParentKey[
        `assembly:${parentAssemblyId}`
      ],
    ).toContain(`reference-item-row:${referenceId}`)
    expect(readReferenceRuntimeState(unrelatedReferenceId)).toEqual(
      unrelatedReferenceStateAfterAdd,
    )
    expect(useAppStore.getState().projectContent).toEqual(
      projectContentAfterPostCatalogMutation,
    )
  })

  it('keeps raw imported-reference setup calls out of canonical history', () => {
    resetStores()

    const referenceId = useAppStore.getState().addImportedReference({
      catalogItemId: 'reference:raw-shoe',
      catalogFamilyKey: 'shoes',
      fileName: 'Raw Shoe',
      fileType: 'glb',
      objectUrl: '/Catalog/shoes/raw.glb',
    })

    expect(referenceId).toBeTruthy()
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  })
})
