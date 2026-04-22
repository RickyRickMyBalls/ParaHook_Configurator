import { afterEach, describe, expect, it } from 'vitest'
import type { GraphDocument } from '../spaghetti/schema/spaghettiTypes'
import { selectViewportResultState } from '../spaghetti/selectors/selectViewportResultState'
import { buildViewportResultSelectorOptions } from '../components/buildViewportResultSelectorOptions'
import { resolveWorkspaceViewportResultModeBehavior } from '../workspace/workspaceViewportResultMode'
import type { ReferenceTransformOverride } from '../references/referenceManifest'
import { editHistoryStore } from './editHistoryStore'
import { useAppStore, type ProjectGraphDocumentEntry } from './useAppStore'
import { useBuildStatsStore } from './buildStatsStore'
import { useUiPrefsStore } from './uiPrefsStore'

const graphDocumentId = 'graph-document-derived-proof'

const graphDocumentEntry: ProjectGraphDocumentEntry = {
  graphDocumentId,
  label: 'Derived Proof Graph',
  sourceFilePath: null,
  orderIndex: 0,
}

const defaultTransform = (): ReferenceTransformOverride => ({
  position: { x: 0, y: 0, z: 0 },
  rotationDeg: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
})

const movedTransform = (x: number): ReferenceTransformOverride => ({
  ...defaultTransform(),
  position: { x, y: 0, z: 0 },
})

const resetStores = (): void => {
  editHistoryStore.clear()
  useAppStore.setState(useAppStore.getInitialState(), true)
  useBuildStatsStore.setState(useBuildStatsStore.getInitialState(), true)
  useUiPrefsStore.setState(useUiPrefsStore.getInitialState(), true)
}

const setProjectGraphDocuments = (
  graphDocuments: ProjectGraphDocumentEntry[],
): void => {
  useAppStore.setState((state) => ({
    currentProject: {
      ...state.currentProject,
      graphDocuments,
    },
  }))
}

const readDerivedBuildViewportState = () => {
  const appState = useAppStore.getState()
  const options = buildViewportResultSelectorOptions({
    currentProject: appState.currentProject,
    projectContent: appState.projectContent,
    browserGraphBuildPolicyByGraphDocumentId:
      appState.browserGraphBuildPolicyByGraphDocumentId,
    browserContentBuildPolicyByRowId: appState.browserContentBuildPolicyByRowId,
    browserInteractionGraphDocumentIds: appState.browserInteractionGraphDocumentIds,
    isInteracting: appState.isInteracting,
    delayedDraftBuildByGraphDocumentId: appState.delayedDraftBuildByGraphDocumentId,
    delayedAuthoritativeBuildByGraphDocumentId:
      appState.delayedAuthoritativeBuildByGraphDocumentId,
    requestedMode: 'auto',
    modeBehavior: resolveWorkspaceViewportResultModeBehavior('auto'),
    renderedProjectPartSet: {
      parts: [],
      viewerParts: [],
      contributingGraphDocumentIds: [],
    },
    graphDocumentsById: {
      [graphDocumentId]: {} as GraphDocument,
    },
    viewerTargetGraphDocumentId: graphDocumentId,
    sharedViewerComposition: null,
    sketchPlanePickSession: null,
    acceptedAuthoritativeGeometryResult: null,
    previewReadyAuthoritativeGeometryResult: null,
    acceptedDraftGeometryResult: null,
    committedAuthoritativeGeometryResult: null,
    committedDraftGeometryResult: null,
    acceptedPreviewBuildBundle: null,
    acceptedPreviewBuildOutputs: [],
    previewPreparation: null,
  })

  return {
    options,
    state: selectViewportResultState(options),
  }
}

const addReference = (fileName: string): string =>
  useAppStore.getState().addImportedReference({
    fileName,
    fileType: 'glb',
    objectUrl: `blob:${fileName}`,
  })

const commitReferenceMove = (
  referenceId: string,
  transform: ReferenceTransformOverride,
): void => {
  const store = useAppStore.getState()
  store.beginViewerTransformShell({ kind: 'reference', referenceId })
  store.beginActiveViewerTransformEntry('translate')
  useAppStore.getState().setActiveViewerTransformDraft(transform)
  useAppStore.getState().commitActiveViewerTransformEntry()
}

afterEach(() => {
  resetStores()
})

describe('Build Path derived sync proof', () => {
  it('recomputes the current derived build reader after canonical authored undo and redo', () => {
    resetStores()
    setProjectGraphDocuments([graphDocumentEntry])

    editHistoryStore.commitEntry({
      entryId: 'derived-build-reader-project-graph-membership',
      label: 'Change project graph membership',
      source: {
        surface: 'build-path-derived-proof',
      },
      undo: () => setProjectGraphDocuments([]),
      redo: () => setProjectGraphDocuments([graphDocumentEntry]),
    })

    expect(readDerivedBuildViewportState().options.useProjectDraftPreview).toBe(true)
    expect(readDerivedBuildViewportState().state.previewState.kind).toBe('none')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(readDerivedBuildViewportState().options.useProjectDraftPreview).toBe(false)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)

    const beforeReadUndoEntries = editHistoryStore.getUndoEntries()
    const beforeReadRedoEntries = editHistoryStore.getRedoEntries()
    readDerivedBuildViewportState()
    expect(editHistoryStore.getUndoEntries()).toEqual(beforeReadUndoEntries)
    expect(editHistoryStore.getRedoEntries()).toEqual(beforeReadRedoEntries)

    expect(editHistoryStore.redo()).not.toBeNull()
    expect(readDerivedBuildViewportState().options.useProjectDraftPreview).toBe(true)
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getRedoEntries()).toHaveLength(0)
  })

  it('keeps build runtime progress outside canonical edit history without invalidating redo', () => {
    resetStores()
    let authoredValue = 1
    editHistoryStore.commitEntry({
      entryId: 'derived-build-reader-authored-value',
      label: 'Change authored value',
      source: {
        surface: 'build-path-derived-proof',
      },
      undo: () => {
        authoredValue = 0
      },
      redo: () => {
        authoredValue = 1
      },
    })

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(authoredValue).toBe(0)
    expect(editHistoryStore.canRedo()).toBe(true)

    useBuildStatsStore.getState().resetStatsForSeq(7, ['part-a'])
    useBuildStatsStore.getState().setOverallState('building')
    useBuildStatsStore.getState().triggerCacheHitPulse()

    expect(useBuildStatsStore.getState().overallState).toBe('building')
    expect(useBuildStatsStore.getState().partOrder).toEqual(['part-a'])
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)
    expect(editHistoryStore.canRedo()).toBe(true)
  })

  it('keeps current scrub-like transform navigation no-entry without invalidating redo', () => {
    resetStores()
    const referenceId = addReference('derived-transform-scrub.glb')
    commitReferenceMove(referenceId, movedTransform(4))

    expect(editHistoryStore.undo()).not.toBeNull()
    expect(editHistoryStore.canRedo()).toBe(true)

    useAppStore.getState().beginViewerTransformShell({ kind: 'reference', referenceId })
    useAppStore.getState().setActiveViewerTransformHistoryScrubIndex(0)

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.getRedoEntries()).toHaveLength(1)
    expect(editHistoryStore.canRedo()).toBe(true)
  })
})
